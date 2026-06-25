import { UserStats, Achievement } from "./types";
import { INITIAL_ACHIEVEMENTS } from "./data";

// Soft harmonic beep/chime before AI assistant reads words (Siri Style)
function playAssistantChime(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      resolve();
      return;
    }
    try {
      const ctx = new AudioContextClass();
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0, start);
        // Soft click-free ramp-up and exponential smooth fade
        gain.gain.linearRampToValueAtTime(0.04, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        
        osc.start(start);
        osc.stop(start + duration);
      };
      
      const now = ctx.currentTime;
      playTone(587.33, now, 0.25); // D5 (Warm high chord)
      playTone(783.99, now + 0.06, 0.35); // G5
      
      setTimeout(() => {
        ctx.close();
        resolve();
      }, 420);
    } catch (e) {
      resolve();
    }
  });
}

// 1. Precise Speech Synthesis (TTS) Helper for Korean
export async function playKoreanSpeech(text: string, customRate?: number, customPitch?: number, noChime?: boolean): Promise<boolean> {
  // Read localized synthesizer configuration
  let rate = 0.88;
  let pitch = 1.02;
  let soundEffect = true;
  let style = "assistant";

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("korean_tts_settings_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        style = parsed.style || "assistant";
        rate = parsed.rate !== undefined ? parsed.rate : rate;
        pitch = parsed.pitch !== undefined ? parsed.pitch : pitch;
        soundEffect = parsed.soundEffect !== undefined ? parsed.soundEffect : soundEffect;
      }
    } catch (e) {
      // ignore
    }
  }

  // Adjust parameters according to active style pre-selections
  if (style === "slow_tutor") {
    rate = 0.70;
    pitch = 0.98;
  } else if (style === "native_fast") {
    rate = 1.05;
    pitch = 1.00;
  }

  // Syllables or short alphabets of single length benefit from extra slow pacing to avoid clipping on web browsers
  if (text.length <= 2 && style === "assistant") {
    rate = noChime ? 0.95 : 0.76;
  }

  // Override if explicitly supplied
  if (customRate !== undefined) rate = customRate;
  if (customPitch !== undefined) pitch = customPitch;

  // Optional assistant chime play before reading
  if (soundEffect && style === "assistant" && !noChime) {
    await playAssistantChime();
  }

  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser environment.");
      resolve(false);
      return;
    }

    try {
      // Cancel current speaking
      window.speechSynthesis.cancel();

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = rate; 
      utterance.pitch = pitch;

      // Find Korean voice prioritizing neural/assistant crisp sounds
      const voices = window.speechSynthesis.getVoices();
      const koVoices = voices.filter((v) => v.lang.startsWith("ko") || v.lang === "ko_KR");
      
      let selectedVoice = koVoices.find(
        (v) => v.name.includes("Neural") || v.name.includes("Natural") || v.name.includes("Premium")
      );
      if (!selectedVoice) {
        selectedVoice = koVoices.find(
          (v) => v.name.includes("Google") || v.name.includes("Yuna") || v.name.includes("Heami") || v.name.includes("Apple")
        );
      }
      if (!selectedVoice) {
        selectedVoice = koVoices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = (e) => {
        console.error("TTS play error:", e);
        resolve(false);
      };

      window.speechSynthesis.speak(utterance);

      // Web Speech API bug in some browsers where voices are loaded asynchronously
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          const reloadedVoices = window.speechSynthesis.getVoices();
          const backupKoVoices = reloadedVoices.filter((v) => v.lang.startsWith("ko") || v.lang === "ko_KR");
          let backupKoVoice = backupKoVoices.find(
            (v) => v.name.includes("Neural") || v.name.includes("Natural") || v.name.includes("Premium")
          );
          if (!backupKoVoice) {
            backupKoVoice = backupKoVoices.find(
              (v) => v.name.includes("Google") || v.name.includes("Yuna") || v.name.includes("Heami")
            );
          }
          if (!backupKoVoice && backupKoVoices.length > 0) {
            backupKoVoice = backupKoVoices[0];
          }

          if (backupKoVoice) {
            utterance.voice = backupKoVoice;
          }
          // Speak again if canceled or not speaking
          if (!window.speechSynthesis.speaking) {
            window.speechSynthesis.speak(utterance);
          }
        };
      }
    } catch (err) {
      console.error("Speech Synthesis exception:", err);
      resolve(false);
    }
  });
}

// 2. Local Storage Management with sensible defaults
const LOCAL_STORAGE_KEY = "korean_learning_progress_v1";
const ACHIEVEMENTS_STORAGE_KEY = "korean_achievements_v1";

const DEFAULT_STATS: UserStats = {
  streak: 1,
  lastStudyDate: new Date().toISOString().split("T")[0],
  dailyGoalMinutes: 10,
  todayMinutes: 1,
  unlockedAlphabets: [],
  unlockedWords: [],
  unlockedSentences: [],
  collectedVocabIds: [],
  collectedSentenceIds: [],
  quizHighScore: 0
};

export function loadUserStats(): UserStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      // First timer initialization
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_STATS));
      return DEFAULT_STATS;
    }
    const parsed = JSON.parse(data);
    // Ensure all keys exist
    return { ...DEFAULT_STATS, ...parsed };
  } catch (err) {
    console.error("Error loading user stats:", err);
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error("Error saving user stats:", err);
  }
}

// Loads achievements state combined with current unlock statuses
export function loadAchievements(stats: UserStats): Achievement[] {
  if (typeof window === "undefined") return INITIAL_ACHIEVEMENTS;
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    let baseAchievements = INITIAL_ACHIEVEMENTS;
    if (data) {
      try {
        const parsed = JSON.parse(data) as Achievement[];
        // map parsed onto base so any new achievements in future get loaded correctly
        baseAchievements = baseAchievements.map(ba => {
          const match = parsed.find(p => p.id === ba.id);
          return match ? { ...ba, unlocked: match.unlocked } : ba;
        });
      } catch (e) {
        // use default
      }
    }

    // Dynamic verification based on stats
    const updated = baseAchievements.map((achievement) => {
      if (achievement.unlocked) return achievement;

      let currentVal = 0;
      switch (achievement.type) {
        case "streak":
          currentVal = stats.streak;
          break;
        case "alphabet":
          currentVal = stats.unlockedAlphabets.length;
          break;
        case "vocabulary":
          currentVal = stats.unlockedWords.length;
          break;
        case "sentence":
          currentVal = stats.unlockedSentences.length;
          break;
        case "score":
          currentVal = stats.quizHighScore;
          break;
      }

      const isNowUnlocked = currentVal >= achievement.targetCount;
      return {
        ...achievement,
        unlocked: isNowUnlocked
      };
    });

    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error loading achievements:", err);
    return INITIAL_ACHIEVEMENTS;
  }
}

// Save custom achievement list
export function saveAchievements(achievements: Achievement[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
  } catch (err) {
    console.error("Error saving achievements:", err);
  }
}

// 3. Process daily login / streak punch-in card
export function processDailyPunch(stats: UserStats): UserStats {
  const todayStr = new Date().toISOString().split("T")[0];
  const lastStr = stats.lastStudyDate;

  if (todayStr === lastStr) {
    // Alreay study logged today, keep streak same
    return stats;
  }

  const yesterdayStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  })();

  let newStreak = stats.streak;
  if (lastStr === yesterdayStr) {
    newStreak += 1;
  } else {
    // broke streak, reset back to 1
    newStreak = 1;
  }

  return {
    ...stats,
    lastStudyDate: todayStr,
    streak: newStreak,
    todayMinutes: lastStr === todayStr ? stats.todayMinutes : 1 // reset active mins if new day
  };
}
