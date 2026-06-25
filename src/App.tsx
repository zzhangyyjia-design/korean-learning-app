import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  GraduationCap,
  Layers,
  Database,
  Bookmark,
  Zap,
  Flame,
  Utensils,
  ShoppingBag,
  School,
  Plane,
  Map,
  Search,
  Award,
  Volume2,
  RefreshCw,
  Play,
  Check,
  CheckCircle,
  X,
  XCircle,
  Info,
  Sparkles,
  Heart,
  ChevronRight,
  ChevronLeft,
  Plus,
  Clock,
  ArrowRight,
  AlertCircle,
  Calendar,
  Smile,
  Trophy,
  Star,
  User,
  HeartCrack,
  HelpCircle,
  ThumbsUp,
  Sliders,
  Send
} from "lucide-react";
import { HANGUL_ALPHABETS, VOCABULARY_LIST, SENTENCE_PATTERNS, SCENARIOS } from "./data";
import { Alphabet, Vocabulary, SentencePattern, Scenario, UserStats, Achievement } from "./types";
import { playKoreanSpeech, loadUserStats, saveUserStats, loadAchievements, saveAchievements, processDailyPunch } from "./utils";

// Synth chimes utilizing Web Audio API for rewarding gamification sounds (offline-friendly)
function playQuizChime(isCorrect: boolean) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    if (isCorrect) {
      // High cheerful ascending chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      
      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.2); // C6
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } else {
      // Lower warning tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(130, ctx.currentTime + 0.25);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Fail silently if audio context block
  }
}

export default function App() {
  // Navigation Tabs: dashboard | syllables | vocab | scenarios | practice
  const [activeTab, setActiveTab] = useState<"dashboard" | "syllables" | "vocab" | "scenarios" | "practice">("dashboard");
  
  // User profile / Statistics
  const [stats, setStats] = useState<UserStats>(() => {
    const loaded = loadUserStats();
    return processDailyPunch(loaded);
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadAchievements(loadUserStats()));
  const [toastMessage, setToastMessage] = useState<{ text: string; subText?: string } | null>(null);
  
  // Custom name config
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("korean_user_name_v1") || "韩语初学者";
  });
  
  // Goal Settings
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoalMinutes, setTempGoalMinutes] = useState(stats.dailyGoalMinutes);
  const [showReminderAlert, setShowReminderAlert] = useState(false);
  const [reminderActive, setReminderActive] = useState(() => {
    return localStorage.getItem("korean_reminder_v1") === "true";
  });

  // Track study simulation time
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => {
        const next = { ...prev, todayMinutes: Math.min(prev.todayMinutes + 1, 120) };
        saveUserStats(next);
        return next;
      });
    }, 60000); // add 1 minute every 60 seconds
    return () => clearInterval(timer);
  }, []);

  // Update achievements whenever stats change
  useEffect(() => {
    const updated = loadAchievements(stats);
    // Spot any newly unlocked achievements to toast!
    const oldUnlocked = achievements.filter(a => a.unlocked).map(a => a.id);
    const newlyUnlocked = updated.filter(a => a.unlocked && !oldUnlocked.includes(a.id));
    
    if (newlyUnlocked.length > 0) {
      const banner = newlyUnlocked[0];
      triggerToast(`🏆 获得成就: ${banner.title}`, banner.description);
    }
    
    setAchievements(updated);
    saveUserStats(stats);
  }, [stats]);

  // General Toast system
  const triggerToast = (text: string, subText?: string) => {
    setToastMessage({ text, subText });
    setTimeout(() => {
      setToastMessage(null);
    }, 45000); // close after 4.5s
  };

  const handleSpeech = async (text: string, type: "syllable" | "vocab" | "sentence", itemKey: string) => {
    await playKoreanSpeech(text);
    
    // Dynamically unlock progress based on what they listened to
    setStats(prev => {
      let updated = { ...prev };
      if (type === "syllable" && !prev.unlockedAlphabets.includes(itemKey)) {
        updated.unlockedAlphabets = [...prev.unlockedAlphabets, itemKey];
        triggerToast(`✍️ 已掌握发音: ${itemKey}`, "继续加油！");
      } else if (type === "vocab" && !prev.unlockedWords.includes(itemKey)) {
        updated.unlockedWords = [...prev.unlockedWords, itemKey];
      } else if (type === "sentence" && !prev.unlockedSentences.includes(itemKey)) {
        updated.unlockedSentences = [...prev.unlockedSentences, itemKey];
      }
      saveUserStats(updated);
      return updated;
    });
  };

  // Toggle favorite helper
  const toggleFavoriteVocab = (id: string) => {
    setStats(prev => {
      const exists = prev.collectedVocabIds.includes(id);
      const updated = {
        ...prev,
        collectedVocabIds: exists
          ? prev.collectedVocabIds.filter(vId => vId !== id)
          : [...prev.collectedVocabIds, id]
      };
      if (!exists) {
        triggerToast("💖 已收藏单词", "可以在词汇库筛选中查看收藏词");
      }
      saveUserStats(updated);
      return updated;
    });
  };

  const toggleFavoriteSentence = (id: string) => {
    setStats(prev => {
      const exists = prev.collectedSentenceIds.includes(id);
      const updated = {
        ...prev,
        collectedSentenceIds: exists
          ? prev.collectedSentenceIds.filter(sId => sId !== id)
          : [...prev.collectedSentenceIds, id]
      };
      saveUserStats(updated);
      return updated;
    });
  };

  // --- SUB-STATES FOR SPECIFIC MODULES ---

  // Alphabet state
  const [selectedLetterTab, setSelectedLetterTab] = useState<"all" | "vowel" | "consonant">("all");
  const [syllableStudyMode, setSyllableStudyMode] = useState<"grid" | "slides" | "test">("grid");
  const [slideIndex, setSlideIndex] = useState(0);
  const [syllableTestQuestion, setSyllableTestQuestion] = useState<Alphabet | null>(null);
  const [syllableTestChoices, setSyllableTestChoices] = useState<Alphabet[]>([]);
  const [syllableTestFeedback, setSyllableTestFeedback] = useState<{ isCorrect: boolean; selected: string } | null>(null);

  // Vocabulary list view states
  const [selectedVocabCategory, setSelectedVocabCategory] = useState<"all" | "daily" | "time" | "food" | "emotion" | "study" | "shopping" | "traffic" | "travel" | "favorites">("all");
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchWordQuery, setSearchWordQuery] = useState("");

  // Integrated TTS Settings state synchronized with localStorage
  const [ttsSettings, setTtsSettings] = useState({
    style: "assistant" as "assistant" | "slow_tutor" | "native_fast",
    soundEffect: true,
    rate: 0.88,
    pitch: 1.02
  });

  // Track the currently highlighted vocabulary decomposition component index
  const [activeComponentIdx, setActiveComponentIdx] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("korean_tts_settings_v1");
      if (stored) {
        try {
          setTtsSettings(JSON.parse(stored));
        } catch (e) {
          // ignore parsing error
        }
      }
    }
  }, []);

  const updateTtsSettings = (newSettings: typeof ttsSettings) => {
    setTtsSettings(newSettings);
    localStorage.setItem("korean_tts_settings_v1", JSON.stringify(newSettings));
  };

  // Scenarios Independent Tab States
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [scenarioDialogueMode, setScenarioDialogueMode] = useState<"bilingual" | "korean" | "chinese">("bilingual");
  
  // Custom AI Scenario dialogue active test challenge
  const [scenarioChallengeLoading, setScenarioChallengeLoading] = useState(false);
  const [scenarioChallengeData, setScenarioChallengeData] = useState<any | null>(null);
  const [userChallengeReply, setUserChallengeReply] = useState("");
  const [challengeResultLoading, setChallengeResultLoading] = useState(false);
  const [challengeEvaluation, setChallengeEvaluation] = useState<any | null>(null);

  // Vocabulary Quiz Game States
  const [quizDifficulty, setQuizDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [quizActive, setQuizActive] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState<Vocabulary | null>(null);
  const [quizChoices, setQuizChoices] = useState<Vocabulary[]>([]);
  const [quizSelectedId, setQuizSelectedId] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // New States for Vocabulary Quiz Enhancements with localStorage synchronization
  const [quizMode, setQuizMode] = useState<"kr_to_cn" | "cn_to_kr">("kr_to_cn");
  const [quizPool, setQuizPool] = useState<"all" | "wrong">("all");
  const [wrongAnswers, setWrongAnswers] = useState<Vocabulary[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("korean_vocab_wrong_answers_v1");
      if (stored) {
        try {
          const ids: string[] = JSON.parse(stored);
          const list = ids.map(id => VOCABULARY_LIST.find(v => v.id === id)).filter(Boolean) as Vocabulary[];
          setWrongAnswers(list);
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  const saveWrongAnswers = (list: Vocabulary[]) => {
    setWrongAnswers(list);
    localStorage.setItem("korean_vocab_wrong_answers_v1", JSON.stringify(list.map(v => v.id)));
  };

  // AI Free Spelling Correction Workspace
  const [aiErrorInput, setAiErrorInput] = useState("");
  const [aiCorrectLoading, setAiCorrectLoading] = useState(false);
  const [aiCorrectResult, setAiCorrectResult] = useState<any | null>(null);
  const [aiErrorMessage, setAiErrorMessage] = useState("");

  // Generate a random alphabet test question
  const generateAlphabetQuestion = () => {
    const randomAlphabet = HANGUL_ALPHABETS[Math.floor(Math.random() * HANGUL_ALPHABETS.length)];
    const options = [randomAlphabet];
    while (options.length < 4) {
      const extra = HANGUL_ALPHABETS[Math.floor(Math.random() * HANGUL_ALPHABETS.length)];
      if (!options.some(o => o.char === extra.char)) {
        options.push(extra);
      }
    }
    setSyllableTestQuestion(randomAlphabet);
    setSyllableTestChoices(options.sort(() => Math.random() - 0.5));
    setSyllableTestFeedback(null);
  };

  // Generate a vocabulary quiz question
  const generateQuizQuestion = (curIndex: number, currentList: Vocabulary[]) => {
    const totalQuestions = quizDifficulty === "easy" ? 5 : quizDifficulty === "medium" ? 10 : 15;
    if (curIndex >= totalQuestions) {
      setQuizCompleted(true);
      // Process High Score Achievement updating
      setStats(prev => {
        const nextScore = Math.max(prev.quizHighScore, quizScore);
        const updated = { ...prev, quizHighScore: nextScore };
        saveUserStats(updated);
        return updated;
      });
      return;
    }

    const item = currentList[Math.floor(Math.random() * currentList.length)];
    const options = [item];
    
    // Fill option distractors safely from all Vocab list up to 4 choices
    while (options.length < 4 && options.length < VOCABULARY_LIST.length) {
      const extra = VOCABULARY_LIST[Math.floor(Math.random() * VOCABULARY_LIST.length)];
      if (!options.some(o => o.id === extra.id)) {
        options.push(extra);
      }
    }
    setQuizCorrectAnswer(item);
    setQuizChoices(options.sort(() => Math.random() - 0.5));
    setQuizSelectedId(null);

    // Auto-play pronunciation in Korean->Chinese mode immediately
    if (quizMode === "kr_to_cn" && item) {
      playKoreanSpeech(item.word, undefined, undefined, true);
    }
  };

  // Run AI Free Spelling Connection API
  const handleAiCorrection = async () => {
    if (!aiErrorInput.trim()) return;
    setAiCorrectLoading(true);
    setAiErrorMessage("");
    setAiCorrectResult(null);
    try {
      const res = await fetch("/api/ai/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: aiErrorInput })
      });
      const data = await res.json();
      if (res.ok) {
        setAiCorrectResult(data);
      } else {
        setAiErrorMessage(data.error || "获取纠错失败，确保已配置 API 密钥");
      }
    } catch (err: any) {
      setAiErrorMessage("服务器网络异常，请稍后重试");
    } finally {
      setAiCorrectLoading(false);
    }
  };

  // Start scenario-specific conversational AI challenge
  const handleScenarioChallenge = async (themeName: string) => {
    setScenarioChallengeLoading(true);
    setChallengeEvaluation(null);
    setUserChallengeReply("");
    try {
      const res = await fetch("/api/ai/generate-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: themeName })
      });
      const data = await res.json();
      if (res.ok) {
        setScenarioChallengeData(data);
      } else {
        triggerToast("⚠️ 提示", data.error || "生成互动遭遇挑战失败（需绑定API密钥）");
      }
    } catch (err) {
      triggerToast("⚠️ 网络异常", "未能成功连接AI助手");
    } finally {
      setScenarioChallengeLoading(false);
    }
  };

  // Evaluate user scenario response via correction API
  const submitScenarioResponse = async () => {
    if (!userChallengeReply.trim()) return;
    setChallengeResultLoading(true);
    try {
      const res = await fetch("/api/ai/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: userChallengeReply })
      });
      const data = await res.json();
      if (res.ok) {
        setChallengeEvaluation(data);
        // Play response standard TTS
        if (data.corrected) {
          playKoreanSpeech(data.corrected);
        }
      } else {
        triggerToast("⚠️ AI评价失败", data.error || "无法连通AI评分，请重试");
      }
    } catch (err) {
      triggerToast("⚠️ 网络异常", "网络服务暂时不可用");
    } finally {
      setChallengeResultLoading(false);
    }
  };

  // Filter Alphabets
  const filteredAlphabets = HANGUL_ALPHABETS.filter(a => {
    if (selectedLetterTab === "all") return true;
    return a.type === selectedLetterTab;
  });

  // Filter Vocabulary
  const filteredVocab = VOCABULARY_LIST.filter(v => {
    const matchesSearch = v.word.includes(searchWordQuery) || v.translation.includes(searchWordQuery);
    if (!matchesSearch) return false;
    if (selectedVocabCategory === "all") return true;
    if (selectedVocabCategory === "favorites") {
      return stats.collectedVocabIds.includes(v.id);
    }
    if (selectedVocabCategory === "wrong") {
      return wrongAnswers.some(w => w.id === v.id);
    }
    return v.category === selectedVocabCategory;
  });

  // Start Quiz
  const startQuiz = () => {
    const poolList = quizPool === "wrong" ? wrongAnswers : VOCABULARY_LIST;
    if (poolList.length === 0) {
      triggerToast("⚠️ 错题本为空", "当前错题本中没有任何单词，请在学习过程中或测验中积累错题！");
      return;
    }
    setQuizActive(true);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizStreak(0);
    setQuizCompleted(false);
    generateQuizQuestion(0, poolList);
  };

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex overflow-hidden text-slate-800 font-sans select-none antialiased">
      
      {/* 1. Sleek Navigation Rail Container */}
      <nav id="sidebar" className="w-[88px] bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-8 justify-between z-10">
        
        {/* Elegant top badge logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-violet-200 transform transition hover:scale-105">
            가
          </div>
          <span className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">学习平台</span>
        </div>

        {/* Action icons selection body with beautiful tooltips */}
        <div className="flex flex-col gap-5 flex-1 justify-center">
          
          {/* Dashboard Tab Button */}
          <button
            id="nav-dashboard"
            onClick={() => { setActiveTab("dashboard"); setIsFlipped(false); }}
            className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative group flex items-center justify-center ${
              activeTab === "dashboard"
                ? "bg-violet-50 text-violet-600 shadow-sm"
                : "text-slate-400 hover:text-violet-500 hover:bg-slate-50"
            }`}
          >
            <Layers className="w-6 h-6" />
            <span className="absolute left-20 bg-slate-900 text-white text-xs py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-md font-semibold">
              学习主页
            </span>
          </button>

          {/* 40 音 Tab Button */}
          <button
            id="nav-syllables"
            onClick={() => { setActiveTab("syllables"); generateAlphabetQuestion(); }}
            className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative group flex items-center justify-center ${
              activeTab === "syllables"
                ? "bg-violet-50 text-violet-600 shadow-sm"
                : "text-slate-400 hover:text-violet-500 hover:bg-slate-50"
            }`}
          >
            <GraduationCap className="w-6 h-6" />
            <span className="absolute left-20 bg-slate-900 text-white text-xs py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-md font-semibold">
              40音发音
            </span>
          </button>

          {/* Vocabulary Card */}
          <button
            id="nav-vocab"
            onClick={() => { setActiveTab("vocab"); setCurrentFlashcardIndex(0); }}
            className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative group flex items-center justify-center ${
              activeTab === "vocab"
                ? "bg-violet-50 text-violet-600 shadow-sm"
                : "text-slate-400 hover:text-violet-500 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="absolute left-20 bg-slate-900 text-white text-xs py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-md font-semibold">
              词汇与句型
            </span>
          </button>

          {/* Situational Contexts */}
          <button
            id="nav-scenarios"
            onClick={() => { setActiveTab("scenarios"); setScenarioChallengeData(null); }}
            className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative group flex items-center justify-center ${
              activeTab === "scenarios"
                ? "bg-violet-50 text-violet-600 shadow-sm"
                : "text-slate-400 hover:text-violet-500 hover:bg-slate-50"
            }`}
          >
            <Utensils className="w-6 h-6" />
            <span className="absolute left-20 bg-slate-900 text-white text-xs py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-md font-semibold">
              实景对话
            </span>
          </button>

          {/* Gamified Quiz Arena & AI Tool */}
          <button
            id="nav-practice"
            onClick={() => { setActiveTab("practice"); setAiCorrectResult(null); }}
            className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative group flex items-center justify-center ${
              activeTab === "practice"
                ? "bg-violet-50 text-violet-600 shadow-sm"
                : "text-slate-400 hover:text-violet-500 hover:bg-slate-50"
            }`}
          >
            <Zap className="w-6 h-6" />
            <span className="absolute left-20 bg-slate-900 text-white text-xs py-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-md font-semibold">
              AI纠错与测试
            </span>
          </button>

        </div>

        {/* Bottom profile settings trigger */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
          <button 
            id="trigger-settings"
            onClick={() => {
              setTempGoalMinutes(stats.dailyGoalMinutes);
              setShowGoalModal(true);
            }}
            className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-violet-50 hover:text-violet-600 transition-colors cursor-pointer border border-slate-200"
          >
            <Sliders className="w-5 h-5" />
          </button>
        </div>

      </nav>

      {/* Main Core View Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Dynamic Warning Indicator / Float Toasts */}
        {toastMessage && (
          <div id="toast-view" className="absolute top-6 right-6 z-50 animate-bounce max-w-sm bg-slate-950 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3 border border-violet-500/30">
            <Trophy className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white">{toastMessage.text}</span>
              {toastMessage.subText && <span className="text-slate-400 text-xs mt-0.5">{toastMessage.subText}</span>}
            </div>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {/* 2. Top Sleek Header Block */}
        <header id="main-header" className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            
            {/* User avatar mockup */}
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold border-2 border-violet-200">
              <User className="w-5 h-5" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <form onSubmit={(e) => { e.preventDefault(); setIsEditingName(false); localStorage.setItem("korean_user_name_v1", userName); }} className="flex items-center gap-1">
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                      className="px-2 py-0.5 border border-violet-300 rounded text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      maxLength={15}
                      autoFocus
                    />
                    <button type="submit" className="text-[11px] text-green-600 font-bold px-1.5 hover:underline">确定</button>
                  </form>
                ) : (
                  <div className="flex items-center gap-1.5 group">
                    <h1 className="text-xl font-bold text-slate-900">{userName}</h1>
                    <button 
                      onClick={() => setIsEditingName(true)} 
                      className="text-slate-400 group-hover:text-violet-600 text-xs transition-colors hover:underline"
                    >
                      (修改名字)
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {stats.todayMinutes >= stats.dailyGoalMinutes ? "🎉 达成今日学习目标！" : "✨ 今天也是打卡温习韩语的好日子哦。"}
              </p>
            </div>
          </div>

          {/* Compact learning progress panel widget */}
          <div className="flex items-center gap-5 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Streak metrics */}
            <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <Flame className="w-5 h-5 text-orange-600 animate-pulse fill-orange-50" />
              <div className="flex flex-col text-left">
                <span className="text-sm font-extrabold text-orange-600">{stats.streak} 天</span>
                <span className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">连续学习打卡</span>
              </div>
            </div>

            {/* Daily goals progress bars widget */}
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center justify-between w-[150px] text-[10px] font-bold text-slate-500">
                <span>每日计划</span>
                <span className="text-slate-700">{stats.todayMinutes} / {stats.dailyGoalMinutes} 分钟</span>
              </div>
              <div 
                onClick={() => {
                  setTempGoalMinutes(stats.dailyGoalMinutes);
                  setShowGoalModal(true);
                }} 
                className="w-[150px] h-3 bg-slate-200 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-violet-400 transition-all"
                title="点击更新计划时长"
              >
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min((stats.todayMinutes / stats.dailyGoalMinutes) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Reminder Alert Bell Toggle */}
            <button 
              onClick={() => {
                const toggled = !reminderActive;
                setReminderActive(toggled);
                localStorage.setItem("korean_reminder_v1", toggled ? "true" : "false");
                setShowReminderAlert(true);
                setTimeout(() => setShowReminderAlert(false), 3000);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                reminderActive ? "bg-amber-50 border-amber-300 text-amber-600" : "bg-white border-slate-200 text-slate-400"
              }`}
              title="设置每日学习提醒"
            >
              <Clock className="w-4 h-4" />
            </button>

          </div>
        </header>

        {/* Primary Page Canvas */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          {/* Alert panel for reminder setup confirmation */}
          {showReminderAlert && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in text-sm text-amber-800">
              <span className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-amber-600" />
                {reminderActive ? "🔔 已成功开启每日 10 分钟定时学习打卡提醒！" : "🔕 已关闭主动学习提醒。"}
              </span>
              <button onClick={() => setShowReminderAlert(false)} className="text-amber-600 font-bold hover:underline text-xs">知道啦</button>
            </div>
          )}

          {/* ======================================= */}
          {/* VIEWS SECTIONS DETAILED IMPL */}
          {/* ======================================= */}

          {/* TABS 1: DASHBOARD COMPREHENSIVE LANDING */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Learning Roadmap progress */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Visual streak tracker panel */}
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-[32px] p-8 text-white shadow-xl flex items-center justify-between">
                  {/* Subtle decorative circle grids background */}
                  <div className="absolute right-0 top-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="flex flex-col gap-3 max-w-md z-15">
                    <span className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-1 rounded-full text-xs font-bold w-fit tracking-wider">
                      初学者推荐路径
                    </span>
                    <h2 className="text-2xl font-bold leading-snug">韩语学习互动一体化平台</h2>
                    <p className="text-slate-300 text-sm">
                      本平台专为零基础学员设计，从韩语40个元辅音、高频核心词、到经典对话、再到在线AI语法纠错与发音练习，提供全方位闭环体验。
                    </p>
                    <div className="flex gap-4 mt-2">
                      <button 
                        onClick={() => setActiveTab("syllables")} 
                        className="bg-white text-indigo-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition hover:bg-slate-100 shadow-md cursor-pointer"
                      >
                        从零学40音 <ChevronRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setActiveTab("practice")} 
                        className="bg-violet-600/50 hover:bg-violet-600/80 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition border border-violet-400/20"
                      >
                        去体验AI评测 <Sparkles className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-center gap-1 bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                    <span className="text-4xl">📚</span>
                    <span className="text-lg font-extrabold mt-1">
                      {Math.round((stats.unlockedAlphabets.length / 40) * 100)}%
                    </span>
                    <span className="text-[10px] text-slate-300">40音点读进度</span>
                    <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-emerald-400 h-full" style={{ width: `${(stats.unlockedAlphabets.length / 40) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Categories Cards Quick Entrance */}
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-violet-600 rounded-full"></span> 核心功能四大模块
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Item 1 */}
                  <div 
                    onClick={() => { setActiveTab("syllables"); setSyllableStudyMode("grid"); }}
                    className="p-6 bg-white border border-slate-200 rounded-[28px] hover:border-violet-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                        字母
                      </div>
                      <span className="text-xs text-slate-400 font-medium">40个字母</span>
                    </div>
                    <div className="mt-6 text-left">
                      <h4 className="font-extrabold text-base text-slate-900 group-hover:text-violet-600 transition-colors">韩语40音发音练习</h4>
                      <p className="text-xs text-slate-500 mt-1">展示元音加辅音的标准发音、罗马拼音、嘴型说明与发音播放，快速测验。</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div 
                    onClick={() => { setActiveTab("vocab"); setSelectedVocabCategory("all"); }}
                    className="p-6 bg-white border border-slate-200 rounded-[28px] hover:border-violet-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                        词
                      </div>
                      <span className="text-xs text-slate-400 font-medium">33个核心词汇</span>
                    </div>
                    <div className="mt-6 text-left">
                      <h4 className="font-extrabold text-base text-slate-900 group-hover:text-pink-600 transition-colors">词汇翻转卡片学习</h4>
                      <p className="text-xs text-slate-500 mt-1">涵盖日常生活、饮食、情绪、时间。支持翻转记忆卡与中韩双向播放。</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div 
                    onClick={() => setActiveTab("scenarios")}
                    className="p-6 bg-white border border-slate-200 rounded-[28px] hover:border-violet-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                        景
                      </div>
                      <span className="text-xs text-slate-400 font-medium">5个经典生活场景</span>
                    </div>
                    <div className="mt-6 text-left">
                      <h4 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">沉浸式多语场景会话</h4>
                      <p className="text-xs text-slate-500 mt-1">餐厅便利店等对话模式、高频核心词汇。集成AI模拟真实对话遭遇与评分挑战。</p>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div 
                    onClick={() => { setActiveTab("practice"); }}
                    className="p-6 bg-white border border-slate-200 rounded-[28px] hover:border-violet-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                        智
                      </div>
                      <span className="text-xs text-emerald-500 font-bold">AI 强助攻</span>
                    </div>
                    <div className="mt-6 text-left">
                      <h4 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-600 transition-colors">AI 智能语法纠错</h4>
                      <p className="text-xs text-slate-500 mt-1">任意输入韩文，大模型智能分析，中方详细语法对比，错点梳理，发音校正。</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Sidebar stats/accomplishments container */}
              <div className="flex flex-col gap-6">

                {/* Dynamic streak calendars mockups */}
                <div className="p-6 bg-white border border-slate-200 rounded-[28px] text-center flex flex-col gap-4 shadow-sm text-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-violet-600" /> 学习连续签到记录
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold font-mono">Streak Calendar</span>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 my-2">
                    {["日", "一", "二", "三", "四", "五", "六"].map((w, i) => (
                      <span key={i} className="text-[10px] text-slate-400 font-bold">{w}</span>
                    ))}
                    {Array.from({ length: 14 }).map((_, idx) => {
                      // Mocking signed days visually using index
                      const isSigned = idx === 11 || idx === 12 || idx === 13;
                      return (
                        <div 
                          key={idx} 
                          className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-bold ${
                            isSigned 
                              ? "bg-violet-600 text-white font-extrabold shadow-sm" 
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {idx + 10}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span>您的积分排行：</span>
                    <span className="font-bold text-violet-600 font-mono">初试身手 Lvl.1</span>
                  </div>
                </div>

                {/* Quick achievements banner list */}
                <div className="p-6 bg-white border border-slate-200 rounded-[28px] shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500 animate-pulse" /> 学习成就勋章
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500">
                      已解锁 {achievements.filter(a => a.unlocked).length} / {achievements.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {achievements.map((item) => (
                      <div 
                        key={item.id} 
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                          item.unlocked 
                            ? "bg-amber-50/50 border-amber-200/60" 
                            : "bg-slate-50/90 border-slate-100 opacity-60"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 ${
                          item.unlocked ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-400"
                        }`}>
                          🏅
                        </div>
                        <div className="text-left">
                          <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                          <p className="text-[10px] text-slate-500 leading-normal">{item.description}</p>
                          <span className={`text-[9px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded ${
                            item.unlocked ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-500"
                          }`}>
                            {item.unlocked ? "已解锁" : "未解锁"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TABS 2: 40音 SPECIALIZED MODULE */}
          {activeTab === "syllables" && (
            <div className="flex flex-col gap-6">
              
              {/* Syllable view toolbar controls */}
              <div className="bg-white border border-slate-200 p-4 rounded-[24px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => { setSyllableStudyMode("grid"); }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      syllableStudyMode === "grid" ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🎹 全览式点读模式
                  </button>
                  <button 
                    onClick={() => { setSyllableStudyMode("slides"); setSlideIndex(0); }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      syllableStudyMode === "slides" ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📖 拼读卡片逐个学 (Flashcard carousel)
                  </button>
                  <button 
                    onClick={() => { setSyllableStudyMode("test"); generateAlphabetQuestion(); }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      syllableStudyMode === "test" ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🎯 字母发音小闯关
                  </button>
                </div>

                {syllableStudyMode === "grid" && (
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setSelectedLetterTab("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedLetterTab === "all" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}
                    >
                      全部 ({HANGUL_ALPHABETS.length})
                    </button>
                    <button 
                      onClick={() => setSelectedLetterTab("vowel")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedLetterTab === "vowel" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}
                    >
                      元音 (21)
                    </button>
                    <button 
                      onClick={() => setSelectedLetterTab("consonant")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedLetterTab === "consonant" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}
                    >
                      辅音 (19)
                    </button>
                  </div>
                )}

              </div>

              {/* Sub Mode A: Interactive Grid 点读面板 */}
              {syllableStudyMode === "grid" && (
                <div className="flex flex-col gap-6">
                  
                  {/* Explanation card info */}
                  <div className="bg-violet-50 text-violet-950 border border-violet-100 p-5 rounded-[24px] text-sm text-left flex items-start gap-3">
                    <Info className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-violet-900">💡 40音学习指引:</h4>
                      <p className="mt-1 leading-relaxed text-xs text-violet-950/80">
                        韩语是表音拼音文字，由 <b>21个元音</b> 和 <b>19个辅音</b> 拼合而成。点击下表中的每个字母卡片，听到韩国首尔标准音播报，对照中文发音提示、罗马拼音和舌位细节进行快速跟读。听过发音后，卡片左上角会点亮绿色的【已阅】圆标。
                      </p>
                    </div>
                  </div>

                  {/* Grid layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {filteredAlphabets.map((item) => {
                      const isUnlocked = stats.unlockedAlphabets.includes(item.char);
                      return (
                        <div 
                          key={item.char}
                          onClick={() => handleSpeech(item.char, "syllable", item.char)}
                          className={`relative p-5 bg-white border rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer select-none ${
                            isUnlocked ? "border-emerald-300 ring-2 ring-emerald-100/50" : "border-slate-200 hover:border-violet-300"
                          }`}
                        >
                          {/* Top-right classification badge */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                              {item.subType}
                            </span>
                          </div>

                          {/* Top-left learned checkmark dot */}
                          {isUnlocked && (
                            <div className="absolute top-3 left-3 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                              ✓
                            </div>
                          )}

                          <div className="text-4xl font-extrabold text-slate-900 mt-2 font-mono">
                            {item.char}
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-xs font-mono font-bold text-violet-600">[{item.romanization}]</span>
                            <span className="text-[10px] text-slate-400 font-medium">提示: {item.chineseTip}</span>
                          </div>

                          <button className="h-7 w-7 bg-slate-100 hover:bg-violet-600 hover:text-white rounded-full flex items-center justify-center transition-colors">
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* Sub Mode B: Carousel Card 逐个轮播学习 */}
              {syllableStudyMode === "slides" && (
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto py-4 w-full">
                  
                  <div className="bg-white border border-slate-200 rounded-[36px] shadow-lg w-full overflow-hidden text-center flex flex-col">
                    
                    {/* Slide card header indicators */}
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>卡片学习 {slideIndex + 1} / {HANGUL_ALPHABETS.length}</span>
                      <span className="bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full text-[10px]">
                        {HANGUL_ALPHABETS[slideIndex].subType}
                      </span>
                    </div>

                    {/* Core visual body */}
                    <div className="p-8 flex flex-col items-center justify-center gap-5 min-h-[300px]">
                      
                      <div className="text-7xl font-black text-slate-900 tracking-normal drop-shadow-sm font-mono my-2 select-all">
                        {HANGUL_ALPHABETS[slideIndex].char}
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400">罗马拼音 / 发音标志:</span>
                          <span className="text-base font-extrabold font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                            [{HANGUL_ALPHABETS[slideIndex].romanization}]
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400">中文拟音提示:</span>
                          <span className="text-sm font-bold text-slate-800">
                            {HANGUL_ALPHABETS[slideIndex].chineseTip}
                          </span>
                        </div>
                      </div>

                      <p className="bg-slate-50 text-slate-600 text-xs leading-relaxed px-5 py-3 rounded-2xl text-left border border-slate-100 max-w-sm mt-3 border-l-4 border-l-violet-500">
                        <b>发音技巧:</b> {HANGUL_ALPHABETS[slideIndex].description}
                      </p>

                      <div className="flex gap-3 mt-4">
                        <button 
                          onClick={() => handleSpeech(HANGUL_ALPHABETS[slideIndex].char, "syllable", HANGUL_ALPHABETS[slideIndex].char)}
                          className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-md hover:shadow-violet-200 transition-all cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" /> 播放标准音
                        </button>
                      </div>

                    </div>

                    {/* Progress tracking bar */}
                    <div className="w-full h-1.5 bg-slate-200">
                      <div 
                        className="bg-violet-600 h-full transition-all duration-300"
                        style={{ width: `${((slideIndex + 1) / HANGUL_ALPHABETS.length) * 100}%` }}
                      ></div>
                    </div>

                    {/* Navigation controllers */}
                    <div className="bg-slate-50/50 p-6 border-t border-slate-150 flex items-center justify-between gap-4">
                      <button 
                        onClick={() => {
                          setSlideIndex(prev => Math.max(prev - 1, 0));
                        }}
                        disabled={slideIndex === 0}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 text-slate-700 disabled:opacity-40 select-none flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> 上一个
                      </button>

                      <span className="text-xs font-mono font-bold text-slate-400">
                        {slideIndex + 1} / {HANGUL_ALPHABETS.length}
                      </span>

                      <button 
                        onClick={() => {
                          setSlideIndex(prev => Math.min(prev + 1, HANGUL_ALPHABETS.length - 1));
                        }}
                        disabled={slideIndex === HANGUL_ALPHABETS.length - 1}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 text-slate-700 disabled:opacity-40 select-none flex items-center gap-1 cursor-pointer"
                      >
                        下一个 <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              )}

              {/* Sub Mode C: Audio Quiz 发音听力大闯关 (Syllable Quiz) */}
              {syllableStudyMode === "test" && (
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto py-2 w-full text-center">
                  
                  <div className="bg-slate-900 text-white rounded-[36px] shadow-2xl p-8 border border-slate-800 w-full relative">
                    
                    <span className="absolute top-6 right-6 font-mono text-[10px] text-slate-400 tracking-wider">
                      ALPHABET GAME
                    </span>

                    <h3 className="font-extrabold text-lg text-slate-200 mb-2">听发音辨认韩语字母</h3>
                    <p className="text-slate-400 text-xs mb-6">点击声波按钮，仔细聆听韩语真声音频，从下方选项中挑选出正确的配套韩文字符。</p>

                    {syllableTestQuestion && (
                      <div className="flex flex-col items-center justify-center gap-5 my-6">
                        
                        {/* Audio trigger button card */}
                        <div className="flex flex-col items-center gap-3">
                          <button 
                            onClick={() => playKoreanSpeech(syllableTestQuestion.char, undefined, undefined, true)}
                            className="w-24 h-24 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/30 cursor-pointer"
                            title="播放标准发音（1秒以内）"
                          >
                            <Volume2 className="w-10 h-10" />
                          </button>
                          
                          <button 
                            onClick={() => playKoreanSpeech(syllableTestQuestion.char, undefined, undefined, true)}
                            className="text-xs text-violet-400 hover:text-violet-300 font-bold font-sans flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> 重复播放标准读音
                          </button>
                        </div>

                        {/* Options choices grid */}
                        <div className="grid grid-cols-2 gap-4 w-full mt-4">
                          {syllableTestChoices.map((choice) => {
                            const isSelected = syllableTestFeedback?.selected === choice.char;
                            const isCorrectAnswer = choice.char === syllableTestQuestion.char;
                            
                            let choiceStyle = "bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/20";
                            if (syllableTestFeedback) {
                              if (isCorrectAnswer) {
                                choiceStyle = "bg-emerald-600 border-emerald-500 text-white ring-4 ring-emerald-500/20";
                              } else if (isSelected) {
                                choiceStyle = "bg-rose-600 border-rose-500 text-white ring-4 ring-rose-500/20";
                              } else {
                                choiceStyle = "bg-white/5 border-white/10 opacity-30";
                              }
                            }

                            return (
                              <button
                                key={choice.char}
                                disabled={!!syllableTestFeedback}
                                onClick={() => {
                                  const matches = choice.char === syllableTestQuestion.char;
                                  playQuizChime(matches);
                                  setSyllableTestFeedback({ isCorrect: matches, selected: choice.char });
                                  
                                  // Add points inside statistics
                                  if (matches) {
                                    setStats(prev => {
                                      const next = { ...prev, quizHighScore: prev.quizHighScore + 10 };
                                      saveUserStats(next);
                                      return next;
                                    });
                                  }
                                }}
                                className={`py-4 px-6 rounded-2xl text-left flex items-center justify-between transition-all font-mono font-bold text-2xl border cursor-pointer select-none ${choiceStyle}`}
                              >
                                <span>{choice.char}</span>
                                {syllableTestFeedback && (
                                  <span className="text-xs text-slate-300 font-mono">[{choice.romanization}]</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Interactive results feedback panel */}
                        {syllableTestFeedback && (
                          <div className="w-full mt-6 bg-white/5 border border-white/15 p-5 rounded-2xl flex flex-col items-start gap-4 animate-fade-in text-left">
                            <div className="flex items-start gap-3 w-full">
                              {syllableTestFeedback.isCorrect ? (
                                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center text-lg shrink-0">✓</div>
                              ) : (
                                <div className="w-10 h-10 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center text-lg shrink-0">✕</div>
                              )}
                              <div className="flex flex-col flex-1">
                                <span className={`text-sm font-bold ${syllableTestFeedback.isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                                  {syllableTestFeedback.isCorrect ? "回答正确！太棒了 🎉" : "稍微遗憾！答错啦 ✕"}
                                </span>
                                <div className="text-xs text-slate-300 mt-1.5 space-y-1">
                                  <p>正确答案：<span className="text-white font-mono font-black text-lg mx-1">{syllableTestQuestion.char}</span></p>
                                  <p>对应读音：<span className="text-violet-300 font-mono">[{syllableTestQuestion.romanization}]</span></p>
                                  {syllableTestQuestion.chineseTip && (
                                    <p>中文发音提示：<span className="text-amber-300">{syllableTestQuestion.chineseTip}</span></p>
                                  )}
                                  <p className="text-[10px] text-slate-400 mt-2 border-t border-white/10 pt-2 italic">
                                    发音说明：{syllableTestQuestion.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={generateAlphabetQuestion}
                              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/20 mt-2"
                            >
                              下一题 <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                      </div>
                    )}

                  </div>

                </div>
              )}

            </div>
          )}

          {/* TABS 3: VOCABULARY AND SENTENCES (FLASHCARDS) */}
          {activeTab === "vocab" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Category side filters (Left col in xl layouts) */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">词汇分类筛选</h4>
                
                <button
                  onClick={() => { setSelectedVocabCategory("all"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "all"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Database className="w-4 h-4" /> 全部词汇 ({VOCABULARY_LIST.length})
                </button>

                <button
                  onClick={() => { setSelectedVocabCategory("daily"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "daily"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Smile className="w-4 h-4" /> 日常基本词 ({VOCABULARY_LIST.filter(v => v.category === "daily").length})
                </button>

                <button
                  onClick={() => { setSelectedVocabCategory("time"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "time"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Clock className="w-4 h-4" /> 时间与日期 ({VOCABULARY_LIST.filter(v => v.category === "time").length})
                </button>

                <button
                  onClick={() => { setSelectedVocabCategory("food"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "food"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Utensils className="w-4 h-4" /> 食物名称 ({VOCABULARY_LIST.filter(v => v.category === "food").length})
                </button>

                <button
                  onClick={() => { setSelectedVocabCategory("emotion"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "emotion"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Heart className="w-4 h-4" /> 情绪与感觉 ({VOCABULARY_LIST.filter(v => v.category === "emotion").length})
                </button>

                <button
                  onClick={() => { setSelectedVocabCategory("study"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "study"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" /> 学习与校园 ({VOCABULARY_LIST.filter(v => v.category === "study").length})
                </button>

                <button
                  onClick={() => { setSelectedVocabCategory("shopping"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "shopping"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" /> 实用生活消费 ({VOCABULARY_LIST.filter(v => v.category === "shopping").length})
                </button>

                <button
                  onClick={() => { setSelectedVocabCategory("traffic"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "traffic"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Plane className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} /> 交通与通勤 ({VOCABULARY_LIST.filter(v => v.category === "traffic").length})
                </button>

                <button
                  onClick={() => { setSelectedVocabCategory("travel"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "travel"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Map className="w-4 h-4" /> 旅游与观光 ({VOCABULARY_LIST.filter(v => v.category === "travel").length})
                </button>

                <button
                  onClick={() => { setSelectedVocabCategory("favorites"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "favorites"
                      ? "bg-pink-600 text-white border-pink-700 shadow-md"
                      : "bg-white border-slate-200 text-rose-500 hover:bg-rose-50/50"
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" /> 我的收藏夹 ({stats.collectedVocabIds.length})
                </button>

                <button
                  onClick={() => { setSelectedVocabCategory("wrong"); setCurrentFlashcardIndex(0); setActiveComponentIdx(0); setIsFlipped(false); }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all gap-2.5 flex items-center border ${
                    selectedVocabCategory === "wrong"
                      ? "bg-rose-700 text-white border-rose-800 shadow-md"
                      : "bg-white border-slate-200 text-rose-600 hover:bg-rose-50/50"
                  }`}
                >
                  <AlertCircle className="w-4 h-4" /> 我的错题本 ({wrongAnswers.length})
                </button>
              </div>

              {/* Flashcard Carousel main render */}
              <div className="lg:col-span-9 flex flex-col gap-6">
                
                {/* Search bar inside Vocab */}
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input 
                    type="text" 
                    placeholder="输入中文或韩文字眼搜寻该部分相关词汇..."
                    value={searchWordQuery}
                    onChange={(e) => { setSearchWordQuery(e.target.value); setCurrentFlashcardIndex(0); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {filteredVocab.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-3">
                    <span className="text-4xl text-slate-300">🕵️‍♀️</span>
                    <h4 className="font-bold text-slate-800">无匹配单词</h4>
                    <p className="text-xs text-slate-400">
                      {selectedVocabCategory === "favorites" 
                        ? "目前没有找到符合过滤条件的词条。如果是收藏夹，试着在全部单词中点击爱心来收藏！"
                        : selectedVocabCategory === "wrong"
                        ? "恭喜您！您的错题本目前没有错题记录，多通过测验练习可以帮助您发现薄弱单词。"
                        : "目前没有找到符合过滤条件的词条。"}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 w-full">
                    
                    {/* FLIP CARD INTEGRATED WRAPPER */}
                    <div className="flex flex-col items-center w-full">
                      
                      {/* Card frame flip container */}
                      <div 
                        onClick={() => setIsFlipped(prev => !prev)}
                        className={`relative w-full max-w-xl min-h-[320px] bg-white border rounded-[36px] cursor-pointer shadow-lg hover:shadow-xl hover:border-violet-300 transition-all duration-500 overflow-hidden text-center flex flex-col justify-between ${
                          isFlipped ? "border-violet-300 ring-2 ring-violet-100" : "border-slate-200"
                        }`}
                      >
                        {/* Interactive dynamic ribbon background color decoration */}
                        <div className={`h-2.5 ${isFlipped ? "bg-violet-500" : "bg-gradient-to-r from-pink-400 to-indigo-500"}`}></div>

                        <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-500">
                          <span>
                            卡片 {currentFlashcardIndex + 1} / {filteredVocab.length}（点击卡片翻转，查看中文翻译）
                          </span>
                          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600 tracking-wider">
                            {filteredVocab[currentFlashcardIndex].category.toUpperCase()}
                          </span>
                        </div>

                        {/* Front Face of Vocabulary card */}
                        {!isFlipped ? (
                          <div className="p-8 flex flex-col items-center justify-center gap-4 flex-1 animate-fade-in text-slate-800">
                            
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-loose">
                              韩文字符 KOREAN
                            </span>

                            <h1 className="text-4xl font-black text-slate-900 leading-tight">
                              {filteredVocab[currentFlashcardIndex].word}
                            </h1>

                            <div className="bg-violet-50 hover:bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-colors self-center">
                              [{filteredVocab[currentFlashcardIndex].romanization}]
                            </div>

                            <p className="text-[11px] text-slate-400 italic">（点击白底翻转显示中文意思）</p>

                          </div>
                        ) : (
                          // Back Face of Vocabulary card
                          <div className="p-8 flex flex-col items-center justify-center gap-4 flex-1 animate-fade-in text-slate-800">
                            
                            <span className="text-[10px] text-pink-600 font-extrabold uppercase tracking-widest leading-loose">
                              中文意思 CHINESE
                            </span>

                            <h1 className="text-3xl font-bold text-[#1e1b4b] leading-tight">
                              {filteredVocab[currentFlashcardIndex].translation}
                            </h1>

                            {/* Show detailed sample sentence context */}
                            {filteredVocab[currentFlashcardIndex].sampleSentence && (
                              <div className="bg-pink-50/50 p-4 border border-pink-100 rounded-2xl max-w-sm text-left mt-2">
                                <p className="text-xs font-bold text-indigo-950 font-mono">
                                  🇰🇷 {filteredVocab[currentFlashcardIndex].sampleSentence}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-1">
                                  🇨🇳 {filteredVocab[currentFlashcardIndex].sampleTranslation}
                                </p>
                              </div>
                            )}

                          </div>
                        )}

                        {/* Flashcard toolbar row */}
                        <div className="bg-slate-50 p-5 border-t border-slate-100 flex items-center justify-between gap-3">
                          
                          {/* Favorite button status */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavoriteVocab(filteredVocab[currentFlashcardIndex].id);
                              }}
                              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                                stats.collectedVocabIds.includes(filteredVocab[currentFlashcardIndex].id)
                                  ? "bg-rose-50 border-rose-300 text-rose-600"
                                  : "bg-white border-slate-200 text-slate-400 hover:text-rose-500"
                              }`}
                              title="加入我的收藏列表"
                            >
                              <Heart className={`w-4 h-4 ${stats.collectedVocabIds.includes(filteredVocab[currentFlashcardIndex].id) ? "fill-current" : ""}`} />
                            </button>

                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleSpeech(filteredVocab[currentFlashcardIndex].word, "vocab", filteredVocab[currentFlashcardIndex].id);
                              }}
                              className="p-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 hover:shadow shadow-sm transition-all text-xs font-bold flex items-center gap-1 cursor-pointer mr-1"
                              title="播放词声音频"
                            >
                              <Volume2 className="w-4 h-4" /> 听发音
                            </button>

                            {selectedVocabCategory === "wrong" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const itemToRemove = filteredVocab[currentFlashcardIndex];
                                  if (itemToRemove) {
                                    const nextWrongs = wrongAnswers.filter(w => w.id !== itemToRemove.id);
                                    saveWrongAnswers(nextWrongs);
                                    triggerToast("✓ 标记掌握", "该单词已从您的错题本中移除！");
                                    if (currentFlashcardIndex >= nextWrongs.length && nextWrongs.length > 0) {
                                      setCurrentFlashcardIndex(nextWrongs.length - 1);
                                    }
                                  }
                                }}
                                className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 hover:shadow-sm transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                                title="此词已掌握，移出我的错题本"
                              >
                                <Check className="w-4 h-4" /> 移出
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-400">
                            {currentFlashcardIndex + 1} / {filteredVocab.length}
                          </div>

                          {/* Swiping next controllers */}
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentFlashcardIndex(prev => Math.max(prev - 1, 0));
                                setIsFlipped(false);
                              }}
                              disabled={currentFlashcardIndex === 0}
                              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 disabled:opacity-40 select-none text-xs font-bold cursor-pointer"
                            >
                              上一个
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentFlashcardIndex(prev => Math.min(prev + 1, filteredVocab.length - 1));
                                setActiveComponentIdx(0); // reset active component on navigate
                                setIsFlipped(false);
                              }}
                              disabled={currentFlashcardIndex === filteredVocab.length - 1}
                              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 disabled:opacity-40 select-none text-xs font-bold cursor-pointer"
                            >
                              下一个
                            </button>
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* TWO COLUMN FINE-GRAINED LINGUISTIC AND SPEECH SYNTHESIS WORKSPACE */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full mt-2 text-left">
                      
                      {/* Left: Component Deconstruction Grid (Col-Span 7) */}
                      <div className="xl:col-span-7 bg-white border border-slate-200/90 rounded-[32px] p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                        
                        {/* Decorative background circle */}
                        <div className="absolute right-0 top-0 w-24 h-24 bg-violet-50 rounded-bl-full -z-0 opacity-40 pointer-events-none" />

                        <div className="z-10">
                          <span className="text-[10px] text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
                            🔍 词汇精细拆解 & 语义探针
                          </span>
                          <h4 className="font-extrabold text-[#111827] text-lg mt-2 flex items-center gap-1.5 font-sans leading-none">
                            {filteredVocab[currentFlashcardIndex].word} 是如何构成的？
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">
                            点击下方任意音节块/字根来逐音节查看它的词性角色、核心中韩意涵、以及精细发音指南！
                          </p>
                        </div>

                        {/* Components clickable list */}
                        {filteredVocab[currentFlashcardIndex].components && filteredVocab[currentFlashcardIndex].components.length > 0 ? (
                          <div className="z-10 flex flex-wrap gap-2.5 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            {filteredVocab[currentFlashcardIndex].components.map((comp, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setActiveComponentIdx(idx);
                                  // micro-speech on click
                                  playKoreanSpeech(comp.char);
                                }}
                                className={`px-4 py-2.5 rounded-xl text-left border cursor-pointer select-none transition-all flex flex-col items-center justify-center min-w-[70px] ${
                                  activeComponentIdx === idx
                                    ? "bg-violet-600 text-white border-violet-600 shadow-md ring-2 ring-violet-200"
                                    : "bg-white border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 text-slate-700"
                                }`}
                              >
                                <span className="text-xl font-black font-mono leading-none">{comp.char}</span>
                                <span className={`text-[10px] mt-1 truncate ${activeComponentIdx === idx ? "text-violet-100" : "text-slate-400"}`}>
                                  {comp.meaning}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="z-10 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                            本词汇为一个不可分割的单词发音。
                          </div>
                        )}

                        {/* Active Component Details Spec Sheet */}
                        {filteredVocab[currentFlashcardIndex].components && filteredVocab[currentFlashcardIndex].components[activeComponentIdx] && (
                          <div className="z-10 bg-gradient-to-br from-violet-50/30 to-indigo-50/20 border border-violet-100/80 p-5 rounded-2xl flex flex-col gap-3.5 relative">
                            {/* Tiny micro audio speaker inside spec card */}
                            <button
                              onClick={() => playKoreanSpeech(filteredVocab[currentFlashcardIndex].components![activeComponentIdx].char)}
                              className="absolute top-4 right-4 p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                              title="听此字单独发音"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              单字读音
                            </button>

                            <div className="flex flex-col flex-1">
                              <span className="text-[10px] text-violet-500 font-bold uppercase tracking-widest">
                                选定音节分析 SPEC SHEET
                              </span>
                              <div className="flex items-baseline gap-2.5 mt-1.5">
                                <span className="text-3xl font-black text-slate-900 font-mono">
                                  {filteredVocab[currentFlashcardIndex].components[activeComponentIdx].char}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">
                                  [{filteredVocab[currentFlashcardIndex].components[activeComponentIdx].pronunciation}]
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3.5 text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">词汇/语法角色</span>
                                <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                                  {filteredVocab[currentFlashcardIndex].components[activeComponentIdx].role || "基础语素"}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">对应核心翻译</span>
                                <span className="font-extrabold text-[#111827]">
                                  {filteredVocab[currentFlashcardIndex].components[activeComponentIdx].meaning}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Pronunciation Guide & Social Explanation if they exist */}
                        {(filteredVocab[currentFlashcardIndex].pronunciationGuide || filteredVocab[currentFlashcardIndex].usageExplanation) && (
                          <div className="z-10 border-t border-slate-100 pt-4 flex flex-col gap-3">
                            {filteredVocab[currentFlashcardIndex].pronunciationGuide && (
                              <div className="flex items-start gap-2.5 text-xs">
                                <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] mt-0.5 shrink-0 select-none">
                                  发音纠错要领
                                </span>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                  {filteredVocab[currentFlashcardIndex].pronunciationGuide}
                                </p>
                              </div>
                            )}

                            {filteredVocab[currentFlashcardIndex].usageExplanation && (
                              <div className="flex items-start gap-2.5 text-xs">
                                <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-[10px] mt-0.5 shrink-0 select-none">
                                  实际生活拓展
                                </span>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                  {filteredVocab[currentFlashcardIndex].usageExplanation}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                      </div>

                      {/* Right: TTS Speech Customizer Panel (Col-Span 5) */}
                      <div className="xl:col-span-5 bg-white border border-slate-200/90 rounded-[32px] p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                        
                        {/* Decorative background shape */}
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-pink-50 rounded-tl-full -z-0 opacity-40 pointer-events-none" />

                        <div className="z-10">
                          <span className="text-[10px] text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
                            🎙️ 智能语音助手与发音微调
                          </span>
                          <h4 className="font-extrabold text-[#111827] text-lg mt-2 flex items-center gap-1.5 font-sans leading-none">
                            发音质感参数设定
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">
                            实时微调全局TTS发音语速、音高、音色风格。内置 Siri 高音质预热提示音效！
                          </p>
                        </div>

                        {/* Quick Style presets */}
                        <div className="z-10 flex flex-col gap-2.5">
                          <span className="text-[11px] font-bold text-slate-400">发音助手风格</span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: "assistant", label: "智能助理", desc: "Siri质感" },
                              { id: "slow_tutor", label: "慢速导师", desc: "慢练听音" },
                              { id: "native_fast", label: "原速母语", desc: "高效适应" }
                            ].map((preset) => (
                              <button
                                key={preset.id}
                                onClick={() => {
                                  const updated = {
                                    ...ttsSettings,
                                    style: preset.id as any,
                                    // auto tweak params based on standard mappings
                                    rate: preset.id === "slow_tutor" ? 0.70 : preset.id === "native_fast" ? 1.05 : 0.88,
                                    pitch: preset.id === "slow_tutor" ? 0.98 : preset.id === "native_fast" ? 1.00 : 1.02,
                                  };
                                  updateTtsSettings(updated);
                                  // play preview trigger instantly to hear change!
                                  playKoreanSpeech("안녕하세요");
                                }}
                                className={`px-2 py-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all ${
                                  ttsSettings.style === preset.id
                                    ? "bg-pink-600 text-white border-pink-600 shadow-md"
                                    : "bg-white border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 text-slate-700"
                                }`}
                              >
                                <span className="text-xs font-bold leading-none">{preset.label}</span>
                                <span className={`text-[9px] mt-1 ${ttsSettings.style === preset.id ? "text-pink-100" : "text-slate-400"}`}>
                                  {preset.desc}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Chime switcher */}
                        <div className="z-10 flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-slate-800">首字节音效提示</span>
                            <span className="text-[10px] text-slate-400">阅读前播放 Siri 同款温暖正弦电音</span>
                          </div>
                          <button
                            onClick={() => {
                              const updated = { ...ttsSettings, soundEffect: !ttsSettings.soundEffect };
                              updateTtsSettings(updated);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer select-none transition-all ${
                              ttsSettings.soundEffect
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {ttsSettings.soundEffect ? "已开启" : "已停用"}
                          </button>
                        </div>

                        {/* Slider controls customized for advanced visual representation */}
                        <div className="z-10 flex flex-col gap-3.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                              <span>发音流语速 SPEED</span>
                              <span className="font-mono text-pink-600 font-extrabold">{ttsSettings.rate.toFixed(2)}x</span>
                            </div>
                            <input
                              type="range"
                              min="0.4"
                              max="1.5"
                              step="0.05"
                              value={ttsSettings.rate}
                              disabled={ttsSettings.style !== "assistant"}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                updateTtsSettings({ ...ttsSettings, rate: val });
                              }}
                              className="w-full h-1.5 bg-slate-200 accent-pink-600 rounded-lg cursor-pointer disabled:opacity-45"
                            />
                            {ttsSettings.style !== "assistant" && (
                              <span className="text-[9px] text-slate-400 italic">（预置样式托管：当前由“{ttsSettings.style === "slow_tutor" ? "慢速导师" : "原速母语"}”模式自动配置）</span>
                            )}
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                              <span>发音流音高 PITCH</span>
                              <span className="font-mono text-pink-600 font-extrabold">{ttsSettings.pitch.toFixed(2)}</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="1.5"
                              step="0.05"
                              value={ttsSettings.pitch}
                              disabled={ttsSettings.style !== "assistant"}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                updateTtsSettings({ ...ttsSettings, pitch: val });
                              }}
                              className="w-full h-1.5 bg-slate-200 accent-pink-600 rounded-lg cursor-pointer disabled:opacity-45"
                            />
                          </div>
                        </div>

                        <div className="z-10 mt-auto border-t border-slate-100 pt-3.5">
                          <button
                            onClick={() => playKoreanSpeech("진짜 최고예요")}
                            className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white rounded-xl shadow font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                            播放预听测试：진짜 최고예요 (太棒了)
                          </button>
                        </div>

                      </div>

                    </div>

                    {/* GRAMMAR PATTERNS SUB CONTAINER MODULE */}
                    <div className="mt-4 text-left">
                      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
                        <span className="w-2.5 h-6 bg-pink-500 rounded-full"></span> 5大必背核心基础句型拆解
                      </h3>

                      <div className="flex flex-col gap-4">
                        {SENTENCE_PATTERNS.map((item) => {
                          const isCollected = stats.collectedSentenceIds.includes(item.id);
                          return (
                            <div 
                              key={item.id}
                              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 transition hover:border-pink-300"
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-pink-600 font-extrabold uppercase bg-pink-50 px-2 py-0.5 rounded w-fit mb-1">
                                    {item.category.toUpperCase()}
                                  </span>
                                  <p className="text-xl font-extrabold text-slate-900 font-mono tracking-wide leading-tight">
                                    {item.korean}
                                  </p>
                                  <p className="text-sm font-semibold text-slate-500 mt-1">
                                    {item.chinese}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => toggleFavoriteSentence(item.id)}
                                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                      isCollected ? "bg-rose-50 border-rose-300 text-rose-600" : "bg-slate-100 border-slate-200 hover:text-rose-500"
                                    }`}
                                  >
                                    <Heart className={`w-4 h-4 ${isCollected ? "fill-current" : ""}`} />
                                  </button>
                                  
                                  <button
                                    onClick={() => handleSpeech(item.korean, "sentence", item.id)}
                                    className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all"
                                    title="播放句声音标"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                                <h5 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">
                                  逐词拆解与文法分析 (Breakdown Diagram)
                                </h5>
                                
                                <div className="flex flex-wrap gap-2.5">
                                  {item.breakdown.map((b, i) => (
                                    <div key={i} className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs flex flex-col justify-start text-left min-w-[80px]">
                                      <span className="font-extrabold text-violet-700 font-mono text-xs">{b.word}</span>
                                      <span className="text-[10px] text-slate-500 mt-1 leading-normal">{b.meaning}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* TABS 4: MULTI-SCENARIOS IMPRESSIVE IMMERSION DIALOGUES */}
          {activeTab === "scenarios" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Scene selector left bar in lg */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                <h4 className="font-bold text-sm text-slate-900 border-b border-rose-100 pb-2">生活实景切换</h4>
                
                {SCENARIOS.map((scene) => {
                  const isActive = activeScenarioId === scene.id;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => { setActiveScenarioId(scene.id); setScenarioChallengeData(null); }}
                      className={`px-4 py-3.5 rounded-2xl text-xs font-bold text-left transition-all gap-3 flex items-center border ${
                        isActive
                          ? "bg-violet-600 text-white border-violet-600 shadow-md transform translate-x-1"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg">🍱</span>
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold">{scene.theme}</span>
                        <span className={`text-[9px] ${isActive ? "text-violet-200" : "text-slate-400"}`}>
                          对话数 {scene.dialogue.length} 句
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Dialogue details block */}
              {SCENARIOS.map((scene) => {
                if (scene.id !== activeScenarioId) return null;
                return (
                  <div key={scene.id} className="lg:col-span-9 flex flex-col gap-6">
                    
                    {/* Scene banner summary */}
                    <div className="bg-gradient-to-tr from-violet-600 to-indigo-700 p-6 rounded-[28px] text-white shadow-md text-left flex items-start gap-4">
                      <div className="text-3xl p-3 bg-white/10 rounded-2xl backdrop-blur">
                        🍱
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-xl font-bold">{scene.theme} 场景</h2>
                        <p className="text-xs text-violet-100 mt-1 leading-relaxed">{scene.description}</p>
                      </div>
                    </div>

                    {/* Dialogue mode togglers */}
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-500 select-none ml-2">
                        切换内容语言显示方式
                      </span>
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        <button 
                          onClick={() => setScenarioDialogueMode("bilingual")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${scenarioDialogueMode === "bilingual" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}
                        >
                          双语模式
                        </button>
                        <button 
                          onClick={() => setScenarioDialogueMode("korean")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${scenarioDialogueMode === "korean" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}
                        >
                          仅韩语
                        </button>
                        <button 
                          onClick={() => setScenarioDialogueMode("chinese")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${scenarioDialogueMode === "chinese" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}
                        >
                          仅中文
                        </button>
                      </div>
                    </div>

                    {/* Dialogue bubbles stream */}
                    <div className="flex flex-col gap-4 bg-white/70 border border-slate-200 rounded-[32px] p-6 max-h-[500px] overflow-y-auto">
                      {scene.dialogue.map((bubble, idx) => {
                        return (
                          <div 
                            key={idx}
                            className={`flex flex-col w-full max-w-[80%] ${
                              bubble.isCurrentUser ? "self-end items-end text-right" : "self-start items-start text-left"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 text-slate-400 font-bold text-[10px]">
                              <span>{bubble.speakerNameCn}</span>
                              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                                ({bubble.speaker})
                              </span>
                            </div>

                            <div 
                              className={`p-4 rounded-3xl relative group ${
                                bubble.isCurrentUser 
                                  ? "bg-violet-600 text-white rounded-tr-none" 
                                  : "bg-gradient-to-tr from-slate-50 to-slate-100/30 text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                              }`}
                            >
                              {/* Speech triggers */}
                              <button 
                                onClick={() => playKoreanSpeech(bubble.korean)}
                                className={`absolute ${
                                  bubble.isCurrentUser ? "-left-11 text-slate-400 hover:text-violet-600" : "-right-11 text-slate-400 hover:text-violet-600"
                                } top-1/2 -translate-y-1/2 p-2 bg-white border border-slate-200 rounded-full hover:shadow transition-all`}
                                title="点击播放句子发音"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Main display strings according to toggled mode */}
                              {scenarioDialogueMode !== "chinese" && (
                                <p className="font-mono font-bold text-sm tracking-wide break-words">
                                  {bubble.korean}
                                </p>
                              )}
                              
                              {scenarioDialogueMode !== "chinese" && (
                                <p className={`text-[10px] font-mono mt-1 ${bubble.isCurrentUser ? "text-violet-200" : "text-slate-400"}`}>
                                  [{bubble.pronunciation}]
                                </p>
                              )}

                              {scenarioDialogueMode !== "korean" && (
                                <p className={`text-xs mt-2 font-medium ${
                                  bubble.isCurrentUser ? "text-white/95 text-xs inline" : "text-slate-500"
                                }`}>
                                  {bubble.translation}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Highly interactive high frequency vocabulary items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      
                      <div className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                          📌 本场景高频必背单词 (High Freq Vocab)
                        </h4>
                        
                        <div className="flex flex-col gap-2.5">
                          {scene.highFreqWords.map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                              <div className="flex flex-col text-left">
                                <span className="font-extrabold text-violet-700 font-mono text-xs">{item.korean}</span>
                                <span className="text-[10px] text-slate-400 mt-0.5">[{item.romanization}]</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">{item.chinese}</span>
                                <button 
                                  onClick={() => playKoreanSpeech(item.korean)}
                                  className="p-1 text-slate-400 hover:text-white hover:bg-violet-600 rounded-lg transition-colors border border-slate-200 bg-white"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-[28px] p-5 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                          💡 常用高频通用表达结构 (Sentence Guide)
                        </h4>

                        <div className="flex flex-col gap-3">
                          {scene.sentenceTemplates.map((item, i) => (
                            <div key={i} className="text-xs">
                              <p className="font-mono font-extrabold text-slate-900 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-violet-600 rounded-full"></span> {item.korean}
                              </p>
                              <p className="font-bold text-violet-600 text-[11px] mt-0.5">{item.chinese}</p>
                              <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">{item.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* ======================= AI Conversational Encounter Challenge Block ======================= */}
                    <div className="bg-indigo-950 text-white rounded-[28px] p-6 border border-indigo-900 text-left relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-base text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-300" />
                          AI 智能现场会话交互挑战（韩语表达深度测试）
                        </h4>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2.5 py-0.5 rounded text-[10px]">
                          Gemini 强辅助
                        </span>
                      </div>

                      <p className="text-xs text-indigo-200 leading-relaxed mb-4">
                        点击下方按钮让 AI 结合当前场景生成一句情景提问（比如烤肉店服务员对你说话），请在回复框内尝试用韩语写下您的友好回复，点击提交让 AI 为您的回复做出语法、遣词及连贯度的大师评析！
                      </p>

                      <div className="flex flex-col gap-4">
                        <button 
                          onClick={() => handleScenarioChallenge(scene.theme)}
                          disabled={scenarioChallengeLoading}
                          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition hover:shadow-indigo-500/30 cursor-pointer"
                        >
                          {scenarioChallengeLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" /> AI 正在分析当前主题生成考题中...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 text-emerald-400" /> 生成 [{scene.theme}] 主题随机考官对话
                            </>
                          )}
                        </button>

                        {scenarioChallengeData && (
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 animate-fade-in">
                            
                            {/* Dialogue header */}
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-[10px] text-teal-300 font-bold font-mono tracking-widest uppercase">
                                STATUS: 遭遇对方提问 (Scenario Encounter)
                              </span>
                              <span className="text-[10px] text-slate-400">{scenarioChallengeData.scenario}</span>
                            </div>

                            <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1 text-left">
                                <p className="text-base font-extrabold text-white font-mono">
                                  🗣️ "{scenarioChallengeData.challengerLine}"
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  [{scenarioChallengeData.challengerPronunciation}]
                                </p>
                                <p className="text-xs text-indigo-200 mt-1">
                                  🇨🇳 中文大意：{scenarioChallengeData.challengerTranslation}
                                </p>
                              </div>
                              <button 
                                onClick={() => playKoreanSpeech(scenarioChallengeData.challengerLine)}
                                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 text-white transition-all shrink-0"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Intelligent Answer hint description */}
                            <div className="text-xs bg-violet-950/40 p-3 rounded-xl border border-violet-800/40 text-slate-300 leading-normal">
                              <b>💡 提示说明：</b> {scenarioChallengeData.hint}
                            </div>

                            {/* Answer response area */}
                            <div className="flex flex-col gap-2 mt-2">
                              <label className="text-[11px] font-bold text-slate-400">请用韩语在下方写下您的回复：</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={userChallengeReply}
                                  onChange={(e) => setUserChallengeReply(e.target.value)}
                                  placeholder="例如：예, 괜찮습니다. (是的，没关系。)"
                                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                                />
                                <button
                                  onClick={submitScenarioResponse}
                                  disabled={challengeResultLoading || !userChallengeReply.trim()}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-40"
                                >
                                  {challengeResultLoading ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 animate-spin" /> 评改中
                                    </>
                                  ) : (
                                    <>
                                      向AI交卷 <Send className="w-3 h-3" />
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Display correction evaluation results */}
                            {challengeEvaluation && (
                              <div className="bg-white text-slate-800 rounded-xl p-4 border-l-4 border-l-emerald-500 animate-fade-in mt-2">
                                <h5 className="font-bold text-xs text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2">
                                  <span>🎓 AI 助教综合诊断书</span>
                                  {challengeEvaluation.isCorrect ? (
                                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">100分 语法通顺!</span>
                                  ) : (
                                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold">建议改进优化</span>
                                  )}
                                </h5>

                                <div className="space-y-3 mt-3 text-xs leading-normal">
                                  <div>
                                    <span className="font-semibold text-slate-400 block">您的韩语回复:</span>
                                    <span className="font-mono bg-slate-50 px-2 py-1 rounded inline-block text-slate-800 font-bold border mt-0.5">
                                      {challengeEvaluation.original}
                                    </span>
                                  </div>

                                  <div>
                                    <span className="font-semibold text-teal-600 block">AI推荐或矫正表达:</span>
                                    <span className="font-mono bg-teal-50 px-2 py-1 rounded inline-block text-teal-800 font-bold border border-teal-200 mt-0.5">
                                      {challengeEvaluation.corrected}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-1">发音近似: {challengeEvaluation.pronunciation}</span>
                                    <span className="text-[10px] text-slate-500 block">中文翻译: {challengeEvaluation.translation}</span>
                                  </div>

                                  <div className="bg-slate-50 p-3 rounded-lg border">
                                    <span className="font-semibold text-indigo-900 block mb-1">💡 错点分析或文法精进说明:</span>
                                    <p className="text-slate-600 text-xs leading-relaxed">{challengeEvaluation.explanation}</p>
                                  </div>

                                  <div>
                                    <span className="font-semibold text-slate-400 block mb-1">拆包词汇/语法点精讲:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {challengeEvaluation.breakdown && challengeEvaluation.breakdown.map((bk: any, i: number) => (
                                        <div key={i} className="bg-slate-100 px-2 py-1.5 rounded-lg border text-left">
                                          <span className="font-bold text-violet-700 font-mono block text-[10px]">{bk.token}</span>
                                          <span className="text-[9px] text-slate-500">{bk.meaning}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                </div>
                              </div>
                            )}

                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

          {/* TABS 5: INDEPENDENT PRACTICE ARENA & AI WORKSPACE */}
          {activeTab === "practice" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Gamified word quiz game block (cols 5) */}
              <div className="lg:col-span-5 bg-slate-900 text-white rounded-[32px] p-6 shadow-xl border border-slate-800 flex flex-col gap-5 text-left h-full min-h-[500px]">
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-widest flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-400 animate-bounce" /> 词汇记忆记忆测验
                    </h3>
                    <p className="text-[10px] text-slate-400">中文词意 👉 寻找正确韩文卡牌</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-rose-500 font-bold font-mono">Streak: {quizStreak}🔥</span>
                    <span className="text-[10px] text-slate-400">积分：{quizScore} px</span>
                  </div>
                </div>

                {!quizActive ? (
                  // Quiz Idle state
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-6 animate-fade-in">
                    <span className="text-4xl">🎮</span>
                    <h4 className="font-bold text-slate-200">开始词汇随堂测试</h4>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      我们将随机挑选中韩文核心大卡。答对得 10 分并累积连击，答错不罚分但会记入错题本并重置连击。
                    </p>

                    {/* Mode selector */}
                    <div className="flex flex-col gap-2 w-full max-w-xs mt-2 text-left">
                      <span className="text-xs font-bold text-slate-400">选择测试模式：</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setQuizMode("kr_to_cn")}
                          className={`px-3 py-2.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
                            quizMode === "kr_to_cn"
                              ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-600/20"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          🇰🇷 韩 ➔ 🇨🇳 中 识别
                        </button>
                        <button
                          onClick={() => setQuizMode("cn_to_kr")}
                          className={`px-3 py-2.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
                            quizMode === "cn_to_kr"
                              ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-600/20"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          🇨🇳 中 ➔ 🇰🇷 韩 选择
                        </button>
                      </div>
                    </div>

                    {/* Scope selector */}
                    <div className="flex flex-col gap-2 w-full max-w-xs mt-2 text-left">
                      <span className="text-xs font-bold text-slate-400">选择出题范围：</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setQuizPool("all")}
                          className={`px-3 py-2.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
                            quizPool === "all"
                              ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-600/20"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          📚 全部词汇 ({VOCABULARY_LIST.length})
                        </button>
                        <button
                          onClick={() => {
                            if (wrongAnswers.length === 0) {
                              triggerToast("💡 提示", "您目前还没有错题纪录，先在全部词汇测验中练习积累吧！");
                              return;
                            }
                            setQuizPool("wrong");
                          }}
                          className={`px-3 py-2.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
                            quizPool === "wrong"
                              ? "bg-rose-700 border-rose-700 text-white shadow-md shadow-rose-700/20"
                              : "bg-white/5 border-white/10 text-rose-400 hover:text-rose-300 disabled:opacity-40"
                          }`}
                          disabled={wrongAnswers.length === 0}
                          title={wrongAnswers.length === 0 ? "无错题记录" : "练习错题集"}
                        >
                          ❌ 错题本 ({wrongAnswers.length})
                        </button>
                      </div>
                    </div>

                    {/* Difficulty select selector */}
                    <div className="flex flex-col gap-2 w-full max-w-xs mt-2 text-left">
                      <span className="text-xs font-bold text-slate-400">选择测试题量：</span>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setQuizDifficulty("easy")}
                          className={`px-3 py-2.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${quizDifficulty === "easy" ? "bg-violet-600 border-violet-600 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:text-white"}`}
                        >
                          5题
                        </button>
                        <button 
                          onClick={() => setQuizDifficulty("medium")}
                          className={`px-3 py-2.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${quizDifficulty === "medium" ? "bg-violet-600 border-violet-600 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:text-white"}`}
                        >
                          10题
                        </button>
                        <button 
                          onClick={() => setQuizDifficulty("hard")}
                          className={`px-3 py-2.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${quizDifficulty === "hard" ? "bg-violet-600 border-violet-600 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:text-white"}`}
                        >
                          15题
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={startQuiz}
                      className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl text-xs font-bold transition-transform text-white w-full max-w-xs flex items-center justify-center gap-1 cursor-pointer mt-3 shadow-md shadow-violet-600/20"
                    >
                      立即开始全新测验 <ArrowRight className="w-4 h-4 ml-1" />
                    </button>

                    {stats.quizHighScore > 0 && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        历史最高大闯关记录: {stats.quizHighScore} 点
                      </span>
                    )}

                  </div>
                ) : quizCompleted ? (
                  // Quiz completion state
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8 animate-fade-in">
                    <span className="text-4xl">👑</span>
                    <h4 className="font-bold text-teal-400 text-lg">大功告成！测试完成</h4>
                    <p className="text-xs text-slate-300">
                      恭喜您完成当前难度所有测验！本次获得积分成绩：
                    </p>
                    <div className="text-3xl font-extrabold text-white bg-slate-800 border px-6 py-3 rounded-2xl">
                      {quizScore} 分
                    </div>

                    {/* Feedback summary badge */}
                    <p className="text-[11px] text-slate-400 italic">
                      已经将答题分数刷新入个人成就勋章统计中，可去学习主页查看！
                    </p>

                    <button
                      onClick={() => setQuizActive(false)}
                      className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all w-full max-w-xs cursor-pointer mt-4"
                    >
                      返回测验中心
                    </button>
                  </div>
                ) : (
                  // Active quiz gameplay state
                  quizCorrectAnswer && (
                    <div className="flex flex-col gap-4 animate-fade-in flex-1">
                      
                      {/* Active level metadata */}
                      <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                        <span>题量：第 {quizIndex + 1} 题</span>
                        <span>难度等级: {quizDifficulty.toUpperCase()}</span>
                      </div>

                      {/* Score card question text */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center mt-2 relative">
                        <span className="text-[10px] tracking-wider text-slate-400 uppercase font-extrabold block">
                          {quizMode === "kr_to_cn" 
                            ? "请听发音，并找出下方韩文单词的正确中文释义：" 
                            : "请找出对应中文释义的正确韩语是哪一项："}
                        </span>
                        <h2 className="text-2xl font-black text-white leading-relaxed mt-2 flex items-center justify-center gap-2 font-mono">
                          {quizMode === "kr_to_cn" ? quizCorrectAnswer.word : `"${quizCorrectAnswer.translation}"`}
                          {quizMode === "kr_to_cn" && (
                            <button
                              onClick={() => playKoreanSpeech(quizCorrectAnswer.word, undefined, undefined, true)}
                              className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-slate-300 cursor-pointer"
                              title="重复播放发音"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          )}
                        </h2>
                      </div>

                      {/* Options stack choices */}
                      <div className="flex flex-col gap-2.5 mt-3">
                        {quizChoices.map((item) => {
                          const isSelected = quizSelectedId === item.id;
                          const isCorrect = item.id === quizCorrectAnswer.id;
                          
                          let optStyle = "bg-white/5 border-white/10 hover:bg-white/20 hover:border-white/20 text-slate-200";
                          if (quizSelectedId) {
                            if (isCorrect) {
                              optStyle = "bg-emerald-600 border-emerald-500 text-white font-bold ring-4 ring-emerald-500/30";
                            } else if (isSelected) {
                              optStyle = "bg-rose-600 border-rose-500 text-white font-bold ring-4 ring-rose-500/30";
                            } else {
                              optStyle = "bg-white/5 border-white/10 opacity-30 text-slate-400";
                            }
                          }

                          return (
                            <button
                              key={item.id}
                              disabled={!!quizSelectedId}
                              onClick={() => {
                                setQuizSelectedId(item.id);
                                const correct = item.id === quizCorrectAnswer.id;
                                playQuizChime(correct);
                                
                                setQuizScore(prev => correct ? prev + 10 : prev);
                                setQuizStreak(prev => correct ? prev + 1 : 0);

                                // Save to wrongAnswers if incorrect
                                if (!correct) {
                                  if (!wrongAnswers.some(w => w.id === quizCorrectAnswer.id)) {
                                    const nextWrongs = [...wrongAnswers, quizCorrectAnswer];
                                    saveWrongAnswers(nextWrongs);
                                  }
                                }
                              }}
                              className={`w-full py-3.5 px-4 rounded-xl text-left border text-sm flex items-center justify-between transition-all cursor-pointer ${optStyle}`}
                            >
                              <span className="font-mono">
                                {quizMode === "kr_to_cn" ? item.translation : item.word}
                              </span>
                              {quizMode === "cn_to_kr" && quizSelectedId && (
                                <span className="text-xs opacity-75 font-mono">[{item.romanization}]</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Post-selection feedback details indicator next button */}
                      {quizSelectedId && (
                        <div className="mt-auto bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between animate-fade-in gap-3 flex-wrap sm:flex-nowrap">
                          <div className="flex items-center gap-3 text-xs text-left flex-1 min-w-[150px]">
                            <span className={`p-2 rounded font-extrabold ${quizSelectedId === quizCorrectAnswer.id ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                              {quizSelectedId === quizCorrectAnswer.id ? "✓ 对了!" : "✕ 错了!"}
                            </span>
                            <div>
                              <p className="font-bold text-slate-200 font-mono flex items-center gap-1.5 flex-wrap">
                                <span className="text-white text-sm">{quizCorrectAnswer.word}</span>
                                <span className="text-slate-400 text-[10px]">[{quizCorrectAnswer.romanization}]</span>
                                <span className="text-violet-300">({quizCorrectAnswer.translation})</span>
                              </p>
                              {quizCorrectAnswer.sampleSentence && (
                                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 max-w-[220px]" title={quizCorrectAnswer.sampleSentence}>
                                  例句: {quizCorrectAnswer.sampleSentence}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Favorite in quiz */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavoriteVocab(quizCorrectAnswer.id);
                              }}
                              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                stats.collectedVocabIds.includes(quizCorrectAnswer.id)
                                  ? "bg-rose-50/10 border-rose-500/30 text-rose-400"
                                  : "bg-white/5 border-white/10 text-slate-400 hover:text-rose-400"
                              }`}
                              title="收藏此单词"
                            >
                              <Heart className={`w-3.5 h-3.5 ${stats.collectedVocabIds.includes(quizCorrectAnswer.id) ? "fill-current" : ""}`} />
                            </button>

                            {/* Pronunciation replay in quiz */}
                            <button
                              onClick={() => playKoreanSpeech(quizCorrectAnswer.word, undefined, undefined, true)}
                              className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
                              title="重复播放发音"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                const nextIdx = quizIndex + 1;
                                setQuizIndex(nextIdx);
                                const poolList = quizPool === "wrong" ? wrongAnswers : VOCABULARY_LIST;
                                generateQuizQuestion(nextIdx, poolList);
                              }}
                              className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors cursor-pointer flex items-center gap-1"
                            >
                              下一题 <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )
                )}

              </div>

              {/* Free AI sentence alignment & corrector workspace (cols 7) */}
              <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                
                <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm flex flex-col gap-4">
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-violet-600" /> AI 智能句法及语法纠错纠助器
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">您可以尝试输入一段自编韩语，AI 会精细分析语句正确率，提供对比与词拆释。</p>
                    </div>
                    <span className="bg-teal-50 text-teal-700 border border-teal-200 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
                      PRO LEVEL
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-xs font-bold text-slate-500">✍️ 待检测的韩语文本输入：</label>
                    <textarea
                      rows={4}
                      value={aiErrorInput}
                      onChange={(e) => setAiErrorInput(e.target.value)}
                      placeholder="例如想要写‘我是学生’，可以故意写不加空格的错误：저는학생입니다 (正确应该带空格：저는 학생입니다)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-3">
                    <button
                      onClick={() => setAiErrorInput("저는중국사람임니다.")}
                      className="text-[11px] text-slate-400 hover:text-violet-600 font-semibold underline"
                    >
                      💡 点击自动填入模拟纠错句子例题
                    </button>
                    
                    <button
                      disabled={aiCorrectLoading || !aiErrorInput.trim()}
                      onClick={handleAiCorrection}
                      className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-2xl text-xs flex items-center gap-1.5 transition shadow hover:shadow-violet-200 cursor-pointer"
                    >
                      {aiCorrectLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> AI 分析中，请稍候...
                        </>
                      ) : (
                        <>
                          提交AI检测与拆语剖析 <Sparkles className="w-4 h-4 text-amber-300" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Backend query warnings */}
                  {aiErrorMessage && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-start gap-2.5 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-bold">{aiErrorMessage}</p>
                        <p className="mt-1 leading-relaxed opacity-90">
                          请在 AI Studio 主界面的 &quot;【Settings &gt; Secrets】&quot; 中，找到名为 <b>GEMINI_API_KEY</b> 的选项，填入您的 Google AI API Key，来使这套 AI 实战纠错评估器恢复生机！
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Detailed AI output response card formatting */}
                  {aiCorrectResult && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mt-2 animate-fade-in">
                      
                      {/* Analysis Header report card */}
                      <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                        <span className="text-[10px] text-slate-400 font-extrabold font-mono uppercase tracking-wider">
                          GENERATED BY GEMINI FLASH
                        </span>
                        
                        {aiCorrectResult.isCorrect ? (
                          <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[10px]">
                            符合标准文法 100%
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-100 font-bold px-2 py-0.5 rounded text-[10px]">
                            找出文法/拼读缺漏
                          </span>
                        )}
                      </div>

                      <div className="space-y-4 text-left text-xs leading-relaxed mt-4">
                        
                        {/* Sentence Comparison container */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
                            <span className="text-[10px] text-slate-400 uppercase font-black block">Original Input / 原文:</span>
                            <span className="font-mono text-sm inline-block font-extrabold text-slate-800 tracking-wide mt-1 select-all">
                              {aiCorrectResult.original}
                            </span>
                          </div>

                          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                            <span className="text-[10px] text-emerald-600 uppercase font-black block">AI Recommended / 推荐参考句:</span>
                            <span className="font-mono text-sm inline-block font-extrabold text-[#115e59] tracking-wide mt-1 select-all">
                              {aiCorrectResult.corrected}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-1">近似发音: {aiCorrectResult.pronunciation}</span>
                            <span className="text-[10px] text-slate-500 block leading-tight">中文解释: {aiCorrectResult.translation}</span>
                          </div>
                        </div>

                        {/* Interactive dynamic breakdown */}
                        {aiCorrectResult.breakdown && aiCorrectResult.breakdown.length > 0 && (
                          <div className="bg-white p-4 border border-slate-200 rounded-xl">
                            <span className="font-semibold text-slate-500 text-[10px] uppercase block mb-2 tracking-wider">
                              🔬 句子微细分词拆解 (Sentence Word Breakdown)
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {aiCorrectResult.breakdown.map((item: any, i: number) => (
                                <div key={i} className="bg-slate-50 border p-2.5 rounded-lg text-left">
                                  <span className="font-bold text-violet-700 font-mono block text-[11px]">{item.token}</span>
                                  <span className="text-[10px] text-slate-500 mt-1 block leading-tight">{item.meaning}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Text explanation */}
                        <div className="bg-white p-4 border border-slate-200 rounded-xl">
                          <span className="font-semibold text-indigo-900 block mb-1">📝 AI 文法诊讲解剖：</span>
                          <p className="text-slate-600 mt-1 leading-relaxed">{aiCorrectResult.explanation}</p>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ======================================= */}
      {/* 3. SETTINGS & STUDY PLAN SETUPS DIALOG MODAL */}
      {/* ======================================= */}
      {showGoalModal && (
        <div id="settings-modal" className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col justify-between">
            
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sliders className="w-5 h-5 text-violet-600 animate-pulse" /> 平台基础设置及每日学习计划比例
              </h3>
              <button 
                onClick={() => setShowGoalModal(false)}
                className="text-slate-400 hover:text-slate-600 text-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 text-slate-800">
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500">用户名自定义：</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  maxLength={15}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-500">⏲️ 每日打卡设定规划比例 (Goal Selection)：</label>
                
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTempGoalMinutes(t)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        tempGoalMinutes === t
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {t} 分钟
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 leading-normal mt-1">
                  （系统将保持您持续学习的签到进度，根据每天在线积累时长比例判断今日是否圆满打卡成功！）
                </p>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  🎓 个人本地学习档案：
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                  <div className="bg-slate-50 px-2.5 py-1.5 rounded-lg">
                    40音已握: <b className="text-violet-600 font-mono">{stats.unlockedAlphabets.length}个</b>
                  </div>
                  <div className="bg-slate-50 px-2.5 py-1.5 rounded-lg">
                    词卡温习: <b className="text-violet-600 font-mono">{stats.unlockedWords.length}个</b>
                  </div>
                </div>
              </div>

            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-150 flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              
              <button 
                onClick={() => {
                  setStats(prev => {
                    const next = { ...prev, dailyGoalMinutes: tempGoalMinutes };
                    saveUserStats(next);
                    return next;
                  });
                  localStorage.setItem("korean_user_name_v1", userName);
                  setShowGoalModal(false);
                  triggerToast("💾 保存成功", "平台配置及每日学计划已完成更新！");
                }}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                保存平台计划并应用
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
