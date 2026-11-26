import { useEffect, useState } from 'react';
import { Check, RotateCcw, Sun, Volume2, VolumeX } from 'lucide-react';
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

interface MemoryMatchGameProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onMarkLearned: (id: string) => void;
  onComplete: (result: RoundResult) => void;
  onExit: () => void;
}

interface MatchCard {
  uid: string;
  vocab: VocabItem;
  kind: 'picture' | 'meaning';
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createDeck(): MatchCard[] {
  const mascotKeys: MascotKey[] = [
    'hello',
    'surprised',
    'calm',
    'think',
    'congrats',
    'study',
  ];

  // Pick 1 word per unique mascot illustration so all 6 mascot images appear on the board
  const selectedWords = mascotKeys.map((key) => {
    const candidates = VOCABULARY_LIST.filter((v) => v.mascotKey === key);
    return candidates[Math.floor(Math.random() * candidates.length)];
  });

  const cards: MatchCard[] = [];
  selectedWords.forEach((vocab) => {
    cards.push({ uid: `${vocab.id}-pic`, vocab, kind: 'picture' });
    cards.push({ uid: `${vocab.id}-mean`, vocab, kind: 'meaning' });
  });

  return shuffle(cards);
}

export function MemoryMatchGame({
  soundEnabled,
  onToggleSound,
  onMarkLearned,
  onComplete,
  onExit,
}: MemoryMatchGameProps) {
  const [cards, setCards] = useState<MatchCard[]>(() => createDeck());
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleRestart = () => {
    playTapSound(soundEnabled);
    setCards(createDeck());
    setFlippedUids([]);
    setMatchedIds([]);
    setMoves(0);
    setStreak(0);
    setBestStreak(0);
    setScore(0);
    setIsLocked(false);
  };

  useEffect(() => {
    if (matchedIds.length === 6) {
      const timer = setTimeout(() => {
        playVictorySound(soundEnabled);
        onComplete({
          mode: 'match',
          score,
          correctCount: 6,
          totalCount: Math.max(6, moves),
          bestStreak,
        });
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [bestStreak, matchedIds.length, moves, onComplete, score, soundEnabled]);

  const handleFlip = (card: MatchCard) => {
    if (isLocked) return;
    if (flippedUids.includes(card.uid)) return;
    if (matchedIds.includes(card.vocab.id)) return;

    playTapSound(soundEnabled);
    const nextFlipped = [...flippedUids, card.uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsLocked(true);

      const firstCard = cards.find((c) => c.uid === nextFlipped[0]);
      if (firstCard && firstCard.vocab.id === card.vocab.id) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setBestStreak((prev) => Math.max(prev, nextStreak));
        setScore((prev) => prev + 120 + (nextStreak - 1) * 30);
        setMatchedIds((prev) => [...prev, card.vocab.id]);
        onMarkLearned(card.vocab.id);
        playCorrectSound(soundEnabled);
        setTimeout(() => speakEnglishWord(card.vocab.word, soundEnabled), 150);
        setTimeout(() => {
          setFlippedUids([]);
          setIsLocked(false);
        }, 420);
      } else {
        setStreak(0);
        playWrongSound(soundEnabled);
        setTimeout(() => {
          setFlippedUids([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3 text-sm text-slate-600 tabular-nums">
          <span className="font-semibold text-slate-900">Ghép thẻ đôi</span>
          <span aria-hidden="true">·</span>
          <span>
            Đã ghép: <strong className="text-slate-900">{matchedIds.length}/6</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>Số lượt: {moves}</span>
          <span aria-hidden="true">·</span>
          <span>
            Điểm: <strong className="text-orange-700">{score}</strong>
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
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Ván mới
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

      <p className="text-sm text-slate-600 mt-4">
        Lật 2 thẻ để ghép hình ảnh &amp; từ tiếng Anh với thẻ nghĩa tiếng Việt tương ứng.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
        {cards.map((card, index) => {
          const isMatched = matchedIds.includes(card.vocab.id);
          const isFlipped = isMatched || flippedUids.includes(card.uid);

          return (
            <button
              key={card.uid}
              type="button"
              disabled={isMatched || isFlipped}
              onClick={() => handleFlip(card)}
              aria-label={
                isFlipped
                  ? card.kind === 'picture'
                    ? `Thẻ từ ${card.vocab.word}`
                    : `Thẻ nghĩa ${card.vocab.meaningVi}`
                  : `Úp thẻ số ${index + 1}`
              }
              className={`h-40 sm:h-44 rounded-2xl border-2 p-3 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400'
                  : isFlipped
                  ? 'bg-white border-orange-500 shadow-sm'
                  : 'bg-slate-900 border-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {!isFlipped ? (
                <div className="flex flex-col items-center gap-2">
                  <Sun className="w-7 h-7 text-orange-400" aria-hidden="true" />
                  <span className="text-xs font-mono text-slate-300 tabular-nums">
                    Thẻ #{index + 1}
                  </span>
                </div>
              ) : card.kind === 'picture' ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <MascotImage
                    mascotKey={card.vocab.mascotKey}
                    className="w-24 h-24 rounded-lg"
                    imgClassName="w-full h-full"
                  />
                  <span className="text-base font-extrabold text-slate-900 mt-1.5 flex items-center gap-1">
                    {card.vocab.word}
                    {isMatched && (
                      <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-2">
                  <span className="text-xs text-slate-500">
                    {card.vocab.partOfSpeech} · <span className="font-mono">{card.vocab.ipa}</span>
                  </span>
                  <span className="text-lg font-bold text-slate-900 mt-1.5 leading-snug">
                    {card.vocab.meaningVi}
                  </span>
                  {isMatched && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 mt-2">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      Đã ghép
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
