// Comprehensive Uzbekistan cities dictionary for SEO route resolution.
// Each city has one canonical slug (preferred Latin form) plus aliases that
// cover Uzbek Latin, Russian transliteration, common typos and slugified API
// outputs. All aliases resolve to the canonical slug via CITY_BY_ALIAS.

export interface City {
  key: string;       // canonical slug (used in URL)
  ru: string;        // Russian display name
  uz: string;        // Uzbek display name
  en: string;        // English display name
  lat: number;
  lon: number;
  aliases: string[]; // additional slug forms that should resolve to this city
  popular?: boolean; // top-tier cities for popular routes generation
}

export const CITIES: City[] = [
  // Tier 1 — capitals / largest cities
  { key: "tashkent", ru: "Ташкент", uz: "Toshkent", en: "Tashkent", lat: 41.2995, lon: 69.2401, aliases: ["toshkent", "tashkent", "tashkant", "tashkend"], popular: true },
  { key: "samarkand", ru: "Самарканд", uz: "Samarqand", en: "Samarkand", lat: 39.6547, lon: 66.9758, aliases: ["samarqand", "samarkand", "samarkant"], popular: true },
  { key: "bukhara", ru: "Бухара", uz: "Buxoro", en: "Bukhara", lat: 39.7747, lon: 64.4286, aliases: ["buxoro", "bukhara", "buhara"], popular: true },
  { key: "namangan", ru: "Наманган", uz: "Namangan", en: "Namangan", lat: 41.0011, lon: 71.6726, aliases: ["namangan"], popular: true },
  { key: "andijan", ru: "Андижан", uz: "Andijon", en: "Andijan", lat: 40.7821, lon: 72.3442, aliases: ["andijon", "andijan", "andizhan"], popular: true },
  { key: "fergana", ru: "Фергана", uz: "Fargona", en: "Fergana", lat: 40.3842, lon: 71.7843, aliases: ["fargona", "fargʻona", "fergana", "ferghana", "fargona-shahar"], popular: true },
  { key: "nukus", ru: "Нукус", uz: "Nukus", en: "Nukus", lat: 42.4531, lon: 59.6103, aliases: ["nukus"], popular: true },
  { key: "khiva", ru: "Хива", uz: "Xiva", en: "Khiva", lat: 41.3775, lon: 60.3594, aliases: ["xiva", "khiva", "hiva"], popular: true },
  { key: "urgench", ru: "Ургенч", uz: "Urganch", en: "Urgench", lat: 41.5503, lon: 60.6347, aliases: ["urganch", "urgench"], popular: true },
  { key: "termez", ru: "Термез", uz: "Termiz", en: "Termez", lat: 37.2242, lon: 67.2783, aliases: ["termiz", "termez"], popular: true },
  { key: "qarshi", ru: "Карши", uz: "Qarshi", en: "Qarshi", lat: 38.8608, lon: 65.7903, aliases: ["qarshi", "karshi"], popular: true },
  { key: "kokand", ru: "Коканд", uz: "Qoqon", en: "Kokand", lat: 40.5283, lon: 70.9425, aliases: ["qoqon", "qoʻqon", "qokon", "kokand", "kukon"], popular: true },
  { key: "jizzakh", ru: "Джизак", uz: "Jizzax", en: "Jizzakh", lat: 40.1158, lon: 67.8422, aliases: ["jizzax", "jizzakh", "djizak"], popular: true },
  { key: "navoi", ru: "Навои", uz: "Navoiy", en: "Navoi", lat: 40.0843, lon: 65.3791, aliases: ["navoiy", "navoi", "navoiy-shahar"], popular: true },
  { key: "gulistan", ru: "Гулистан", uz: "Guliston", en: "Gulistan", lat: 40.4897, lon: 68.7842, aliases: ["guliston", "gulistan"], popular: true },
  { key: "margilan", ru: "Маргилан", uz: "Margilon", en: "Margilan", lat: 40.4711, lon: 71.7244, aliases: ["margilon", "margilan"], popular: true },
  { key: "chirchiq", ru: "Чирчик", uz: "Chirchiq", en: "Chirchik", lat: 41.4683, lon: 69.5808, aliases: ["chirchiq", "chirchik"], popular: true },

  // Tier 2 — regional centers / mid-size
  { key: "shahrisabz", ru: "Шахрисабз", uz: "Shahrisabz", en: "Shahrisabz", lat: 39.0531, lon: 66.8369, aliases: ["shahrisabz", "shaxrisabz"] },
  { key: "almalyk", ru: "Алмалык", uz: "Olmaliq", en: "Almalyk", lat: 40.8456, lon: 69.5983, aliases: ["olmaliq", "almalyk", "almalik"] },
  { key: "angren", ru: "Ангрен", uz: "Angren", en: "Angren", lat: 41.0167, lon: 70.1436, aliases: ["angren"] },
  { key: "bekabad", ru: "Бекабад", uz: "Bekobod", en: "Bekabad", lat: 40.2208, lon: 69.2697, aliases: ["bekobod", "bekabad"] },
  { key: "yangiyul", ru: "Янгиюль", uz: "Yangiyol", en: "Yangiyul", lat: 41.1136, lon: 69.0461, aliases: ["yangiyol", "yangiyul"] },
  { key: "yangiyer", ru: "Янгиер", uz: "Yangiyer", en: "Yangiyer", lat: 40.2733, lon: 68.8167, aliases: ["yangiyer"] },
  { key: "asaka", ru: "Асака", uz: "Asaka", en: "Asaka", lat: 40.6403, lon: 72.2400, aliases: ["asaka"] },
  { key: "chust", ru: "Чуст", uz: "Chust", en: "Chust", lat: 41.0033, lon: 71.2378, aliases: ["chust"] },
  { key: "pap", ru: "Пап", uz: "Pop", en: "Pap", lat: 40.8675, lon: 71.1067, aliases: ["pop", "pap"] },
  { key: "rishtan", ru: "Риштан", uz: "Rishton", en: "Rishtan", lat: 40.3589, lon: 71.2783, aliases: ["rishton", "rishtan"] },
  { key: "kuvasay", ru: "Кувасай", uz: "Quvasoy", en: "Kuvasay", lat: 40.2978, lon: 71.9772, aliases: ["quvasoy", "kuvasay"] },
  { key: "khanabad", ru: "Ханабад", uz: "Xonobod", en: "Khanabad", lat: 40.8019, lon: 72.9683, aliases: ["xonobod", "khanabad", "hanabad"] },
  { key: "khojaobod", ru: "Ходжаабад", uz: "Xojaobod", en: "Khojaobod", lat: 40.6669, lon: 72.5653, aliases: ["xojaobod", "khojaobod", "xoʻjaobod"] },
  { key: "qorasuv", ru: "Карасу", uz: "Qorasuv", en: "Qorasuv", lat: 40.7315, lon: 72.8820, aliases: ["qorasuv", "karasu", "korasu"] },
  { key: "qurgontepa", ru: "Кургантепа", uz: "Qurgontepa", en: "Qurgontepa", lat: 40.7286, lon: 72.7611, aliases: ["qurgontepa", "qoʻrgʻontepa", "kurgantepa", "qorgontepa"] },
  { key: "jalaquduq", ru: "Джалакудук", uz: "Jalaquduq", en: "Jalaquduq", lat: 40.7171, lon: 72.6448, aliases: ["jalaquduq", "jalakuduk"] },
  { key: "dostlik", ru: "Дустлик", uz: "Dostlik", en: "Dostlik", lat: 41.2551, lon: 69.4365, aliases: ["dostlik", "doʻstlik", "dustlik"] },
  { key: "kattakurgan", ru: "Каттакурган", uz: "Kattaqorgon", en: "Kattakurgan", lat: 39.8983, lon: 66.2614, aliases: ["kattaqorgon", "kattaqoʻrgʻon", "kattakurgan", "kattakorgan"] },
  { key: "urgut", ru: "Ургут", uz: "Urgut", en: "Urgut", lat: 39.4108, lon: 67.2475, aliases: ["urgut"] },
  { key: "bulungur", ru: "Булунгур", uz: "Bulungur", en: "Bulungur", lat: 39.7472, lon: 67.2647, aliases: ["bulungur"] },
  { key: "denau", ru: "Денау", uz: "Denov", en: "Denau", lat: 38.2664, lon: 67.8881, aliases: ["denov", "denau", "denov-tumani"] },
  { key: "sariosiyo", ru: "Сариасия", uz: "Sariosiyo", en: "Sariosiyo", lat: 38.4153, lon: 67.9572, aliases: ["sariosiyo", "sariasia"] },
  { key: "shurchi", ru: "Шерабад", uz: "Shorchi", en: "Shurchi", lat: 37.9889, lon: 67.7836, aliases: ["shorchi", "shoʻrchi", "shurchi", "sherabad"] },
  { key: "boysun", ru: "Байсун", uz: "Boysun", en: "Boysun", lat: 38.2042, lon: 67.2017, aliases: ["boysun", "baysun"] },
  { key: "kamashi", ru: "Камаши", uz: "Qamashi", en: "Qamashi", lat: 38.8156, lon: 66.4666, aliases: ["qamashi", "kamashi"] },
  { key: "kitab", ru: "Китаб", uz: "Kitob", en: "Kitab", lat: 39.0786, lon: 66.8483, aliases: ["kitob", "kitab"] },
  { key: "yakkabag", ru: "Яккабаг", uz: "Yakkabog", en: "Yakkabag", lat: 38.9483, lon: 66.6731, aliases: ["yakkabog", "yakkabogʻ", "yakkabag"] },
  { key: "muborak", ru: "Мубарек", uz: "Muborak", en: "Mubarek", lat: 39.2589, lon: 65.1683, aliases: ["muborak", "mubarek"] },
  { key: "kasan", ru: "Касан", uz: "Koson", en: "Kasan", lat: 39.0394, lon: 65.5908, aliases: ["koson", "kasan"] },
  { key: "nurabad", ru: "Нурабад", uz: "Nurobod", en: "Nurabad", lat: 39.6189, lon: 65.6181, aliases: ["nurobod", "nurabad"] },
  { key: "uchkuduk", ru: "Учкудук", uz: "Uchquduq", en: "Uchkuduk", lat: 42.1529, lon: 63.5614, aliases: ["uchquduq", "uchkuduk"] },
  { key: "zarafshan", ru: "Зарафшан", uz: "Zarafshon", en: "Zarafshan", lat: 41.5731, lon: 64.2025, aliases: ["zarafshon", "zarafshan"] },
  { key: "qiziltepa", ru: "Кызылтепа", uz: "Qiziltepa", en: "Qiziltepa", lat: 40.0083, lon: 64.8500, aliases: ["qiziltepa", "kiziltepa", "kyzyltepa"] },
  { key: "gijduvan", ru: "Гиждуван", uz: "Gijduvon", en: "Gijduvan", lat: 40.1014, lon: 64.6803, aliases: ["gijduvon", "gijduvan", "gizhduvan"] },
  { key: "kogon", ru: "Каган", uz: "Kogon", en: "Kogon", lat: 39.7222, lon: 64.5478, aliases: ["kogon", "kagan"] },
  { key: "beruni", ru: "Беруни", uz: "Beruniy", en: "Beruni", lat: 41.6889, lon: 60.7383, aliases: ["beruniy", "beruni"] },
  { key: "qongirot", ru: "Кунград", uz: "Qongirot", en: "Qongirot", lat: 43.0469, lon: 58.8328, aliases: ["qongirot", "qoʻngʻirot", "kungrad", "kungrat"] },
  { key: "chimboy", ru: "Чимбай", uz: "Chimboy", en: "Chimboy", lat: 42.9420, lon: 59.7728, aliases: ["chimboy", "chimbay"] },
  { key: "muynaq", ru: "Муйнак", uz: "Moynoq", en: "Muynaq", lat: 43.7706, lon: 59.0294, aliases: ["moynoq", "muynaq", "muynak"] },
  { key: "khazarasp", ru: "Хазарасп", uz: "Xazorasp", en: "Khazarasp", lat: 41.3217, lon: 61.0719, aliases: ["xazorasp", "khazarasp", "hazarasp"] },
  { key: "shahrihan", ru: "Шахрихан", uz: "Shahrixon", en: "Shahrihan", lat: 40.7136, lon: 72.0586, aliases: ["shahrixon", "shahrihan", "shahrikhan"] },
  { key: "buka", ru: "Бука", uz: "Buka", en: "Buka", lat: 40.8167, lon: 69.2025, aliases: ["buka"] },
  { key: "akkurgan", ru: "Аккурган", uz: "Oqqorgon", en: "Akkurgan", lat: 40.9006, lon: 69.0386, aliases: ["oqqorgon", "oqqoʻrgʻon", "akkurgan", "akkorgon"] },
  { key: "chinaz", ru: "Чиназ", uz: "Chinoz", en: "Chinaz", lat: 40.9300, lon: 68.7611, aliases: ["chinoz", "chinaz"] },
  { key: "iskandar", ru: "Искандар", uz: "Iskandar", en: "Iskandar", lat: 41.5708, lon: 69.7058, aliases: ["iskandar"] },
  { key: "parkent", ru: "Паркент", uz: "Parkent", en: "Parkent", lat: 41.2925, lon: 69.6792, aliases: ["parkent"] },
  { key: "olmazor", ru: "Алмазар", uz: "Olmazor", en: "Olmazor", lat: 41.1900, lon: 69.2367, aliases: ["olmazor", "almazar"] },
  { key: "marhamat", ru: "Мархамат", uz: "Marhamat", en: "Marhamat", lat: 40.4842, lon: 72.3261, aliases: ["marhamat", "markhamat"] },
  { key: "khovos", ru: "Хавас", uz: "Xovos", en: "Khovos", lat: 40.2106, lon: 68.8056, aliases: ["xovos", "khovos", "havas"] },
  { key: "kasansay", ru: "Касансай", uz: "Kosonsoy", en: "Kasansay", lat: 41.2497, lon: 71.5247, aliases: ["kosonsoy", "kasansay"] },
];

// Build fast lookup tables (computed once at module load).
export const CITY_BY_KEY = new Map<string, City>();
export const CITY_BY_ALIAS = new Map<string, City>();

for (const city of CITIES) {
  CITY_BY_KEY.set(city.key, city);
  const slugVariants = new Set<string>([city.key, ...city.aliases]);
  // Also normalize ru/uz/en display names into alias form.
  slugVariants.add(normalizeForLookup(city.ru));
  slugVariants.add(normalizeForLookup(city.uz));
  slugVariants.add(normalizeForLookup(city.en));
  for (const variant of slugVariants) {
    if (variant) CITY_BY_ALIAS.set(variant, city);
  }
}

/** Lowercases, strips apostrophes / ʻ / ' and collapses whitespace into dashes. */
export function normalizeForLookup(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ʻʼ'`'']/g, "")
    .replace(/ё/g, "е")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zа-я0-9-]/gi, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getDisplayName(city: City, locale: string): string {
  if (locale === "ru") return city.ru;
  if (locale === "uz") return city.uz;
  return city.en;
}

export const POPULAR_CITIES: City[] = CITIES.filter((c) => c.popular);
