import { RotateCcw, ArrowLeft } from 'lucide-react';
import { MascotImage } from './MascotImage';
import { GameMode } from './TopBar';

export interface RoundResult {
  mode: GameMode;
  score: number;
  correctCount: number;
  totalCount: number;
  bestStreak: number;
}

interface RoundSummaryProps {
  result: RoundResult;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  onOpenFlashcards: () => void;
}

const MODE_NAMES: Record<GameMode, string> = {
  quiz: 'Nhìn hình đoán từ',
  match: 'Ghép thẻ đôi',
  spell: 'Luyện nghe & Ghép chữ',
};

export function RoundSummary({
  result,
  onPlayAgain,
  onBackToMenu,
  onOpenFlashcards,
}: RoundSummaryProps) {
  const accuracy =
    result.totalCount > 0
      ? Math.round((result.correctCount / result.totalCount) * 100)
      : 0;
  const isGreat = accuracy >= 60;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 text-center">
        <p className="text-sm font-medium text-slate-500">
          Hoàn thành · {MODE_NAMES[result.mode]}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          {isGreat
            ? 'Tuyệt vời! Bạn ghi nhớ rất tốt'
            : 'Cố gắng rất tốt! Ôn thêm một lượt nữa nhé'}
        </h1>

        <div className="my-6 flex justify-center">
          <MascotImage
            mascotKey={isGreat ? 'congrats' : 'calm'}
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl"
            imgClassName="w-full h-full"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 py-5 border-y border-slate-200 max-w-lg mx-auto">
          <div>
            <p className="text-xs text-slate-500">Tổng điểm</p>
            <p className="text-2xl font-bold text-orange-700 tabular-nums mt-1">
              {result.score}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Độ chính xác</p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {accuracy}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Chuỗi tốt nhất</p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {result.bestStreak}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Chơi lại
          </button>

          <button
            type="button"
            onClick={onOpenFlashcards}
            className="px-5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Xem lại thẻ từ vựng
          </button>

          <button
            type="button"
            onClick={onBackToMenu}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Về trang chủ
          </button>
        </div>
      </div>
    </section>
  );
}
