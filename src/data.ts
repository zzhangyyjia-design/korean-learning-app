import { Alphabet, Vocabulary, SentencePattern, Scenario, Achievement } from "./types";

export const HANGUL_ALPHABETS: Alphabet[] = [
  // Vowels - 单元音
  { char: "ㅏ", type: "vowel", subType: "单元音", romanization: "a", chineseTip: "啊 (a)", description: "口张大，舌头自然放平，发音类似中文中的‘啊’。" },
  { char: "ㅓ", type: "vowel", subType: "单元音", romanization: "eo", chineseTip: "口型微张，发‘奥’音", description: "口型半张成圆形，发出近似于‘奥(ao)’与‘呃’之间的中后元音。" },
  { char: "ㅗ", type: "vowel", subType: "单元音", romanization: "o", chineseTip: "圆唇‘喔’", description: "双唇收圆向前突出，发音类似中文‘喔(o)’。" },
  { char: "ㅜ", type: "vowel", subType: "单元音", romanization: "u", chineseTip: "圆唇‘呜’", description: "双唇收圆成小孔，用力向前突出，发音类似中文‘呜(u)’。" },
  { char: "ㅡ", type: "vowel", subType: "单元音", romanization: "eu", chineseTip: "扁唇‘呃’", description: "嘴唇向两边拉扁，上下牙齿靠近但不咬合，舌后缩，发出‘资’后面的扁唇‘呃’音。" },
  { char: "ㅣ", type: "vowel", subType: "单元音", romanization: "i", chineseTip: "衣 (i)", description: "口微开，嘴唇向两边扁平展开，发音类似中文中的‘衣(i)’。" },
  { char: "ㅐ", type: "vowel", subType: "单元音", romanization: "ae", chineseTip: "扁唇‘挨’", description: "口张开度大，嘴角往两侧拉扁，发出类似‘艾/挨’的音。" },
  { char: "ㅔ", type: "vowel", subType: "单元音", romanization: "e", chineseTip: "耶的韵母 (ei)", description: "口型较ㅐ稍小，嘴角微拉，发音类似‘也(ye)’的后半部音，在现代韩语中与ㅐ发音极为相近。" },

  // Vowels - 双元音
  { char: "ㅑ", type: "vowel", subType: "双元音", romanization: "ya", chineseTip: "呀 (ya)", description: "先发快速的‘i’，随即滑向‘a’，合起来发‘呀’。" },
  { char: "ㅕ", type: "vowel", subType: "双元音", romanization: "yeo", chineseTip: "先发i再发eo", description: "先发快速的‘i’，随即滑向‘eo’。" },
  { char: "ㅛ", type: "vowel", subType: "双元音", romanization: "yo", chineseTip: "哟 (yo)", description: "先发快速的‘i’，随即滑向‘o’，发音类似‘唷/哟’。" },
  { char: "ㅠ", type: "vowel", subType: "双元音", romanization: "yu", chineseTip: "忧 (yu)", description: "先发快速的‘i’，随即滑向‘u’，发音类似‘优(you)’。" },
  { char: "ㅒ", type: "vowel", subType: "双元音", romanization: "yae", chineseTip: "呀-埃 连读", description: "先发快速的‘i’，随即滑向‘ae’，发出‘耶’扁音。" },
  { char: "ㅖ", type: "vowel", subType: "双元音", romanization: "ye", chineseTip: "耶 (ye)", description: "先发快速的‘i’，随即滑向‘e’，发音类似‘耶’。" },
  { char: "ㅘ", type: "vowel", subType: "双元音", romanization: "wa", chineseTip: "哇 (wa)", description: "先发快速的‘o/u’，随即滑向‘a’，发音类似中文中的‘哇’。" },
  { char: "ㅝ", type: "vowel", subType: "双元音", romanization: "wo", chineseTip: "窝 (wo)", description: "先发快速的‘u/o’，随即滑向‘eo’，发音类似中文‘窝/握’。" },
  { char: "ㅙ", type: "vowel", subType: "双元音", romanization: "wae", chineseTip: "歪 (wai)", description: "先发快速的‘o’，随即滑向‘ae’，发音类似‘歪’。" },
  { char: "ㅞ", type: "vowel", subType: "双元音", romanization: "we", chineseTip: "喂 (wei)", description: "先发快速的‘u’，随即滑向‘e’，发音类似中文的‘喂/卫’。" },
  { char: "ㅚ", type: "vowel", subType: "双元音", romanization: "oe", chineseTip: "wi 的宽音", description: "嘴唇呈圆形，发音类似于英文单词 wet 中的 we。" },
  { char: "ㅟ", type: "vowel", subType: "双元音", romanization: "wi", chineseTip: "威 (wi)", description: "嘴唇圆缩，先发‘u’立即滑向‘i’，发出类似‘威’的声音。" },
  { char: "ㅢ", type: "vowel", subType: "双元音", romanization: "ui", chineseTip: "呃-衣 连读", description: "嘴唇向两边拉扁，先发扁唇‘eu’，随即滑向‘i’。根据位置不同发音会有偏向。" },

  // Consonants - 单辅音
  { char: "ㄱ", type: "consonant", subType: "单辅音", romanization: "g/k", chineseTip: "歌 (g) / 科 (k)", description: "在词首时发清音类似‘科(k)’，在词中或元音间发浊音类似‘歌(g)’。" },
  { char: "ㄴ", type: "consonant", subType: "单辅音", romanization: "n", chineseTip: "呐 (n)", description: "舌尖紧贴上齿龈，阻碍气流，发音类似中文拼音‘n’。" },
  { char: "ㄷ", type: "consonant", subType: "单辅音", romanization: "d/t", chineseTip: "得 (d) / 特 (t)", description: "词首发清音‘t’开头，音节中/浊化发‘d’，气流不强。" },
  { char: "ㄹ", type: "consonant", subType: "单辅音", romanization: "r/l", chineseTip: "勒 (l) / 闪舌 (r)", description: "在元音前发闪音（类似日文r），在辅音前或词尾作收音（batchim）时发舌尖边音‘l’。" },
  { char: "ㅁ", type: "consonant", subType: "单辅音", romanization: "m", chineseTip: "摸 (m)", description: "双唇闭合，气流通道鼻腔，发出类似‘mo’的前半部声韵。" },
  { char: "ㅂ", type: "consonant", subType: "单辅音", romanization: "b/p", chineseTip: "播 (b) / 坡 (p)", description: "词首发不送气的‘p’，音节中浊化为‘b’。" },
  { char: "ㅅ", type: "consonant", subType: "单辅音", romanization: "s", chineseTip: "思 (s) / 师 (sh)", description: "舌尖靠近上门齿阻碍气流发出摩擦音，与‘ㅣ’相拼时发‘xi’(西)音。" },
  { char: "ㅇ", type: "consonant", subType: "单辅音", romanization: "ng / silent", chineseTip: "词尾作‘昂’的后鼻音", description: "在字首作占位符不发音；在收音（字底）时发类似‘昂’(ng)的后鼻音。" },
  { char: "ㅈ", type: "consonant", subType: "单辅音", romanization: "j/z", chineseTip: "姿 (z) / 知 (zh)", description: "词首发清音‘ch’（不送气），音节中央发浊音‘j’（资/知）。" },
  { char: "ㅊ", type: "consonant", subType: "单辅音", romanization: "ch", chineseTip: "刺 (c) / 吃 (ch)", description: "送气音。舌尖顶住硬腭然后放开，发出强烈送气的‘吃/刺’音。" },
  { char: "ㅋ", type: "consonant", subType: "单辅音", romanization: "k", chineseTip: "科 (k) 的强送气", description: "送气音。爆破力强的‘k’音，舌根隆起顶住软腭然后爆破发出强气流。" },
  { char: "ㅌ", type: "consonant", subType: "单辅音", romanization: "t", chineseTip: "特 (t) 的强送气", description: "送气音。舌尖抵住上齿龈爆破发出强烈、清晰的‘t’音。" },
  { char: "ㅍ", type: "consonant", subType: "单辅音", romanization: "p", chineseTip: "坡 (p) 的强送气", description: "送气音。双唇紧闭，随后在强送气下爆破，发出强大的‘p’声。" },
  { char: "ㅎ", type: "consonant", subType: "单辅音", romanization: "h", chineseTip: "喝 (h)", description: "气流从声门处摩擦发出类似‘喝’的弱音。" },

  // Consonants - 双辅音
  { char: "ㄲ", type: "consonant", subType: "双辅音", romanization: "kk", chineseTip: "紧音‘嘎’", description: "紧音（硬音）。喉部肌肉紧张，完全不送气地发爆破音‘g’。" },
  { char: "ㄸ", type: "consonant", subType: "双辅音", romanization: "tt", chineseTip: "紧音‘嗒’", description: "紧音（硬音）。舌尖紧抵齿龈，发完全不送气的爆破音‘d’。" },
  { char: "ㅃ", type: "consonant", subType: "双辅音", romanization: "pp", chineseTip: "紧音‘爸’", description: "紧音（硬音）。双唇紧闭挤压，随后发完全不送气的爆破音‘b’。" },
  { char: "ㅆ", type: "consonant", subType: "双辅音", romanization: "ss", chineseTip: "紧音‘萨’", description: "紧音（硬音）。喉头肌肉拉紧发出强摩擦音‘s’，极短促尖锐。" },
  { char: "ㅉ", type: "consonant", subType: "双辅音", romanization: "jj", chineseTip: "紧音‘炸’", description: "紧音（硬音）。舌头紧贴硬腭拉紧喉肌，发出完全不送气、干净短促的‘j’。" }
];

export const VOCABULARY_LIST: Vocabulary[] = [
  // 1. 日常生活 (Daily)
  {
    id: "v1",
    word: "안녕하세요",
    translation: "你好",
    romanization: "an-nyeong-ha-se-yo",
    category: "daily",
    sampleSentence: "안녕하세요! 만나서 반갑습니다.",
    sampleTranslation: "你好！见到你很高兴。",
    components: [
      { char: "안녕", meaning: "安宁、安全和平静（汉字词音：安宁）", pronunciation: "an-nyeong", role: "名词词根" },
      { char: "하", meaning: "代表“하다”（做/进行），用来将不可变名词转化为动词态", pronunciation: "ha", role: "动词词缀" },
      { char: "세요", meaning: "“请... / 您好...”，日常极常用、极其温和亲切的敬语终结形", pronunciation: "se-yo", role: "敬语词尾" }
    ],
    pronunciationGuide: "每个音节均可平直发出。注意‘세요’的发音要带着客气的上扬语气，能够拉近社交距离。",
    usageExplanation: "这是韩国人最普通、安全、绝对不会出错的问候话。无论是对店员、老师，还是路人均可使用，老少皆宜。"
  },
  {
    id: "v2",
    word: "감사합니다",
    translation: "谢谢",
    romanization: "gam-sa-ham-ni-da",
    category: "daily",
    sampleSentence: "도와주셔서 감사합니다.",
    sampleTranslation: "谢谢你帮助我。",
    components: [
      { char: "감사", meaning: "感谢（汉字词音：感谢）", pronunciation: "gam-sa", role: "名词词根" },
      { char: "합니다", meaning: "做某事（“하다”結合最高的格式体终结形态）", pronunciation: "ham-ni-da", role: "格式体尾" }
    ],
    pronunciationGuide: "【重点同化】由于收音‘ㅂ’(p)遇到后面的‘ㄴ’(n)，‘ㅂ’发生鼻音化，发音由'hab'变成'ham'。因此读作 gam-sa-ham-ni-da (干-沙-哈-米-达)，而不是 hab-ni-da。",
    usageExplanation: "这是最高尊敬规格的‘谢谢’。适用于各种正式商务甚至日常买单，对陌生人极其礼貌。"
  },
  {
    id: "v3",
    word: "죄송합니다",
    translation: "对不起",
    romanization: "joe-song-ham-ni-da",
    category: "daily",
    sampleSentence: "늦어서 정말 죄송합니다.",
    sampleTranslation: "迟到了，真的很对不起。",
    components: [
      { char: "죄송", meaning: "抱歉/罪悚（汉字音：罪悚，意为极为抱歉不安）", pronunciation: "joe-song", role: "名词词根" },
      { char: "합니다", meaning: "做某事（“하다”結合最高的格式体终结形态）", pronunciation: "ham-ni-da", role: "格式体尾" }
    ],
    pronunciationGuide: "【鼻音化】‘합’的收音‘ㅂ’发成‘ㅁ’音，念作 joe-song-ham-ni-da (罪-松-哈-米-达)。",
    usageExplanation: "比普通的‘미안합니다’(对不起)规格更为崇高、真挚，更显诚意和礼貌，适合对长辈或店员使用。"
  },
  {
    id: "v4",
    word: "친구",
    translation: "朋友",
    romanization: "chin-gu",
    category: "daily",
    sampleSentence: "그는 제 친한 친구입니다.",
    sampleTranslation: "他是我的好朋友。",
    components: [
      { char: "친", meaning: "亲（汉字音：亲近、双亲的亲）", pronunciation: "chin", role: "单字" },
      { char: "구", meaning: "旧 / 友（汉字音：旧、友，代指旧交契友）", pronunciation: "gu", role: "单字" }
    ],
    pronunciationGuide: "‘친’是送气音，声音短而轻快爆破；‘구’发生浊化，声母ㄱ发得类似低沉的‘g’。",
    usageExplanation: "可以代指同龄、年龄相仿的人或者同辈好友。如果是男女朋友，一般会说‘남자친구’ (男亲) 或 ‘여자친구’ (女亲)。"
  },
  {
    id: "v5",
    word: "가족",
    translation: "家族/家人",
    romanization: "ga-jok",
    category: "daily",
    sampleSentence: "우리 가족은 모두 네 명입니다.",
    sampleTranslation: "我们家一共有四口人。",
    components: [
      { char: "가", meaning: "家（汉字音：家庭、家具的家）", pronunciation: "ga", role: "词根" },
      { char: "족", meaning: "族（汉字音：民族、种族的族）", pronunciation: "jok", role: "词根" }
    ],
    pronunciationGuide: "首字‘가’发音类似清音 g/k，第二个字‘족’以收音‘ㄱ’(k)结尾，要短暂屏息不爆破送气。",
    usageExplanation: "在韩语中，介绍家人时常用‘우리’(我们)来修饰，例如‘우리 가족’(我的家人们)，这体现了韩国非常重视的集体观念文化。"
  },
  {
    id: "v6",
    word: "집",
    translation: "家/房子",
    romanization: "jip",
    category: "daily",
    sampleSentence: "지금 집에 가고 있어요.",
    sampleTranslation: "我现在正在回家。",
    components: [
      { char: "집", meaning: "房屋、住处（韩语固有词）", pronunciation: "jip", role: "主干" }
    ],
    pronunciationGuide: "在词首读作 ji，由于带有底部收音‘ㅂ’(p)，发音结束时双唇必须优雅地闭合紧贴但不吐气。",
    usageExplanation: "固有词，可以用来指具体的建筑物房屋，或者温馨抽象的家。敬语体中表示‘尊府/家’可使用‘댁’(daek)。"
  },
  {
    id: "v7",
    word: "사랑해",
    translation: "我爱你",
    romanization: "sa-rang-hae",
    category: "daily",
    sampleSentence: "엄마, 정말 사랑해.",
    sampleTranslation: "妈妈，我真的很爱你。",
    components: [
      { char: "사랑", meaning: "爱/爱情（韩语中代表爱情的固有词名物）", pronunciation: "sa-rang", role: "名词词根" },
      { char: "해", meaning: "做（“하다”的半格/非敬语体终结，口语化）", pronunciation: "hae", role: "非敬语尾" }
    ],
    pronunciationGuide: "‘사랑’要发得圆润通顺。‘해’读作 [hae]（类似中文‘嘿’），语调轻柔深情。",
    usageExplanation: "这是非敬语（潘马尔/平语）格式，专门用于非常亲密的恋人、死党或对儿女、晚辈亲人表达爱意。若对长辈表达请说：‘사랑해요’。"
  },
  {
    id: "v_d7",
    word: "네",
    translation: "是 (好的)",
    romanization: "ne",
    category: "daily",
    sampleSentence: "네, 알겠습니다.",
    sampleTranslation: "是的，我知道了/好的。",
    components: [
      { char: "네", meaning: "是（日常中表示肯定、同意或倾听的词语）", pronunciation: "ne", role: "感叹词" }
    ],
    pronunciationGuide: "发扁平的‘ne’。发音短促有力。韩国人在说这个词时有时听着像‘de’，这是因为声母鼻音与塞音的微弱混淆变异，完全属于正常现象。",
    usageExplanation: "在职场、餐馆、陌生对话中最常用来附和对方或表示肯定。非常具有礼貌感，非敬语中则常用‘응’(eung)。"
  },
  {
    id: "v_d8",
    word: "아니요",
    translation: "不 (不是)",
    romanization: "a-ni-yo",
    category: "daily",
    sampleSentence: "아니요, 저는 괜찮습니다.",
    sampleTranslation: "不，我没关系的。",
    components: [
      { char: "아니", meaning: "不（否定固有基础词）", pronunciation: "a-ni", role: "核心词" },
      { char: "요", meaning: "表示尊敬的助词，可以放在多种词尾后面起礼貌作用", pronunciation: "yo", role: "敬体助词" }
    ],
    pronunciationGuide: "注意‘요’要温和收尾。三个字连贯滑读 a-ni-yo。",
    usageExplanation: "对他人的询问表示否定、拒绝或客气推脱时使用极为得体。非敬语中则直接说‘아니’ (a-ni)。"
  },
  {
    id: "v_d9",
    word: "주세요",
    translation: "请给我...",
    romanization: "ju-se-yo",
    category: "daily",
    sampleSentence: "물 좀 주세요.",
    sampleTranslation: "请给我一点水。",
    components: [
      { char: "주", meaning: "给（动词“주다”的词干）", pronunciation: "ju", role: "动词词干" },
      { char: "세요", meaning: "请...，温和的柔和命令与敬语请求尾", pronunciation: "se-yo", role: "终结词尾" }
    ],
    pronunciationGuide: "‘주’发不送气音。可以和前面的名词无缝连接（中间可以隔一个助词）。",
    usageExplanation: "万能韩国生活词！前面直接拼上任何名词（如 밥 주세요、물 주세요、봉투 주세요），就能立马地向店员点单索要对应物品。"
  },

  // 2. 时间日期 (Time/Date)
  {
    id: "v8",
    word: "오늘",
    translation: "今天",
    romanization: "o-neul",
    category: "time",
    sampleSentence: "오늘 날씨가 아주 좋네요.",
    sampleTranslation: "今天天气真好啊。",
    components: [
      { char: "오늘", meaning: "今天（代表当前日期的固有词短语）", pronunciation: "o-neul", role: "时间名词" }
    ],
    pronunciationGuide: "‘늘’下面是收音‘ㄹ’(l)，舌尖要优雅轻微地抵在上齿龈，发出类似‘l’的半音归宿，口型不要张太大。",
    usageExplanation: "可在句中直接充当时间状语。例如‘오늘 만나요’ (今天见面吧)。"
  },
  {
    id: "v9",
    word: "내일",
    translation: "明天",
    romanization: "nae-il",
    category: "time",
    sampleSentence: "우리 내일 몇 시에 만날까요?",
    sampleTranslation: "我们明天几点见面呢？",
    components: [
      { char: "내", meaning: "来（汉字音：来，代表未来的到来）", pronunciation: "nae", role: "词根" },
      { char: "일", meaning: "日（汉字音：一天的日，光阴）", pronunciation: "il", role: "词根" }
    ],
    pronunciationGuide: "‘내’发扁唇音 ae，‘일’字下面带有明显的舌尖边收音‘ㄹ’，连贯读作 [nae-il]。",
    usageExplanation: "汉字词，意为‘来日’即‘明天’。可以用来做时间引导词进行活动邀请策划。"
  },
  {
    id: "v10",
    word: "어제",
    translation: "昨天",
    romanization: "eo-je",
    category: "time",
    sampleSentence: "어제 하루 종일 공부했습니다.",
    sampleTranslation: "昨天学了一整天。",
    components: [
      { char: "어제", meaning: "昨天（固有词）", pronunciation: "eo-je", role: "时间名词" }
    ],
    pronunciationGuide: "‘어’口型要半张呈扁圆形发出 eo 音。不要错念成‘哦’。整个词轻快连发 [eo-je]。",
    usageExplanation: "用在句首或句中表示过往状态，后面的谓语动词一般需要使用过去时态（如 -았/었습니다 或 -았/었어요）。"
  },
  {
    id: "v11",
    word: "지금",
    translation: "现在",
    romanization: "ji-geum",
    category: "time",
    sampleSentence: "지금 무엇을 하고 있습니까?",
    sampleTranslation: "你现在在做什么？",
    components: [
      { char: "지", meaning: "只/至（汉字音：仅在、至）", pronunciation: "ji", role: "词干" },
      { char: "금", meaning: "今（汉字音：当前的今，如古今、今日的今）", pronunciation: "geum", role: "核心词" }
    ],
    pronunciationGuide: "‘금’的收音是‘ㅁ’(m)，发音收尾时嘴唇必须像念‘木’一般完全闭住以留鼻音余音，读作 [ji-geum]。",
    usageExplanation: "汉字词‘如今/现今’。可放在句首引出迫在眉睫的动作。“지금 바빠요”（我现在忙）。"
  },
  {
    id: "v12",
    word: "시간",
    translation: "时间",
    romanization: "si-gan",
    category: "time",
    sampleSentence: "이야기할 시간이 있어요?",
    sampleTranslation: "你有时间聊聊吗？",
    components: [
      { char: "시", meaning: "时（汉字音：韶华、时刻的时）", pronunciation: "si", role: "词根" },
      { char: "간", meaning: "间（汉字音：彼此间隔、空间的时间）", pronunciation: "gan", role: "词根" }
    ],
    pronunciationGuide: "‘시’不可发成拼音‘si’，因为‘ㅅ’相拼‘ㅣ’时摩擦位置靠前，读作‘xi (西)’。‘간’收音是鼻音‘ㄴ’(n)，发音时舌尖抵上齿龈，读作 [si-gan]。",
    usageExplanation: "不仅代表物理上的时间（Time），在生活中由于口语习惯也常用来表达‘空暇、工夫’的意思。"
  },
  {
    id: "v13",
    word: "아침",
    translation: "早上/早餐",
    romanization: "a-chim",
    category: "time",
    sampleSentence: "아침은 드셨어요?",
    sampleTranslation: "你吃早饭了吗？",
    components: [
      { char: "아침", meaning: "晨曦、清晨（固有词名词）", pronunciation: "a-chim", role: "综合词" }
    ],
    pronunciationGuide: "‘침’是送气音 ㅊ，下方是收音‘ㅁ’，闭嘴收尾。整个发音为 a-chim (啊-亲)。",
    usageExplanation: "在韩国生活中它是一词双用，既能指时间上的‘早晨’，也能表示那顿饭即‘早饭’。比如 아침을 먹다 (吃早饭)。"
  },
  {
    id: "v14",
    word: "주말",
    translation: "周末",
    romanization: "ju-mal",
    category: "time",
    sampleSentence: "즐거운 주말 보내세요!",
    sampleTranslation: "祝你度过一个愉快的周末！",
    components: [
      { char: "주", meaning: "周（汉字音：一轮转复的周，如星期、周期）", pronunciation: "ju", role: "词根" },
      { char: "말", meaning: "末（汉字音：终结、边末的末）", pronunciation: "mal", role: "词根" }
    ],
    pronunciationGuide: "‘말’带有收音‘ㄹ’，轻卷舌尖抵住上腭齿根，读出 mal 音。不要念成英文的 mall。",
    usageExplanation: "汉字词‘周末’。每逢周五下午向同事、朋友道别时，最温馨的离别常用句便是：‘주말 잘 보내세요!’ (好好过周末吧)。"
  },

  // 3. 食物 (Food)
  {
    id: "v15",
    word: "물",
    translation: "水",
    romanization: "mul",
    category: "food",
    sampleSentence: "시원한 물 한 잔만 주세요.",
    sampleTranslation: "请给我一杯凉水。",
    components: [
      { char: "물", meaning: "水（韩语固有最根本物性名词）", pronunciation: "mul", role: "名词" }
    ],
    pronunciationGuide: "先发圆唇的 mu 音，底下的‘ㄹ’轻轻将舌头顶上去完成发音。发音类似于 mul。",
    usageExplanation: "去面馆或烤肉店，基本上坐下来第一件事就是说: '여기 물 좀 주세요' (这里请给点水)。"
  },
  {
    id: "v16",
    word: "밥",
    translation: "米饭/一餐",
    romanization: "bap",
    category: "food",
    sampleSentence: "같이 밥 먹으러 가요.",
    sampleTranslation: "一起去吃饭吧。",
    components: [
      { char: "밥", meaning: "熟米饭、餐食、粮食、干饭", pronunciation: "bap", role: "主语名词" }
    ],
    pronunciationGuide: "由于是词首，开头的ㅂ可读得像不送气的‘p/b’，底部带有收音‘ㅂ’(p)，所以最后的动作是闭唇屏气，读作 [bap]。",
    usageExplanation: "不只是大米饭，它在韩国文化中直接等同于‘一餐、饭局’。‘밥 먹었어?’ (吃饭了吗？) 甚至是韩国人用来表达亲和打招呼的‘万能寒暄社交金句’（含义等同于关怀身体）。"
  },
  {
    id: "v17",
    word: "김치",
    translation: "泡菜",
    romanization: "gim-chi",
    category: "food",
    sampleSentence: "매일 김치를 먹습니다.",
    sampleTranslation: "我每天都吃泡菜。",
    components: [
      { char: "김", meaning: "泡菜中咸菜之基，发音同‘金’", pronunciation: "gim", role: "词根" },
      { char: "치", meaning: "泡菜专属固有尾，相当于蔬菜物种后缀", pronunciation: "chi", role: "后缀" }
    ],
    pronunciationGuide: "‘김’字底部有收音‘ㅁ’，闭双唇，‘치’是清亮的强送气声。读作 [gim-chi]。",
    usageExplanation: "韩国国菜代表。照相时用来作为嘴角微笑、拉拢表情的口号，相当于英文里的 ‘Cheese’。"
  },
  {
    id: "v18",
    word: "삼겹살",
    translation: "烤五花肉",
    romanization: "sam-gyeop-sal",
    category: "food",
    sampleSentence: "저녁에 삼겹살을 먹읍시다.",
    sampleTranslation: "晚饭我们吃烤五花肉吧。",
    components: [
      { char: "삼", meaning: "数字三（汉字音：一二三的三，代指肉皮肌肉共三层）", pronunciation: "sam", role: "数词根" },
      { char: "겹", meaning: "重、叠（固有词重合叠起之意）", pronunciation: "gyeop", role: "量词根" },
      { char: "살", meaning: "人畜皮肤之皮肉、肉块之意", pronunciation: "sal", role: "名词根" }
    ],
    pronunciationGuide: "‘삼’收音闭嘴；‘겹’收音闭唇不吐气；‘살’字带ㄹ卷音，三个字节奏顿挫，十分饱满 [sam-gyeop-sal]。",
    usageExplanation: "烤五花肉是韩国国民级的聚餐餐桌中心，常配以烧酒(소주)和用菜叶包肉(쌈)一同塞入口中食用。"
  },
  {
    id: "v19",
    word: "커피",
    translation: "咖啡",
    romanization: "keo-pi",
    category: "food",
    sampleSentence: "따뜻한 커피 아메리카노 좋아해요.",
    sampleTranslation: "我喜欢温热的美式咖啡。",
    components: [
      { char: "커", meaning: "咖啡音译首字母（等同于 Coff）", pronunciation: "keo", role: "外来词音节" },
      { char: "피", meaning: "咖啡音译尾字母（等同于 fee）", pronunciation: "pi", role: "外来词音节" }
    ],
    pronunciationGuide: "注意‘커’不要读成‘科’，它的母音是 eo。‘피’是重送气音。读作 [keo-pi]。",
    usageExplanation: "源于英文的外来词(Coffee)。韩国的咖啡馆密度惊人，现代生活中‘冰美式’ (Ice Americano，俗称아아) 极为受白领和学生追捧。"
  },
  {
    id: "v20",
    word: "맛있어요",
    translation: "好吃/美味",
    romanization: "ma-si-sseo-yo",
    category: "food",
    sampleSentence: "이 한국 요리 정말 맛있어요.",
    sampleTranslation: "这道韩国料理真的特别好吃。",
    components: [
      { char: "맛", meaning: "滋味、味道（名词）", pronunciation: "mat", role: "名词" },
      { char: "있어", meaning: "有（存在词 있다 的形容词语态形态）", pronunciation: "i-sseo", role: "变位形容词" },
      { char: "요", meaning: "尊敬语气收尾助词", pronunciation: "yo", role: "敬体语尾" }
    ],
    pronunciationGuide: "【重点连音】在韩语中，‘맛’的收音ㅅ(t)遇到后面‘있’的母音，发生连音现象（ㅅ转移至后方发音为s）。因此它的实际拼读念法是 ma-si-sseo-yo (玛-西-搜-哟)，极富韵律感。",
    usageExplanation: "夸奖食物味道好的绝对利器。在餐馆用餐后或者去韩国家里做客时，对掌厨或老板说一句‘정말 맛있어요!’，能立刻收获满满的友好目光。"
  },

  // 4. 情绪 (Emotion)
  {
    id: "v22",
    word: "행복하다",
    translation: "幸福",
    romanization: "haeng-bok-ha-da",
    category: "emotion",
    sampleSentence: "가족과 있을 때 가장 행복합니다.",
    sampleTranslation: "和家人在一起时最幸福。",
    components: [
      { char: "행복", meaning: "幸福（汉字音：幸福）", pronunciation: "haeng-bok", role: "名词核心" },
      { char: "하다", meaning: "做、化为形容词的连带行为词尾", pronunciation: "ha-da", role: "形容词尾" }
    ],
    pronunciationGuide: "【重点激音化】当收音‘ㄱ’(k)遇到后面的声母‘ㅎ’(h)时，两者合并爆发为强送气音‘ㅋ’(k')。因此它的标准吐字念法其实是 haeng-bo-ka-da (行-波-卡-达)，并不是 haeng-bok-ha-da。",
    usageExplanation: "常用于正式表达对生活的满意，形容一生的安稳。是比较高级的情绪形容词。"
  },
  {
    id: "v23",
    word: "기쁘다",
    translation: "高兴/喜悦",
    romanization: "gi-ppeu-da",
    category: "emotion",
    sampleSentence: "시험에 합격해서 너무 기뻐요.",
    sampleTranslation: "通过了考试，我太高兴了。",
    components: [
      { char: "기쁘", meaning: "愉悦、高兴、快乐（固有形容词基干）", pronunciation: "gi-ppeu", role: "词干" },
      { char: "다", meaning: "动词、形容词的基本原型尾", pronunciation: "da", role: "基本尾" }
    ],
    pronunciationGuide: "‘쁘’是紧音‘ㅃ’与母音‘ㅡ’相拼，需要拉紧声门肌肉，闭唇爆发不送气。读作 [gi-ppeu-da]。",
    usageExplanation: "常用于表示因获得了某个特定好消息、奖励或通过考试后发自内心的欣喜愉悦。"
  },
  {
    id: "v25",
    word: "재미있다",
    translation: "有趣/好玩",
    romanization: "jae-mi-it-da",
    category: "emotion",
    sampleSentence: "한국어 공부는 정말 재미있어요.",
    sampleTranslation: "学习韩语真的很有趣。",
    components: [
      { char: "재미", meaning: "趣味、兴致、好玩处（固有名词）", pronunciation: "jae-mi", role: "名词" },
      { char: "있다", meaning: "有、存在（动词原型）", pronunciation: "it-da", role: "存在词" }
    ],
    pronunciationGuide: "‘있’带有双收音ㅆ，后面的다由于受到前面收音影响发生硬音化，念得类似 tta。听上去很像 jae-mi-it-da [在-米-一-达]。",
    usageExplanation: "不仅指电影、游戏等“有趣”好玩，当我们在形容一个人幽默健谈，或者学一门语言感到有动力时，均可以用此词描述。"
  },

  // 5. 学习相关 (Study)
  {
    id: "v28",
    word: "한국어",
    translation: "韩语/韩国语",
    romanization: "han-gug-eo",
    category: "study",
    sampleSentence: "저는 매일 한국어를 공부합니다.",
    sampleTranslation: "我每天学习韩语。",
    components: [
      { char: "한국", meaning: "韩国（汉字音：大韩民国之韩国）", pronunciation: "han-guk", role: "国家词根" },
      { char: "어", meaning: "语（汉字音：语言、言辞的语）", pronunciation: "eo", role: "语言后缀" }
    ],
    pronunciationGuide: "【重点连音】‘국’底下的收音‘ㄱ’(k)遇到母音开头的占位符‘ㅇ’，收音顺延向后发生自然连读，由 guk-eo 读成了 gu-geo。因此标准读法为 han-gu-geo (韩-骨-奥)。",
    usageExplanation: "常指韩国语整体。如果是指汉字，可以称‘한국말’ (韩语口语，比较接地气)。"
  },
  {
    id: "v30",
    word: "공부",
    translation: "学习",
    romanization: "gong-bu",
    category: "study",
    sampleSentence: "열심히 공부하면 꿈을 이룰 수 있어요.",
    sampleTranslation: "只要努力学习就能实现梦想。",
    components: [
      { char: "공", meaning: "工 / 功（汉字音：工夫之功，致力于此）", pronunciation: "gong", role: "词根" },
      { char: "부", meaning: "夫（汉字音：学夫、人夫之夫，代表付诸劳作的心力）", pronunciation: "bu", role: "词根" }
    ],
    pronunciationGuide: "‘공’需要完整发出后鼻音 -ng；‘부’发松音 bu。读音平稳有力 [gong-bu]。",
    usageExplanation: "来源于中文的‘功夫’，在韩文里专用作‘学习、攻读课业’。加上形容词/副词‘열심히’ (热心地/努力地)，便是著名的“열심히 공부하다” (努力学习)。"
  },
  {
    id: "v32",
    word: "선생님",
    translation: "老师",
    romanization: "seon-saeng-nim",
    category: "study",
    sampleSentence: "우리 선생님은 아주 친절하십니다.",
    sampleTranslation: "我们的老师非常亲切。",
    components: [
      { char: "선생", meaning: "先生（汉字音：先出生、先生，相当于 Teacher/学长）", pronunciation: "seon-saeng", role: "名词核心" },
      { char: "님", meaning: "敬称后缀（古代称主公为“님”，现代用来对人称尊，表示极高的敬意）", pronunciation: "nim", role: "高级尊称尾" }
    ],
    pronunciationGuide: "平缓干净发出 [seon-saeng-nim]，注意‘님’是以‘ㅁ’接尾，发音收尾时双唇必须优雅完整合拢闭目，做出恭敬态。",
    usageExplanation: "最基础的尊称词。只要是传授知识、行业专家甚至只是遇到可信赖的年长路人，喊一声‘선생님’一定是不损脸面、十分有教养的行为。"
  },

  // 6. 购物相关 (Shopping - NEW)
  {
    id: "v_sh1",
    word: "백화점",
    translation: "百货商店",
    romanization: "baek-hwa-jeom",
    category: "shopping",
    sampleSentence: "백화점에서 쇼핑을 해요.",
    sampleTranslation: "我在百货公司买东西/购物。",
    components: [
      { char: "백", meaning: "百（汉字音：多、丰富、一百）", pronunciation: "baek", role: "词根" },
      { char: "화", meaning: "货（汉字音：货物、商品）", pronunciation: "hwa", role: "词根" },
      { char: "점", meaning: "店（汉字音：驿站、商铺铺子）", pronunciation: "jeom", role: "词根" }
    ],
    pronunciationGuide: "【重点激音化】首个‘백’的字底收音‘ㄱ’(k)遇到紧挨声母‘ㅎ’(h)时结合变为强爆音‘ㅋ’。因此实际流利口音是 bae-kwa-jeom (白-跨-中)，而不是生硬拆分。",
    usageExplanation: "通常指首尔乐天、新世界或现代百货等高档、大型百货商店。"
  },
  {
    id: "v_sh2",
    word: "할인",
    translation: "折扣/优惠",
    romanization: "hal-in",
    category: "shopping",
    sampleSentence: "이 가방은 할인이 되나요?",
    sampleTranslation: "这个包包能打折吗？",
    components: [
      { char: "할", meaning: "割（汉字音：切割、割舍、让利）", pronunciation: "hal", role: "词根" },
      { char: "인", meaning: "引（汉字音：引逗、扣除、延展）", pronunciation: "in", role: "词根" }
    ],
    pronunciationGuide: "【重点弱化与连读】由于声母ㅇ没有硬阻碍，‘할’底下的‘ㄹ’和‘인’完美交连。实际快速发音非常像 ha-rin (哈-林) 。",
    usageExplanation: "‘할인’代表 Discount。‘할인마트’即打折大商场（emart一类）。"
  },
  {
    id: "v_sh3",
    word: "돈",
    translation: "钱/货币",
    romanization: "don",
    category: "shopping",
    sampleSentence: "현금이 없어요. 돈이 필요해요.",
    sampleTranslation: "我没有现金，我需要钱。",
    components: [
      { char: "돈", meaning: "钱财、货币（韩语固有最基础名词）", pronunciation: "don", role: "主词" }
    ],
    pronunciationGuide: "发音类似于 don（“多恩”快读），底部是舌头抵住上齿根的收音‘ㄴ’(n)。",
    usageExplanation: "在生活中，如果你想开玩笑说‘我没钱了’，可以沮丧地说：‘돈이 없어요’ (多尼-哦不-搜哟)。"
  },
  {
    id: "v_sh4",
    word: "시장",
    translation: "市场/集市",
    romanization: "si-jang",
    category: "shopping",
    sampleSentence: "광장시장에서 떡볶이를 샀어요.",
    sampleTranslation: "我在广藏市场买了辣炒年糕。",
    components: [
      { char: "시", meaning: "市（汉字音：开市、行市）", pronunciation: "si", role: "词根" },
      { char: "장", meaning: "场（汉字音：广场、商场、会场）", pronunciation: "jang", role: "词根" }
    ],
    pronunciationGuide: "‘시’读音为 xi，‘장’要发出明显圆润的后鼻音 [si-jang]。",
    usageExplanation: "可指现代市场（마켓），更通常代指韩国极具烟火气、汇聚传统小吃的“전통 시장”（传统集市），如著名的一口吃明洞广藏市场或通仁市场。"
  },
  {
    id: "v_sh5",
    word: "영수증",
    translation: "小票/收据",
    romanization: "yeong-su-jeung",
    category: "shopping",
    sampleSentence: "영수증을 버려 주세요.",
    sampleTranslation: "请帮我扔掉收据（结账后）。",
    components: [
      { char: "영수", meaning: "领收（汉字音：领受、取收物资）", pronunciation: "yeong-su", role: "名词行为" },
      { char: "증", meaning: "证（汉字音：凭证、证明之凭证）", pronunciation: "jeung", role: "名词物后缀" }
    ],
    pronunciationGuide: "‘증’读 j-eu-ng。发音略有硬度，平稳有节奏地念 yeong-su-jeung。",
    usageExplanation: "在韩国任何地方结账，收银员一般会习惯问一句：‘영수증 드릴까요?’ (要收据小票吗？)。不想要一般回一句 ‘아니요, 버려주세요’ (不要，扔掉就可以了)。"
  },

  // 7. 交通出行 (Traffic - NEW)
  {
    id: "v_tr1",
    word: "지하철",
    translation: "地铁",
    romanization: "ji-ha-cheol",
    category: "traffic",
    sampleSentence: "지하철역이 어디입니까?",
    sampleTranslation: "地铁站在哪里？",
    components: [
      { char: "지하", meaning: "地下（汉字音：地面之下，避风雨处）", pronunciation: "ji-ha", role: "层级词根" },
      { char: "철", meaning: "铁（汉字音：钢铁之铁，代表铁道交通）", pronunciation: "cheol", role: "车辆形式根" }
    ],
    pronunciationGuide: "‘철’字含有强烈的送气辅音 ch，它的尾部是‘ㄹ’(l)，所以发的时候要顶舌念 cheol [起奥尔]。",
    usageExplanation: "首尔的地铁交通冠绝全球，多达几十条线。坐地铁是最主要的韩国短途出行形式。"
  },
  {
    id: "v_tr2",
    word: "택시",
    translation: "出租车",
    romanization: "taek-si",
    category: "traffic",
    sampleSentence: "택시를 타고 가요.",
    sampleTranslation: "我们乘出租车走吧。",
    components: [
      { char: "택", meaning: "英语 Taxi 首音节音译", pronunciation: "taek", role: "外来音节" },
      { char: "시", meaning: "英语 Taxi 尾音节音译", pronunciation: "si", role: "外来音节" }
    ],
    pronunciationGuide: "‘택’以收音‘ㄱ’(k)结尾，需发塞音短停顿，‘시’读 xi（西），由于前面的收音，部分人会念成有点紧音化的 taek-ssi。",
    usageExplanation: "在首尔主要街道和路边随便一招手即有车可用。招手说一句 ‘택시!’ 极接轨。"
  },
  {
    id: "v_tr3",
    word: "버스 정류장",
    translation: "公交车站",
    romanization: "beo-seu jeong-ryu-jang",
    category: "traffic",
    sampleSentence: "버스 정류장에서 버스를 기다려요.",
    sampleTranslation: "我在公共汽车站等候公交车。",
    components: [
      { char: "버스", meaning: "英文 Bus 的韩语音译（公共汽车）", pronunciation: "beo-seu", role: "外来名词" },
      { char: "정류장", meaning: "停留场（汉字音：正轨停留处、停留点所）", pronunciation: "jeong-ryu-jang", role: "场所名词" }
    ],
    pronunciationGuide: "【鼻音重组】‘정류장’(停放点)由于音节辅音遇到后，实际口语读作 jeong-nyu-jang (整-扭-江)。注意'r'音受前鼻音同化改成了'n'音。",
    usageExplanation: "韩国的公交站在部分路道中央设立专用站牌（中央车道），看液晶屏即能非常确切地获知哪辆巴士还有几分钟入站。"
  },
  {
    id: "v_tr4",
    word: "비행기",
    translation: "飞机",
    romanization: "bi-haeng-gi",
    category: "traffic",
    sampleSentence: "비행기 표를 예매했습니다.",
    sampleTranslation: "我提前买了飞机票。",
    components: [
      { char: "비행", meaning: "飞行（汉字音：云天飞翔的行为）", pronunciation: "bi-haeng", role: "动状词根" },
      { char: "기", meaning: "器/机（汉字音：机械、飞机的机物）", pronunciation: "gi", role: "器物理后缀" }
    ],
    pronunciationGuide: "平缓干净发出 bi-haeng-gi [比-行-给]，喉咙声气流畅。",
    usageExplanation: "汉字词‘飞行器’即‘飞机’。在谈及去国际旅游或者从大邱、釜山飞首尔（金浦机场）时常用于指明工具。"
  },

  // 8. 旅游观光 (Travel - NEW)
  {
    id: "v_tv1",
    word: "여권",
    translation: "护照",
    romanization: "yeo-gwon",
    category: "travel",
    sampleSentence: "여권을 꼭 가져가세요.",
    sampleTranslation: "一定要带好护照去哦。",
    components: [
      { char: "여", meaning: "旅（汉字音：旅行、旅途旅伴的旅）", pronunciation: "yeo", role: "旅行词根" },
      { char: "권", meaning: "券/证（汉字音：凭证、印本的券）", pronunciation: "gwon", role: "证照词尾" }
    ],
    pronunciationGuide: "【重点浓音化】‘여’是双母音 yeo。‘권’紧挨跟着前面，实际常发为紧音 yeo-gkwon (也有点像 yeo-kkwon)。",
    usageExplanation: "出门在外最重要的护身凭证‘护照’。在韩国免税店退税或是值机时，必定会被要求：‘여권 보여주세요’ (请出示下护照)。"
  },
  {
    id: "v_tv2",
    word: "공항",
    translation: "机场",
    romanization: "gong-hang",
    category: "travel",
    sampleSentence: "인천공항은 아주 큽니다.",
    sampleTranslation: "仁川机场特别宏大。",
    components: [
      { char: "공", meaning: "空（汉字音：天下、苍穹天空之空）", pronunciation: "gong", role: "词根" },
      { char: "항", meaning: "港（汉字音：港湾、停靠要塞航空港之港）", pronunciation: "hang", role: "港湾词根" }
    ],
    pronunciationGuide: "两个字均是明显的后鼻音 -ng。要完美呼气，念作 gong-hang [工-抗]。",
    usageExplanation: "专指 airport，如仁川机场(인천공항)或者金浦机场(김포공항)。"
  },
  {
    id: "v_tv3",
    word: "호텔",
    translation: "酒店/旅馆",
    romanization: "ho-tel",
    category: "travel",
    sampleSentence: "호텔 예약을 확인해 주세요.",
    sampleTranslation: "请帮我核对确认一下酒店预约。",
    components: [
      { char: "호텔", meaning: "Hotel（英文酒店的音译）", pronunciation: "ho-tel", role: "外来代词" }
    ],
    pronunciationGuide: "‘텔’字带有收音‘ㄹ’，顶舌尖念 ho-tel (后-台-奥)。注意声调要清凉明晰。",
    usageExplanation: "源自英文 Hotel。除了高阶的호텔，如果是小众的、韩国极具本土特色的现代地暖旅馆，则可以叫 ‘펜션’ (Pension) 或 ‘모텔’ (Motel)。"
  },
  {
    id: "v_tv4",
    word: "바다",
    translation: "海/海洋",
    romanization: "ba-da",
    category: "travel",
    sampleSentence: "부산 바다가 정말 아름다워요.",
    sampleTranslation: "釜山的大海简直太迷人了。",
    components: [
      { char: "바다", meaning: "大海、洋流（固有词最重要的大自然名词）", pronunciation: "ba-da", role: "名词" }
    ],
    pronunciationGuide: "两个母音都是 ㅏ (a)。不要带有鼻音。读作 [ba-da]（霸-达）。",
    usageExplanation: "釜山的海景是去韩国自由行的极品目的地。‘바다를 보다’ (看海)也是大自然疗愈人内心的最爱语境。"
  }
];

export const SENTENCE_PATTERNS: SentencePattern[] = [
  {
    id: "s1",
    category: "introduction",
    korean: "저는 중국 사람입니다",
    chinese: "我是中国人",
    breakdown: [
      { word: "저", meaning: "我（谦称，相当于汉语中的‘鄙人/在下’）" },
      { word: "는", meaning: "主语助词（放在以元音结尾的词后面，表示动作主语或谈话话题）" },
      { word: "중국", meaning: "中国" },
      { word: "사람", meaning: "人" },
      { word: "입니다", meaning: "是（陈述语气尊待终结词尾，常作系动词‘是’）" }
    ]
  },
  {
    id: "s2",
    category: "order",
    korean: "비빔밥 하나 주세요",
    chinese: "请给我一个拌饭 (请给我一份石锅拌饭)",
    breakdown: [
      { word: "비빔밥", meaning: "石锅拌饭（韩式拌饭）" },
      { word: "하나", meaning: "一个（固有词基数，数词‘1’）" },
      { word: "주세요", meaning: "请给...（由动词 주다 和 敬语词尾 构成，表示客气的请求）" }
    ]
  },
  {
    id: "s3",
    category: "shopping",
    korean: "이것은 얼마입니까?",
    chinese: "这个多少钱？",
    breakdown: [
      { word: "이것", meaning: "这个（指示代词，代指靠近说话人的物品）" },
      { word: "은", meaning: "主语/话题助词（接在有收音/辅音结尾的字后）" },
      { word: "얼마", meaning: "多少" },
      { word: "입니까?", meaning: "是吗？（陈述词尾 です 的疑问句形式，表示尊敬的疑问）" }
    ]
  },
  {
    id: "s4",
    category: "directions",
    korean: "화장실이 어디에 있습니까?",
    chinese: "洗手间在哪里？",
    breakdown: [
      { word: "화장실", meaning: "洗手间 / 化妆室" },
      { word: "이", meaning: "主语助词（用于带收音/辅音结尾的名词后）" },
      { word: "어디", meaning: "哪里 / 哪儿" },
      { word: "에", meaning: "位置/方向副词格助词（表示存在的场所）" },
      { word: "있습니까?", meaning: "有吗？/ 在吗？（存在词 있다 结合疑问终结词尾）" }
    ]
  },
  {
    id: "s5",
    category: "greeting",
    korean: "만나서 반갑습니다",
    chinese: "见到你很高兴",
    breakdown: [
      { word: "만나서", meaning: "因为见面（动词 만나다 遇到/见面 + 连接词尾 아서 表示前因后果）" },
      { word: "반갑습니다", meaning: "高兴/愉悦（形容词 반갑다 结合尊敬终结词尾）" }
    ]
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: "sc1",
    theme: "餐厅",
    icon: "Utensils",
    description: "在韩国当地饭馆点餐、询问推荐并要买单结账",
    dialogue: [
      { speaker: "店员", speakerNameCn: "服务员", korean: "어서 오세요! 몇 분이세요?", pronunciation: "eo-seo o-se-yo! myeot bu-ni-se-yo?", translation: "欢迎光临！请问一共几位？" },
      { speaker: "顾客", speakerNameCn: "我（顾客）", korean: "두 명이에요. 자리가 있어요?", pronunciation: "du myeong-i-e-yo. ja-ri-ga i-sseo-yo?", translation: "两位。请问有座位吗？", isCurrentUser: true },
      { speaker: "店员", speakerNameCn: "服务员", korean: "네, 이쪽으로 앉으세요. 메뉴판 여기 있습니다.", pronunciation: "ne, i-jjog-eu-ro an-jeu-se-yo. me-nyu-pan yeo-gi i-sseom-ni-da.", translation: "有的，请坐这边。这是菜单。" },
      { speaker: "顾客", speakerNameCn: "我（顾客）", korean: "여기 뭐가 제일 맛있어요?", pronunciation: "yeo-gi mwo-ga je-il ma-si-sseo-yo?", translation: "这里什么东西最推荐（最好吃）？", isCurrentUser: true },
      { speaker: "店员", speakerNameCn: "服务员", korean: "삼겹살이 제일 인기가 많습니다.", pronunciation: "sam-gyeop-sa-ri je-il in-gi-ga man-seom-ni-da.", translation: "烤五花肉是最受欢迎的。" },
      { speaker: "顾客", speakerNameCn: "我（顾客）", korean: "그럼 삼겹살 이인분하고 맥주 한 병 주세요.", pronunciation: "geu-reom sam-gyeop-sal i-in-bun-ha-go maek-ju han byeong ju-se-yo.", translation: "那请给我来两份五花肉和一瓶啤酒。", isCurrentUser: true },
      { speaker: "店员", speakerNameCn: "服务员", korean: "네, 알겠습니다. 잠시만 기다려 주세요.", pronunciation: "ne, al-ge-sseom-ni-da. jam-si-man gi-da-ryeo ju-se-yo.", translation: "好的，明白了。请稍等片刻。" }
    ],
    highFreqWords: [
      { korean: "메뉴판", chinese: "菜单", romanization: "me-nyu-pan" },
      { korean: "이인분", chinese: "两人份", romanization: "i-in-bun" },
      { korean: "맥주", chinese: "啤酒", romanization: "maek-ju" },
      { korean: "여기요", chinese: "这里/服务员（叫欧巴、阿姨、服务生用）", romanization: "yeo-gi-yo" }
    ],
    sentenceTemplates: [
      { korean: "[食物] 주세요.", chinese: "请给我[食物]。", explanation: "最万能的点餐公式，比如 '물 주세요' (请给我水)。" },
      { korean: "맵지 않게 해주세요.", chinese: "请做得不要太辣。", explanation: "不习惯吃辣的学员必背 '맵지 않게' 表示清淡/不要放辣。" }
    ]
  },
  {
    id: "sc2",
    theme: "便利店",
    icon: "ShoppingBag",
    description: "在CU或GS25等便利店买水零食、结账和要塑料袋",
    dialogue: [
      { speaker: "店员", speakerNameCn: "收银员", korean: "안녕하세요, 봉투 필요하세요?", pronunciation: "an-nyeong-ha-se-yo, bong-tu pil-yo-ha-se-yo?", translation: "你好，请问需要塑料袋/手提袋吗？" },
      { speaker: "顾客", speakerNameCn: "我（顾客）", korean: "네, 하나 주세요. 그리고 이 우유는 얼마예요?", pronunciation: "ne, ha-na ju-se-yo. geu-ri-go i u-yu-neun ol-ma-ye-yo?", translation: "是的，请给我一个。另外这个牛奶多少钱？", isCurrentUser: true },
      { speaker: "店员", speakerNameCn: "收银员", korean: "천오백 원입니다. 카드로 결제하시겠어요?", pronunciation: "cheon-o-baek won-im-ni-da. ka-deu-ro gyeol-je-ha-si-ge-sseo-yo?", translation: "1500韩元。请问是用卡刷卡结账吗？" },
      { speaker: "顾客", speakerNameCn: "我（顾客）", korean: "네, 카드로 할게요. 여기 있습니다.", pronunciation: "ne, ka-deu-ro hal-ge-yo. yeo-gi i-sseom-ni-da.", translation: "是的，刷卡。给你卡。", isCurrentUser: true },
      { speaker: "店员", speakerNameCn: "收银员", korean: "결제 완료되었습니다. 영수증 드릴까요?", pronunciation: "gyeol-je wan-ryo-doe-eom-ni-da. yeong-su-jeung deu-ril-kka-yo?", translation: "结账完成了。需要小票收据吗？" },
      { speaker: "顾客", speakerNameCn: "我（顾客）", korean: "아니요, 괜찮습니다. 감사합니다.", pronunciation: "a-ni-yo, gwaen-chan-seom-ni-da. gam-sa-ham-ni-da.", translation: "不要了，不用。谢谢啦！", isCurrentUser: true }
    ],
    highFreqWords: [
      { korean: "봉투", chinese: "袋子/塑料袋", romanization: "bong-tu" },
      { korean: "원", chinese: "韩元（币种单位）", romanization: "won" },
      { korean: "영수증", chinese: "发票/收据", romanization: "yeong-su-jeung" },
      { korean: "카드", chinese: "卡/信用卡", romanization: "ka-deu" }
    ],
    sentenceTemplates: [
      { korean: "카드로 계산해 주세요.", chinese: "请帮我用卡结账。", explanation: "'계산하다'是结账。用卡结账是韩国最主流的支付方法。" },
      { korean: "티머니 카드 충전해 주세요.", chinese: "请帮我充值交通卡(T-Money)。", explanation: "去便利店找柜台充值T-Money最常用的韩语。" }
    ]
  },
  {
    id: "sc3",
    theme: "学校",
    icon: "School",
    description: "在校园询问图书馆位置、讨论韩语课业",
    dialogue: [
      { speaker: "同学", speakerNameCn: "韩国同学", korean: "안녕하세요! 오늘 수업 어디서 해요?", pronunciation: "an-nyeong-ha-se-yo! o-neul su-eop eo-di-seo hae-yo?", translation: "同学你好！今天上课在哪里上桌啊？" },
      { speaker: "顾客", speakerNameCn: "我（留学新生）", korean: "어학당 건물 삼층에서 해요. 같이 갈래요?", pronunciation: "eo-hak-dang geon-mul sam-cheung-e-seo hae-yo. ga-chi gal-rae-yo?", translation: "在语学堂大楼的三层上。要一起过去吗？", isCurrentUser: true },
      { speaker: "同学", speakerNameCn: "韩国同学", korean: "좋아요. 오늘 한국어 시험은 잘 공부했어요?", pronunciation: "jo-ha-yo. o-neul han-gug-eo si-heo-meun jal gong-bu-hae-sseo-yo?", translation: "太好了。今天的韩语考试，你有好好预习准备吗？" },
      { speaker: "顾客", speakerNameCn: "我（留学新生）", korean: "조금 힘들었어요. 문법이 너무 어려워요.", pronunciation: "jo-geum him-deul-eo-sseo-yo. mun-beo-bi neo-mu eo-ryeo-wo-yo.", translation: "有点吃力。语法点觉得实在太难了。", isCurrentUser: true },
      { speaker: "同学", speakerNameCn: "韩国同学", korean: "괜찮아요, 제가 도와줄게요. 같이 화이팅해요!", pronunciation: "gwaen-chan-a-yo, je-ga do-wa-jul-ge-yo. ga-chi hwa-i-ting-hae-yo!", translation: "没关系，我可以帮你。我们一起加油奋斗！" }
    ],
    highFreqWords: [
      { korean: "어학당", chinese: "语学堂 (韩语学习机构)", romanization: "eo-hak-dang" },
      { korean: "수업", chinese: "课堂/课程", romanization: "su-eop" },
      { korean: "문법", chinese: "语法", romanization: "mun-beop" },
      { korean: "화이팅", chinese: "加油 (Fighting)", romanization: "hwa-i-ting" }
    ],
    sentenceTemplates: [
      { korean: "수업이 몇 시에 끝나요?", chinese: "课程几点结束？", explanation: "询问上课结课时间。" },
      { korean: "도와주셔서 고마워요.", chinese: "谢谢帮我忙。", explanation: "在学校向同学或老师求助后极佳的友好回复。" }
    ]
  },
  {
    id: "sc4",
    theme: "机场",
    icon: "Plane",
    description: "在首尔仁川机场入境、寻找出租车乘车点",
    dialogue: [
      { speaker: "店员", speakerNameCn: "机场入境官员", korean: "여권 보여주세요. 방문 목적이 무엇입니까?", pronunciation: "yeo-gwon bo-yeo-ju-se-yo. bang-mun mok-jeog-i mu-eo-sim-ni-ka?", translation: "请出示您的护照。请问此次入韩访问目的是什么？" },
      { speaker: "顾客", speakerNameCn: "我（游客）", korean: "관광입니다. 일주일 동안 있을 거예요.", pronunciation: "gwan-gwang-im-ni-da. il-ju-il dong-an i-sseul geo-ye-yo.", translation: "是旅游。一共待一个星期。", isCurrentUser: true },
      { speaker: "店员", speakerNameCn: "机场入境官员", korean: "네, 확인되었습니다. 좋은 여행 되세요.", pronunciation: "ne, hwa-gin-doe-eom-ni-da. jo-eun yeo-haeng doe-se-yo.", translation: "好的，验证成功了。祝您旅途愉快。" },
      { speaker: "顾客", speakerNameCn: "我（游客）", korean: "감사합니다. 택시 타는 곳은 어디인가요?", pronunciation: "gam-sa-ham-ni-da. taek-si ta-neun go-seun eo-di-in-ga-yo?", translation: "谢谢您。请问坐出租车在哪里坐？", isCurrentUser: true },
      { speaker: "店员", speakerNameCn: "机场服务台", korean: "일층 게이트 6번 밖으로 나가시면 바로 있습니다.", pronunciation: "il-cheung ge-i-teu yuk-beon ba-ggeo-ro na-ga-si-myeon ba-ro i-sseom-ni-da.", translation: "走到一楼 6 号门外面就立刻可以看到出租车停靠点。" }
    ],
    highFreqWords: [
      { korean: "여권", chinese: "护照", romanization: "yeo-gwon" },
      { korean: "관광", chinese: "旅游/观光", romanization: "gwan-gwang" },
      { korean: "택시", chinese: "出租车 (Taxi)", romanization: "taek-si" },
      { korean: "게이트", chinese: "登机口/大门 (Gate)", romanization: "ge-i-teu" }
    ],
    sentenceTemplates: [
      { korean: "짐 찾는 곳이 어디예요?", chinese: "行李提取处在哪里？", explanation: "下飞机后寻找行李转盘的最强用句。" },
      { korean: "와이파이 빌릴 수 있어요?", chinese: "有可以租赁随身Wi-Fi的地方吗？", explanation: "在机场柜台寻找并租用移动网络的句子。" }
    ]
  },
  {
    id: "sc5",
    theme: "旅游/路人",
    icon: "Map",
    description: "在明洞或弘大迷路搜寻地铁站，向路人客气打听路线",
    dialogue: [
      { speaker: "顾客", speakerNameCn: "我（迷路游客）", korean: "저기요, 길 좀 여쭤볼게요. 명동역이 어디에 있어요?", pronunciation: "jeo-gi-yo, gil jom yeo-jjeo-bol-ge-yo. myeong-dong-yeo-gi eo-di-e i-sseo-yo?", translation: "打扰一下，可以问个路吗？请问明洞地铁站在哪里啊？", isCurrentUser: true },
      { speaker: "店员", speakerNameCn: "热心路人", korean: "아, 명동요? 여기서 직진한 다음 우회전하세요.", pronunciation: "a, myeong-dong-yo? yeo-gi-seo jik-jin-han da-eum u-hoe-jeon-ha-se-yo.", translation: "啊，明洞站吗？从这里一直往前走，然后右转。" },
      { speaker: "顾客", speakerNameCn: "我（迷路游客）", korean: "여기서 멀어요? 걸어서 몇 분 걸려요?", pronunciation: "yeo-gi-seo meol-eo-yo? geol-eo-seo myeot bun geol-ryeo-yo?", translation: "离这儿远不远？走路需要几分钟呢？", isCurrentUser: true },
      { speaker: "店员", speakerNameCn: "热心路人", korean: "안 멀어요. 오 분 정도 걸려요. 지하철 표지판이 보일 거예요.", pronunciation: "an meol-eo-yo. o bun jeong-do geol-ryeo-yo. ji-ha-cheol pyo-ji-pa-ni bo-il geo-ye-yo.", translation: "不远。走过去大概五分钟左右就能到了。您会看到地铁标识的。" },
      { speaker: "顾客", speakerNameCn: "我（迷路游客）", korean: "친절하게 설명해 주셔서 정말 감사합니다!", pronunciation: "chin-jeol-ha-ge seol-myeong-hae ju-seo-seo jeong-mal gam-sa-ham-ni-da!", translation: "非常感谢您如此耐心的指方向！太感谢您了！", isCurrentUser: true }
    ],
    highFreqWords: [
      { korean: "지하철역", chinese: "地铁站", romanization: "ji-ha-cheol-yeok" },
      { korean: "직진", chinese: "直走", romanization: "jik-jin" },
      { korean: "우회전", chinese: "右转", romanization: "u-hoe-jeon" },
      { korean: "걸어서", chinese: "步行地/用脚走", romanization: "geol-eo-seo" }
    ],
    sentenceTemplates: [
      { korean: "[地点] 어떻게 가요?", chinese: "去[地点]该怎么走？", explanation: "最经典的经典问路法，如 '서울역 어떻게 가요?' (去首尔站怎么去)。" },
      { korean: "지도로 보여주세요.", chinese: "请帮我在地图上指一下。", explanation: "听不懂韩国语方向时，让人看手机地图用语。" }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "初学发音", description: "点击并学习至少5个40音发音", icon: "BookOpen", targetCount: 5, type: "alphabet", unlocked: false },
  { id: "a2", title: "40音学者", description: "完成全部40音字母发音浏览学习", icon: "GraduationCap", targetCount: 40, type: "alphabet", unlocked: false },
  { id: "a3", title: "积少成多", description: "累计熟悉或解锁10个常用韩语词汇", icon: "Layers", targetCount: 10, type: "vocabulary", unlocked: false },
  { id: "a4", title: "词汇小达人", description: "累计熟悉或解锁25个常用韩语词汇", icon: "Database", targetCount: 25, type: "vocabulary", unlocked: false },
  { id: "a5", title: "出口成章", description: "点击学习或拆解至少3种基础句型样式", icon: "Bookmark", targetCount: 3, type: "sentence", unlocked: false },
  { id: "a6", title: "答题小天才", description: "在词汇记忆大测验中小游戏获得累积100分以上", icon: "Zap", targetCount: 100, type: "score", unlocked: false },
  { id: "a7", title: "一鼓作气", description: "连续每日学习打卡打卡达 2 天", icon: "Flame", targetCount: 2, type: "streak", unlocked: false }
];
