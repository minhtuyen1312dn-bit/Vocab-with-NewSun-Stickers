import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Delete,
  Lightbulb,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { MascotKey, VOCABULARY_LIST, VocabItem } from '../data/vocabulary';
import { MascotImage } from './MascotImage';
import {
  playCorrectSound,
  playTapSound,
  playVictorySound,
  playWrongSound,
  speakEnglishWord,
} from '../utils/audio';
import { RoundResult } from './RoundSummary';

interface WordBuilderGameProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onMarkLearned: (id: string) => void;
  onComplete: (result: RoundResult) => void;
  onExit: () => void;
}

interface LetterTile {
  id: number;
  char: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRoundWords(): VocabItem[] {
  const keys: MascotKey[] = ['hello', 'surprised', 'calm', 'think', 'congrats', 'study'];
  return shuffle(
    keys.map((key) => {
      const pool = VOCABULARY_LIST.filter((v) => v.mascotKey === key);
      return pool[Math.floor(Math.random() * pool.length)];
    })
  );
}

export function WordBuilderGame({
  soundEnabled,
  onToggleSound,
  onMarkLearned,
  onComplete,
  onExit,
}: WordBuilderGameProps) {
  const roundWords = useMemo(() => pickRoundWords(), []);
  const [idx, setIdx] = useState(0);
  const [selectedTileIds, setSelectedTileIds] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const current = roundWords[idx];
  const targetChars = useMemo(() => current.word.toUpperCase().split(''), [current.word]);

  const scrambledTiles: LetterTile[] = useMemo(() => {
    const tiles = targetChars.map((char, i) => ({ id: i, char }));
    const shuffled = shuffle(tiles);
    if (shuffled.map((t) => t.char).join('') === targetChars.join('') && tiles.length > 1) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    return shuffled;
  }, [targetChars]);

  const builtWord = selectedTileIds
    .map((tid) => scrambledTiles.find((t) => t.id === tid)?.char ?? '')
    .join('');

  const handleCheck = useCallback(
    (candidateIds: number[]) => {
      const assembled = candidateIds
        .map((tid) => scrambledTiles.find((t) => t.id === tid)?.char ?? '')
        .join('');
      if (assembled === targetChars.join('')) {
        const nextStreak = streak + 1;
        setStatus('correct');
        setStreak(nextStreak);
        setBestStreak((prev) => Math.max(prev, nextStreak));
        setCorrectCount((prev) => prev + 1);
        setScore((prev) => prev + Math.max(50, 120 - hintsUsed * 20));
        onMarkLearned(current.id);
        playCorrectSound(soundEnabled);
        setTimeout(() => speakEnglishWord(current.word, soundEnabled), 180);
      } else {
        setStatus('wrong');
        setStreak(0);
        playWrongSound(soundEnabled);
      }
    },
    [current.id, current.word, hintsUsed, onMarkLearned, scrambledTiles, soundEnabled, streak, targetChars]
  );

  const handlePickTile = useCallback(
    (tileId: number) => {
      if (status === 'correct') return;
      if (selectedTileIds.includes(tileId)) return;
      if (selectedTileIds.length >= targetChars.length) return;

      playTapSound(soundEnabled);
      setStatus('idle');
      const next = [...selectedTileIds, tileId];
      setSelectedTileIds(next);

      if (next.length === targetChars.length) {
        handleCheck(next);
      }
    },
    [handleCheck, selectedTileIds, soundEnabled, status, targetChars.length]
  );

  const handleRemoveAt = (slotIdx: number) => {
    if (status === 'correct') return;
    playTapSound(soundEnabled);
    setStatus('idle');
    setSelectedTileIds((prev) => prev.filter((_, i) => i !== slotIdx));
  };

  const handleClear = () => {
    if (status === 'correct') return;
    playTapSound(soundEnabled);
    setStatus('idle');
    setSelectedTileIds([]);
  };

  const handleHint = () => {
    if (status === 'correct') return;
    const nextPos = selectedTileIds.length;
    if (nextPos >= targetChars.length) return;

    const neededChar = targetChars[nextPos];
    const availableTile = scrambledTiles.find(
      (t) => t.char === neededChar && !selectedTileIds.includes(t.id)
    );
    if (availableTile) {
      setHintsUsed((h) => h + 1);
      handlePickTile(availableTile.id);
    }
  };

  const handleNext = useCallback(() => {
    playTapSound(soundEnabled);
    if (idx + 1 >= roundWords.length) {
      playVictorySound(soundEnabled);
      onComplete({
        mode: 'spell',
        score,
        correctCount,
        totalCount: roundWords.length,
        bestStreak,
      });
      return;
    }
    setIdx((p) => p + 1);
    setSelectedTileIds([]);
    setStatus('idle');
    setHintsUsed(0);
  }, [bestStreak, correctCount, idx, onComplete, roundWords.length, score, soundEnabled]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (status === 'correct') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
        return;
      }
      if (e.key === 'Backspace') {
        setStatus('idle');
        setSelectedTileIds((prev) => prev.slice(0, -1));
        return;
      }
      const upper = e.key.toUpperCase();
      if (/^[A-Z]$/.test(upper)) {
        const matchTile = scrambledTiles.find(
          (t) => t.char === upper && !selectedTileIds.includes(t.id)
        );
        if (matchTile) {
          handlePickTile(matchTile.id);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handlePickTile, scrambledTiles, selectedTileIds, status]);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3 text-sm text-slate-600 tabular-nums">
          <span className="font-semibold text-slate-900">Luyện nghe &amp; Ghép chữ</span>
          <span aria-hidden="true">·</span>
          <span>
            Từ {idx + 1}/{roundWords.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Điểm: <strong className="text-orange-700">{score}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Chuỗi: <strong className="text-slate-900">{streak}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-orange-700" aria-hidden="true" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            )}
            {soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}
          </button>

          <button
            type="button"
            onClick={onExit}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Thoát
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-6 items-stretch">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between text-xs text-slate-500">
            <span>{current.partOfSpeech}</span>
            <span className="font-mono">{current.ipa}</span>
          </div>

          <MascotImage
            mascotKey={current.mascotKey}
            className="w-48 h-48 sm:w-56 sm:h-56 my-4 rounded-xl"
            imgClassName="w-full h-full"
          />

          <div className="w-full text-center">
            <p className="text-2xl font-bold text-slate-900">{current.meaningVi}</p>
            <p className="text-sm text-slate-500 mt-1">{current.clueVi}</p>
            <button
              type="button"
              onClick={() => speakEnglishWord(current.word, true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              Nghe phát âm từ cần ghép
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Ghép các chữ cái thành từ tiếng Anh đúng ({targetChars.length} chữ cái)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Nhấn các ô chữ bên dưới hoặc gõ trực tiếp trên bàn phím
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-6">
              {targetChars.map((_, slotIdx) => {
                const tileId = selectedTileIds[slotIdx];
                const char =
                  tileId !== undefined
                    ? scrambledTiles.find((t) => t.id === tileId)?.char
                    : '';

                let slotStyle = 'bg-slate-50 border-slate-300 text-slate-900';
                if (status === 'correct') {
                  slotStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900';
                } else if (status === 'wrong') {
                  slotStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                } else if (char) {
                  slotStyle = 'bg-orange-50 border-orange-500 text-orange-950';
                }

                return (
                  <button
                    key={slotIdx}
                    type="button"
                    disabled={!char || status === 'correct'}
                    onClick={() => handleRemoveAt(slotIdx)}
                    aria-label={char ? `Bỏ chữ ${char}` : `Ô trống ${slotIdx + 1}`}
                    className={`w-11 h-12 sm:w-12 sm:h-14 rounded-xl border-2 font-mono text-xl font-bold flex items-center justify-center transition-colors cursor-pointer disabled:cursor-default ${slotStyle}`}
                  >
                    {char}
                  </button>
                );
              })}
            </div>

            {status === 'wrong' && (
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rose-700">
                <X className="w-4 h-4" aria-hidden="true" />
                <span>Từ "{builtWord}" chưa chính xác, hãy thử sắp xếp lại nhé!</span>
              </div>
            )}

            {status === 'correct' && (
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Chính xác! {current.word} — {current.meaningVi}</span>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-3">Bảng chữ cái gợi ý</p>
              <div className="flex flex-wrap gap-2.5">
                {scrambledTiles.map((tile) => {
                  const used = selectedTileIds.includes(tile.id);
                  return (
                    <button
                      key={tile.id}
                      type="button"
                      disabled={used || status === 'correct'}
                      onClick={() => handlePickTile(tile.id)}
                      className={`min-w-[44px] h-12 px-3 rounded-xl border font-mono text-lg font-bold transition-colors cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 ${
                        used
                          ? 'bg-slate-100 border-slate-200 text-slate-300'
                          : 'bg-white border-slate-300 text-slate-900 hover:border-orange-500 hover:bg-orange-50'
                      }`}
                    >
                      {tile.char}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={status === 'correct'}
                onClick={handleHint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-amber-600" aria-hidden="true" />
                Gợi ý 1 chữ
              </button>

              <button
                type="button"
                disabled={status === 'correct' || selectedTileIds.length === 0}
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {selectedTileIds.length > 0 ? (
                  <Delete className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                )}
                Xóa lại
              </button>
            </div>

            {status === 'correct' && (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {idx + 1 >= roundWords.length ? 'Xem kết quả' : 'Từ tiếp theo'}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
