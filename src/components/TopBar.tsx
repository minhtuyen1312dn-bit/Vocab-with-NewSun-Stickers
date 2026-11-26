export type AppScreen = 'TITLE_MENU' | 'FLASHCARDS' | 'PLAYING' | 'ROUND_SUMMARY';
export type GameMode = 'quiz' | 'match' | 'spell';

interface TopBarProps {
  activeScreen: AppScreen;
  activeMode: GameMode;
  onNavigateHome: () => void;
  onOpenFlashcards: () => void;
  onStartMode: (mode: GameMode) => void;
}

export function TopBar({
  activeScreen,
  activeMode,
  onNavigateHome,
  onOpenFlashcards,
  onStartMode,
}: TopBarProps) {
  const isHome = activeScreen === 'TITLE_MENU';
  const isFlashcards = activeScreen === 'FLASHCARDS';
  const isQuiz = activeScreen === 'PLAYING' && activeMode === 'quiz';
  const isMatch = activeScreen === 'PLAYING' && activeMode === 'match';
  const isSpell = activeScreen === 'PLAYING' && activeMode === 'spell';

  const linkClass = (active: boolean) =>
    `text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-sm ${
      active
        ? 'text-orange-700 border-orange-600'
        : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
    }`;

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={onNavigateHome}
          className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-md"
        >
          New Sun Vocab
        </button>

        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center gap-6"
        >
          <button
            type="button"
            onClick={onNavigateHome}
            className={linkClass(isHome)}
          >
            Trang chủ
          </button>
          <button
            type="button"
            onClick={onOpenFlashcards}
            className={linkClass(isFlashcards)}
          >
            Kho từ vựng
          </button>
          <button
            type="button"
            onClick={() => onStartMode('quiz')}
            className={linkClass(isQuiz)}
          >
            Đoán từ
          </button>
          <button
            type="button"
            onClick={() => onStartMode('match')}
            className={linkClass(isMatch)}
          >
            Ghép thẻ
          </button>
          <button
            type="button"
            onClick={() => onStartMode('spell')}
            className={linkClass(isSpell)}
          >
            Ghép chữ
          </button>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onStartMode('quiz')}
            className="px-4 py-2 text-sm font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
          >
            Chơi ngay
          </button>
        </div>
      </div>
    </header>
  );
}
