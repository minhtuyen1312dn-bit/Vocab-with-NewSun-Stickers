export type VocabCategory = 'feelings' | 'actions' | 'study';

export type MascotKey =
  | 'hello'
  | 'surprised'
  | 'calm'
  | 'think'
  | 'congrats'
  | 'study';

export interface MascotAsset {
  key: MascotKey;
  src: string;
  label: string;
  alt: string;
}

export const MASCOT_ASSETS: Record<MascotKey, MascotAsset> = {
  hello: {
    key: 'hello',
    src: '/assets/aistudio/Copilot_20260113_143902_08ece5da.png',
    label: 'Xin chào (HeLLO!!)',
    alt: 'Linh vật Mặt Trời New Sun đang vẫy tay cười tươi với chữ Hello',
  },
  surprised: {
    key: 'surprised',
    src: '/assets/aistudio/Copilot_20260113_143944_1884729d.png',
    label: 'Ngạc nhiên',
    alt: 'Linh vật Mặt Trời New Sun mở to mắt và miệng tròn vì ngạc nhiên',
  },
  calm: {
    key: 'calm',
    src: '/assets/aistudio/Copilot_20260113_144229_fca00643.png',
    label: 'Thư thái',
    alt: 'Linh vật Mặt Trời New Sun nhắm mắt mỉm cười hiền hòa và đặt tay lên ngực',
  },
  think: {
    key: 'think',
    src: '/assets/aistudio/Copilot_20260113_144318_48a7c894.png',
    label: 'Suy nghĩ',
    alt: 'Linh vật Mặt Trời New Sun đặt tay lên cằm đang suy nghĩ tò mò',
  },
  congrats: {
    key: 'congrats',
    src: '/assets/aistudio/Copilot_20260113_144406_f8ba06b5.png',
    label: 'Chúc mừng (Congrats!)',
    alt: 'Linh vật Mặt Trời New Sun giơ tay reo vui với chữ Congrats',
  },
  study: {
    key: 'study',
    src: '/assets/aistudio/Copilot_20260113_150010_4096fd18.png',
    label: 'Học tập (NEW SUN)',
    alt: 'Linh vật Mặt Trời New Sun ngồi bên bàn học với máy tính xách tay và quyển sách mở',
  },
};

export interface VocabItem {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaningVi: string;
  clueVi: string;
  exampleEn: string;
  exampleVi: string;
  category: VocabCategory;
  mascotKey: MascotKey;
}

export const CATEGORY_LABELS: Record<'all' | VocabCategory, string> = {
  all: 'Tất cả (12)',
  feelings: 'Cảm xúc',
  actions: 'Hành động',
  study: 'Học tập & Giao tiếp',
};

export const VOCABULARY_LIST: VocabItem[] = [
  {
    id: 'hello',
    word: 'Hello',
    ipa: '/həˈloʊ/',
    partOfSpeech: 'Giao tiếp',
    meaningVi: 'Xin chào',
    clueVi: 'Lời chào thân thiện khi mới gặp mặt nhau.',
    exampleEn: 'Hello! Nice to meet you today.',
    exampleVi: 'Xin chào! Rất vui được gặp bạn hôm nay.',
    category: 'study',
    mascotKey: 'hello',
  },
  {
    id: 'wave',
    word: 'Wave',
    ipa: '/weɪv/',
    partOfSpeech: 'Động từ',
    meaningVi: 'Vẫy tay',
    clueVi: 'Hành động giơ tay lên cao và đung đưa để chào.',
    exampleEn: 'Wave your hand to say goodbye.',
    exampleVi: 'Hãy vẫy tay để nói lời tạm biệt.',
    category: 'actions',
    mascotKey: 'hello',
  },
  {
    id: 'surprised',
    word: 'Surprised',
    ipa: '/sərˈpraɪzd/',
    partOfSpeech: 'Tính từ',
    meaningVi: 'Ngạc nhiên',
    clueVi: 'Cảm giác bất ngờ khiến mắt mở to và miệng chữ O.',
    exampleEn: 'The little sun looks very surprised!',
    exampleVi: 'Bạn Mặt Trời nhỏ trông thật ngạc nhiên!',
    category: 'feelings',
    mascotKey: 'surprised',
  },
  {
    id: 'shock',
    word: 'Shock',
    ipa: '/ʃɑːk/',
    partOfSpeech: 'Danh từ',
    meaningVi: 'Sự sửng sốt',
    clueVi: 'Trạng thái giật mình bất ngờ trước một tin lạ.',
    exampleEn: 'What a big shock for everyone!',
    exampleVi: 'Thật là một sự sửng sốt lớn với mọi người!',
    category: 'feelings',
    mascotKey: 'surprised',
  },
  {
    id: 'calm',
    word: 'Calm',
    ipa: '/kɑːm/',
    partOfSpeech: 'Tính từ',
    meaningVi: 'Bình tĩnh, thư thái',
    clueVi: 'Nhắm mắt thở đều, tâm trạng nhẹ nhàng và bình yên.',
    exampleEn: 'Take a deep breath and stay calm.',
    exampleVi: 'Hít một hơi thật sâu và giữ bình tĩnh nhé.',
    category: 'feelings',
    mascotKey: 'calm',
  },
  {
    id: 'smile',
    word: 'Smile',
    ipa: '/smaɪl/',
    partOfSpeech: 'Động từ',
    meaningVi: 'Mỉm cười',
    clueVi: 'Nét mặt hiền hòa với đôi môi cong nhẹ đầy yêu thương.',
    exampleEn: 'Always smile when you start a new day.',
    exampleVi: 'Hãy luôn mỉm cười khi bắt đầu một ngày mới.',
    category: 'actions',
    mascotKey: 'calm',
  },
  {
    id: 'think',
    word: 'Think',
    ipa: '/θɪŋk/',
    partOfSpeech: 'Động từ',
    meaningVi: 'Suy nghĩ',
    clueVi: 'Đặt một ngón tay lên cằm để suy ngẫm tìm đáp án.',
    exampleEn: 'Let me think carefully before I answer.',
    exampleVi: 'Hãy để mình suy nghĩ thật kỹ trước khi trả lời.',
    category: 'actions',
    mascotKey: 'think',
  },
  {
    id: 'curious',
    word: 'Curious',
    ipa: '/ˈkjʊr.i.əs/',
    partOfSpeech: 'Tính từ',
    meaningVi: 'Tò mò',
    clueVi: 'Nhướn mày thắc mắc và muốn khám phá điều mới mẻ.',
    exampleEn: 'Children are curious about the bright sun.',
    exampleVi: 'Trẻ nhỏ rất tò mò về ông mặt trời rực rỡ.',
    category: 'feelings',
    mascotKey: 'think',
  },
  {
    id: 'congrats',
    word: 'Congrats',
    ipa: '/kənˈɡræts/',
    partOfSpeech: 'Giao tiếp',
    meaningVi: 'Chúc mừng',
    clueVi: 'Lời chúc vui mừng khi ai đó vừa đạt kết quả tốt.',
    exampleEn: 'Congrats! You won the vocabulary game.',
    exampleVi: 'Chúc mừng! Bạn đã chiến thắng trò chơi từ vựng.',
    category: 'study',
    mascotKey: 'congrats',
  },
  {
    id: 'happy',
    word: 'Happy',
    ipa: '/ˈhæp.i/',
    partOfSpeech: 'Tính từ',
    meaningVi: 'Vui vẻ, hạnh phúc',
    clueVi: 'Cười rạng rỡ và giơ tay reo lên đầy phấn khởi.',
    exampleEn: 'I feel so happy when I learn new words.',
    exampleVi: 'Mình cảm thấy thật vui khi học được từ mới.',
    category: 'feelings',
    mascotKey: 'congrats',
  },
  {
    id: 'study',
    word: 'Study',
    ipa: '/ˈstʌd.i/',
    partOfSpeech: 'Động từ',
    meaningVi: 'Học tập',
    clueVi: 'Ngồi ngay ngắn bên bàn với sách vở và máy tính.',
    exampleEn: 'We study English with New Sun every day.',
    exampleVi: 'Chúng mình học tiếng Anh cùng New Sun mỗi ngày.',
    category: 'study',
    mascotKey: 'study',
  },
  {
    id: 'book',
    word: 'Book',
    ipa: '/bʊk/',
    partOfSpeech: 'Danh từ',
    meaningVi: 'Quyển sách',
    clueVi: 'Đồ vật đang mở rộng trên bàn với nhiều trang giấy.',
    exampleEn: 'Open your English book to page ten.',
    exampleVi: 'Hãy mở quyển sách tiếng Anh của bạn ở trang mười.',
    category: 'study',
    mascotKey: 'study',
  },
];
