export interface Alphabet {
  char: string;
  type: "vowel" | "consonant";
  subType: string; // e.g. "单元音" | "双元音" | "单辅音" | "双辅音"
  romanization: string;
  chineseTip: string;
  description: string;
}

export interface WordComponent {
  char: string;
  meaning: string;
  pronunciation: string;
  role?: string; // e.g. "词根", "助词", "词尾", "音节", "收音"
}

export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  romanization: string;
  category: "daily" | "time" | "food" | "emotion" | "study" | "shopping" | "traffic" | "travel";
  sampleSentence?: string;
  sampleTranslation?: string;
  components?: WordComponent[];
  pronunciationGuide?: string;
  usageExplanation?: string;
}

export interface SentenceBreakdown {
  word: string;
  meaning: string;
}

export interface SentencePattern {
  id: string;
  category: "introduction" | "order" | "shopping" | "directions" | "greeting";
  korean: string;
  chinese: string;
  breakdown: SentenceBreakdown[];
}

export interface DialogueNode {
  speaker: string;
  speakerNameCn: string;
  korean: string;
  pronunciation: string;
  translation: string;
  isCurrentUser?: boolean;
}

export interface Scenario {
  id: string;
  theme: string; // e.g. "餐厅", "便利店", "学校", "机场", "旅行"
  icon: string; // lucide icon name
  description: string;
  dialogue: DialogueNode[];
  highFreqWords: { korean: string; chinese: string; romanization: string }[];
  sentenceTemplates: { korean: string; chinese: string; explanation: string }[];
}

export interface UserStats {
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD
  dailyGoalMinutes: number; // default 10
  todayMinutes: number;
  unlockedAlphabets: string[]; // chars studied
  unlockedWords: string[]; // word ids studied
  unlockedSentences: string[]; // sentence ids studied
  collectedVocabIds: string[]; // favorites vocab
  collectedSentenceIds: string[]; // favorites sentences
  quizHighScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetCount: number;
  type: "streak" | "alphabet" | "vocabulary" | "sentence" | "score";
  unlocked: boolean;
}
