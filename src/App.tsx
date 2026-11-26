import { useEffect, useState } from 'react';
import {
  BookOpen,
  Grid2x2,
  HelpCircle,
  Keyboard,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import {
  MASCOT_ASSETS,
  MascotKey,
  VOCABULARY_LIST,
} from './data/vocabulary';
import { TopBar, AppScreen, GameMode } from './components/TopBar';
import { MascotImage } from './components/MascotImage';
import { FlashcardDeck } from './components/FlashcardDeck';
import { PictureQuizGame } from './components/PictureQuizGame';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { WordBuilderGame } from './components/WordBuilderGame';
import { RoundResult, RoundSummary } from './components/RoundSummary';
import { playTapSound, speakEnglishWord } from './utils/audio';

const STORAGE_LEARNED_KEY = 'newsun_vocab_learned_v1';
const STORAGE_BEST_SCORE_KEY = 'newsun_vocab_best_score_v1';

const MASCOT_KEYS: MascotKey[] = [
  'hello',
  'surprised',
  'calm',
  'think',
  'congrats',
  'study',
];

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('TITLE_MENU');
  const [mode, setMode] = useState<GameMode>('quiz');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [heroMascot, setHeroMascot] = useState<MascotKey>('hello');
  const [roundKey, setRoundKey] = useState(0);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);

  const [learnedIds, setLearnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEARNED_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BEST_SCORE_KEY);
      return saved ? Number(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEARNED_KEY, JSON.stringify(learnedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [learnedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BEST_SCORE_KEY, String(bestScore));
    } catch {
      // Ignore storage quota errors
    }
  }, [bestScore]);

  const handleMarkLearned = (id: string) => {
    setLearnedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleToggleLearned = (id: string) => {
    setLearnedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStartMode = (nextMode: GameMode) => {
    playTapSound(soundEnabled);
    setMode(nextMode);
    setRoundKey((k) => k + 1);
    setScreen('PLAYING');
  };

  const handleCompleteRound = (result: RoundResult) => {
    setLastResult(result);
    setBestScore((prev) => Math.max(prev, result.score));
    setScreen('ROUND_SUMMARY');
  };

  const handleResetProgress = () => {
    playTapSound(soundEnabled);
    setLearnedIds([]);
    setBestScore(0);
  };

  const previewVocab =
    VOCABULARY_LIST.find((v) => v.mascotKey === heroMascot) ?? VOCABULARY_LIST[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        activeScreen={screen}
        activeMode={mode}
        onNavigateHome={() => {
          playTapSound(soundEnabled);
          setScreen('TITLE_MENU');
        }}
        onOpenFlashcards={() => {
          playTapSound(soundEnabled);
          setScreen('FLASHCARDS');
        }}
        onStartMode={handleStartMode}
      />

      <main className="flex-1">
        {screen === 'TITLE_MENU' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-slate-200 rounded-2xl p-6 sm:p-10">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Tiếng Anh cơ bản <span aria-hidden="true">·</span> 12 từ vựng qua hình ảnh
                  </p>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-3 text-balance leading-tight">
                    Học từ vựng tiếng Anh vui nhộn cùng Mặt Trời New Sun
                  </h1>
                  <p className="text-base text-slate-600 mt-4 max-w-xl leading-relaxed">
                    Khám phá biểu cảm, hành động và đồ vật quen thuộc qua bộ minh họa New Sun. Nghe phát âm chuẩn, luyện trí nhớ và ghép chữ ngay trên trình duyệt.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartMode('quiz')}
                      className="px-5 py-3 text-sm font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                    >
                      Bắt đầu nhìn hình đoán từ
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playTapSound(soundEnabled);
                        setScreen('FLASHCARDS');
                      }}
                      className="px-5 py-3 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                    >
                      Xem kho thẻ từ vựng
                    </button>

                    <button
                      type="button"
                      onClick={() => setSoundEnabled((s) => !s)}
                      aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                      className="inline-flex items-center gap-1.5 px-3.5 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-orange-700" aria-hidden="true" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      )}
                      {soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 mt-8 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Từ đã thuộc</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
                      {learnedIds.length}/{VOCABULARY_LIST.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Điểm cao nhất</p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-700 tabular-nums mt-0.5">
                      {bestScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Hình thức học</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
                      4 chế độ
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-500">
                      {previewVocab.partOfSpeech} ·{' '}
                      <span className="font-mono">{previewVocab.ipa}</span>
                    </p>
                    <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {previewVocab.word}{' '}
                      <span className="text-base font-semibold text-orange-700">
                        — {previewVocab.meaningVi}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakEnglishWord(previewVocab.word, true)}
                    aria-label={`Nghe phát âm ${previewVocab.word}`}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="my-4 flex items-center justify-center">
                  <MascotImage
                    mascotKey={heroMascot}
                    className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl"
                    imgClassName="w-full h-full"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-2">
                    Chọn biểu cảm New Sun để nghe thử:
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {MASCOT_KEYS.map((key) => {
                      const active = heroMascot === key;
                      const relatedWord =
                        VOCABULARY_LIST.find((v) => v.mascotKey === key)?.word ?? '';
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setHeroMascot(key);
                            if (relatedWord) speakEnglishWord(relatedWord, soundEnabled);
                          }}
                          aria-label={MASCOT_ASSETS[key].label}
                          className={`p-1 rounded-xl border-2 bg-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 ${
                            active
                              ? 'border-orange-600'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <MascotImage
                            mascotKey={key}
                            className="w-full aspect-square rounded-lg"
                            imgClassName="w-full h-full"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Chọn hoạt động học tập
                </h2>
                <span className="text-xs text-slate-500">
                  Phù hợp cho người mới bắt đầu
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(soundEnabled);
                    setScreen('FLASHCARDS');
                  }}
                  className="bg-white border border-slate-200 hover:border-orange-400 rounded-2xl p-5 text-left transition-colors flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-4">
                      Kho thẻ từ vựng
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Xem toàn bộ 12 từ tiếng Anh kèm phiên âm IPA, câu ví dụ và nút đọc mẫu.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-orange-700 mt-4">
                    Mở thẻ học →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartMode('quiz')}
                  className="bg-white border border-slate-200 hover:border-orange-400 rounded-2xl p-5 text-left transition-colors flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-4">
                      Nhìn hình đoán từ
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Quan sát minh họa Mặt Trời và chọn đáp án tiếng Anh đúng trong 8 câu hỏi.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-orange-700 mt-4">
                    Chơi ngay →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartMode('match')}
                  className="bg-white border border-slate-200 hover:border-orange-400 rounded-2xl p-5 text-left transition-colors flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                      <Grid2x2 className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-4">
                      Ghép thẻ đôi
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Lật 12 thẻ bài để ghép đúng 6 hình ảnh từ tiếng Anh với nghĩa tiếng Việt.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-orange-700 mt-4">
                    Chơi ngay →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartMode('spell')}
                  className="bg-white border border-slate-200 hover:border-orange-400 rounded-2xl p-5 text-left transition-colors flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                      <Keyboard className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-4">
                      Luyện nghe &amp; Ghép chữ
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Nghe phát âm, nhìn gợi ý và ghép các chữ cái thành từ tiếng Anh hoàn chỉnh.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-orange-700 mt-4">
                    Chơi ngay →
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'FLASHCARDS' && (
          <FlashcardDeck
            soundEnabled={soundEnabled}
            learnedIds={learnedIds}
            onToggleLearned={handleToggleLearned}
            onStartQuiz={() => handleStartMode('quiz')}
          />
        )}

        {screen === 'PLAYING' && mode === 'quiz' && (
          <PictureQuizGame
            key={`quiz-${roundKey}`}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((s) => !s)}
            onMarkLearned={handleMarkLearned}
            onComplete={handleCompleteRound}
            onExit={() => setScreen('TITLE_MENU')}
          />
        )}

        {screen === 'PLAYING' && mode === 'match' && (
          <MemoryMatchGame
            key={`match-${roundKey}`}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((s) => !s)}
            onMarkLearned={handleMarkLearned}
            onComplete={handleCompleteRound}
            onExit={() => setScreen('TITLE_MENU')}
          />
        )}

        {screen === 'PLAYING' && mode === 'spell' && (
          <WordBuilderGame
            key={`spell-${roundKey}`}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((s) => !s)}
            onMarkLearned={handleMarkLearned}
            onComplete={handleCompleteRound}
            onExit={() => setScreen('TITLE_MENU')}
          />
        )}

        {screen === 'ROUND_SUMMARY' && lastResult && (
          <RoundSummary
            result={lastResult}
            onPlayAgain={() => handleStartMode(lastResult.mode)}
            onOpenFlashcards={() => setScreen('FLASHCARDS')}
            onBackToMenu={() => setScreen('TITLE_MENU')}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>New Sun Vocab · Trò chơi học từ vựng tiếng Anh cơ bản</span>
          <button
            type="button"
            onClick={handleResetProgress}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Đặt lại tiến độ học
          </button>
        </div>
      </footer>
    </div>
  );
}
