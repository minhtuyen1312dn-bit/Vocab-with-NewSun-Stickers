import { useState } from 'react';
import { Volume2, Check, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import {
  CATEGORY_LABELS,
  VOCABULARY_LIST,
  VocabCategory,
  VocabItem,
} from '../data/vocabulary';
import { MascotImage } from './MascotImage';
import { playTapSound, speakEnglishWord } from '../utils/audio';

interface FlashcardDeckProps {
  soundEnabled: boolean;
  learnedIds: string[];
  onToggleLearned: (id: string) => void;
  onStartQuiz: () => void;
}

export function FlashcardDeck({
  soundEnabled,
  learnedIds,
  onToggleLearned,
  onStartQuiz,
}: FlashcardDeckProps) {
  const [category, setCategory] = useState<'all' | VocabCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hideMeaning, setHideMeaning] = useState(false);

  const filteredItems: VocabItem[] =
    category === 'all'
      ? VOCABULARY_LIST
      : VOCABULARY_LIST.filter((item) => item.category === category);

  const safeIndex = Math.min(selectedIndex, Math.max(0, filteredItems.length - 1));
  const current = filteredItems[safeIndex];
  const isLearned = learnedIds.includes(current.id);

  const handleSelectCategory = (nextCat: 'all' | VocabCategory) => {
    playTapSound(soundEnabled);
    setCategory(nextCat);
    setSelectedIndex(0);
  };

  const handlePrev = () => {
    playTapSound(soundEnabled);
    setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = () => {
    playTapSound(soundEnabled);
    setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handleSpeak = (text: string) => {
    playTapSound(soundEnabled);
    speakEnglishWord(text, true);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Kho từ vựng · {learnedIds.length}/{VOCABULARY_LIST.length} từ đã thuộc
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Học từ vựng cùng Mặt Trời New Sun
          </h1>
        </div>

        <div
          role="tablist"
          aria-label="Lọc nhóm từ vựng"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
        >
          {(Object.keys(CATEGORY_LABELS) as Array<'all' | VocabCategory>).map((key) => {
            const active = category === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectCategory(key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {CATEGORY_LABELS[key]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-stretch">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Thẻ {safeIndex + 1} / {filteredItems.length}
            </span>
            <span>{current.partOfSpeech}</span>
          </div>

          <div className="my-4 flex items-center justify-center">
            <MascotImage
              mascotKey={current.mascotKey}
              className="w-64 h-64 sm:w-72 sm:h-72 rounded-xl"
              imgClassName="w-full h-full"
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Từ trước
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
            >
              Từ tiếp theo
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">
                  {current.partOfSpeech} <span aria-hidden="true">·</span>{' '}
                  <span className="font-mono">{current.ipa}</span>
                </p>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">
                  {current.word}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => handleSpeak(current.word)}
                aria-label={`Nghe phát âm từ ${current.word}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-700 hover:bg-orange-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
              >
                <Volume2 className="w-4 h-4" aria-hidden="true" />
                Nghe phát âm
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-500">Nghĩa tiếng Việt</span>
                <button
                  type="button"
                  onClick={() => setHideMeaning((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {hideMeaning ? (
                    <>
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      Hiện nghĩa để tự ôn
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                      Ẩn nghĩa để tự nhớ
                    </>
                  )}
                </button>
              </div>

              {hideMeaning ? (
                <button
                  type="button"
                  onClick={() => setHideMeaning(false)}
                  className="mt-2 w-full py-3 px-4 text-sm font-medium text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-left hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Nhấn để xem nghĩa tiếng Việt...
                </button>
              ) : (
                <p className="text-2xl font-bold text-orange-700 mt-1">
                  {current.meaningVi}
                </p>
              )}

              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {current.clueVi}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Câu ví dụ</span>
                <button
                  type="button"
                  onClick={() => handleSpeak(current.exampleEn)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 hover:text-orange-800 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Đọc cả câu
                </button>
              </div>
              <p className="text-base font-semibold text-slate-900 mt-2">
                {current.exampleEn}
              </p>
              {!hideMeaning && (
                <p className="text-sm text-slate-500 mt-1">{current.exampleVi}</p>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                playTapSound(soundEnabled);
                onToggleLearned(current.id);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 ${
                isLearned
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              {isLearned ? 'Đã thuộc từ này' : 'Đánh dấu đã thuộc'}
            </button>

            <button
              type="button"
              onClick={onStartQuiz}
              className="px-4 py-2.5 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Kiểm tra ngay
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Chọn nhanh từ vựng ({filteredItems.length} từ)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredItems.map((item, idx) => {
            const active = idx === safeIndex;
            const learned = learnedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  playTapSound(soundEnabled);
                  setSelectedIndex(idx);
                }}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 ${
                  active
                    ? 'bg-orange-50 border-orange-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {item.word}
                  </span>
                  {learned && (
                    <Check
                      className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                      aria-label="Đã thuộc"
                    />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{item.meaningVi}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
