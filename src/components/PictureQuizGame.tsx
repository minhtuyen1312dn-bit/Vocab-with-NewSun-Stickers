import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, X, Volume2, ArrowRight, VolumeX } from 'lucide-react';
import { VOCABULARY_LIST, VocabItem } from '../data/vocabulary';
import { MascotImage } from './MascotImage';
import {
  playCorrectSound,
  playTapSound,
  playVictorySound,
  playWrongSound,
  speakEnglishWord,
} from '../utils/audio';
import { RoundResult } from './RoundSummary';

interface PictureQuizGameProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onMarkLearned: (id: string) => void;
  onComplete: (result: RoundResult) => void;
  onExit: () => void;
}

interface QuizQuestion {
  target: VocabItem;
  options: VocabItem[];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestions(count = 8): QuizQuestion[] {
  const selectedTargets = shuffle(VOCABULARY_LIST).slice(0, count);
  return selectedTargets.map((target) => {
    const validDistractors = VOCABULARY_LIST.filter(
      (item) => item.id !== target.id && item.mascotKey !== target.mascotKey
    );
    const distractors = shuffle(validDistractors).slice(0, 3);
    const options = shuffle([target, ...distractors]);
    return { target, options };
  });
}

export function PictureQuizGame({
  soundEnabled,
  onToggleSound,
  onMarkLearned,
  onComplete,
  onExit,
}: PictureQuizGameProps) {
  const questions = useMemo(() => buildQuestions(8), []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const currentQuestion = questions[currentIdx];
  const isAnswered = selectedId !== null;
  const isCorrect = selectedId === currentQuestion.target.id;

  const handleSelectOption = useCallback(
    (option: VocabItem) => {
      if (isAnswered) return;
      setSelectedId(option.id);

      if (option.id === currentQuestion.target.id) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setBestStreak((prev) => Math.max(prev, nextStreak));
        setCorrectCount((prev) => prev + 1);
        setScore((prev) => prev + 100 + Math.min(nextStreak - 1, 4) * 20);
        onMarkLearned(currentQuestion.target.id);
        playCorrectSound(soundEnabled);
        setTimeout(() => {
          speakEnglishWord(currentQuestion.target.word, soundEnabled);
        }, 180);
      } else {
        setStreak(0);
        playWrongSound(soundEnabled);
      }
    },
    [currentQuestion.target, isAnswered, onMarkLearned, soundEnabled, streak]
  );

  const handleNext = useCallback(() => {
    playTapSound(soundEnabled);
    if (currentIdx + 1 >= questions.length) {
      playVictorySound(soundEnabled);
      onComplete({
        mode: 'quiz',
        score,
        correctCount,
        totalCount: questions.length,
        bestStreak,
      });
      return;
    }
    setCurrentIdx((prev) => prev + 1);
    setSelectedId(null);
  }, [bestStreak, correctCount, currentIdx, onComplete, questions.length, score, soundEnabled]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isAnswered) {
        const num = Number(e.key);
        if (num >= 1 && num <= 4) {
          const opt = currentQuestion.options[num - 1];
          if (opt) handleSelectOption(opt);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentQuestion.options, handleNext, handleSelectOption, isAnswered]);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3 text-sm text-slate-600 tabular-nums">
          <span className="font-semibold text-slate-900">Nhìn hình đoán từ</span>
          <span aria-hidden="true">·</span>
          <span>
            Câu {currentIdx + 1}/{questions.length}
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

      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-4 overflow-hidden">
        <div
          className="h-full bg-orange-600 transition-transform duration-200 origin-left"
          style={{
            transform: `scaleX(${(currentIdx + (isAnswered ? 1 : 0)) / questions.length})`,
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-6 items-stretch">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between text-xs text-slate-500">
            <span>Gợi ý ngữ cảnh</span>
            <span>{currentQuestion.target.partOfSpeech}</span>
          </div>

          <MascotImage
            mascotKey={currentQuestion.target.mascotKey}
            className="w-56 h-56 sm:w-64 sm:h-64 my-4 rounded-xl"
            imgClassName="w-full h-full"
          />

          <p className="text-sm sm:text-base text-slate-700 text-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 w-full">
            {currentQuestion.target.clueVi}
          </p>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Chọn từ tiếng Anh phù hợp với hình ảnh
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Nhấn chọn đáp án hoặc dùng phím 1–4 trên bàn phím
            </p>

            <div className="grid grid-cols-1 gap-3 mt-5">
              {currentQuestion.options.map((opt, idx) => {
                const isThisSelected = selectedId === opt.id;
                const isThisTarget = opt.id === currentQuestion.target.id;

                let btnStyle =
                  'bg-white border-slate-200 text-slate-900 hover:border-orange-400 hover:bg-orange-50/40';
                if (isAnswered) {
                  if (isThisTarget) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                  } else if (isThisSelected) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full min-h-[56px] px-4 py-3 rounded-xl border-2 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-semibold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="text-lg font-bold block truncate">
                          {opt.word}
                        </span>
                        {isAnswered && (
                          <span className="text-xs text-slate-600 block">
                            {opt.meaningVi} · <span className="font-mono">{opt.ipa}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {isAnswered && isThisTarget && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 shrink-0">
                        <Check className="w-4 h-4" aria-hidden="true" />
                        Đúng
                      </span>
                    )}
                    {isAnswered && isThisSelected && !isThisTarget && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 shrink-0">
                        <X className="w-4 h-4" aria-hidden="true" />
                        Sai
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {isAnswered && (
            <div
              className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 font-bold text-base">
                  {isCorrect ? (
                    <Check className="w-5 h-5 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <X className="w-5 h-5 text-rose-700" aria-hidden="true" />
                  )}
                  <span>
                    {isCorrect
                      ? 'Chính xác!'
                      : `Chưa đúng — Đáp án là "${currentQuestion.target.word}"`}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  <strong>{currentQuestion.target.word}</strong> ({currentQuestion.target.ipa}):{' '}
                  {currentQuestion.target.meaningVi}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => speakEnglishWord(currentQuestion.target.word, true)}
                  aria-label="Nghe phát âm đáp án"
                  className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {currentIdx + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp theo'}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
