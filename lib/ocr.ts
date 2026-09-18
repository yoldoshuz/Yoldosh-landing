/**
 * Client-side OCR for vehicle documents.
 *
 * Drivers photograph their licence and registration rather than typing six
 * fields on a phone, so the form is filled from the scan and then corrected by
 * hand. Tesseract's wasm core and language data are several megabytes, so the
 * module is imported lazily — nothing is downloaded until someone actually
 * picks a file.
 */

export interface CarDocumentFields {
  make?: string;
  model?: string;
  year?: number;
  plate_number?: string;
  color?: string;
}

export interface OcrResult extends CarDocumentFields {
  /** Raw recognised text, kept so the UI can show what was read. */
  text: string;
}

/** Makes common on Uzbek plates, longest first so "Chevrolet" wins over "Chev". */
const MAKES = [
  "Chevrolet",
  "Daewoo",
  "Ravon",
  "Hyundai",
  "Toyota",
  "Kia",
  "Nissan",
  "Volkswagen",
  "Mercedes",
  "BMW",
  "Lada",
  "Lexus",
  "Honda",
  "Mitsubishi",
  "Renault",
  "Skoda",
  "Ford",
  "Opel",
  "Byd",
  "Chery",
  "Haval",
  "Changan",
];

const MODELS = [
  "Cobalt",
  "Lacetti",
  "Gentra",
  "Nexia",
  "Matiz",
  "Spark",
  "Damas",
  "Labo",
  "Malibu",
  "Captiva",
  "Tracker",
  "Equinox",
  "Onix",
  "Tahoe",
  "Traverse",
  "Monza",
  "Epica",
  "Tico",
  "Solaris",
  "Elantra",
  "Sonata",
  "Camry",
  "Corolla",
  "Prius",
];

/** Colour words as they appear on Uzbek documents, in all three languages. */
const COLORS: { match: RegExp; value: string }[] = [
  { match: /\b(oq|white|бел\w*)\b/i, value: "Белый" },
  { match: /\b(qora|black|чёрн\w*|черн\w*)\b/i, value: "Чёрный" },
  { match: /\b(kumush\w*|silver|серебр\w*)\b/i, value: "Серебристый" },
  { match: /\b(kulrang|grey|gray|сер\w*)\b/i, value: "Серый" },
  { match: /\b(qizil|red|красн\w*)\b/i, value: "Красный" },
  { match: /\b(ko'k|kok|blue|син\w*|голуб\w*)\b/i, value: "Синий" },
  { match: /\b(yashil|green|зелён\w*|зелен\w*)\b/i, value: "Зелёный" },
  { match: /\b(jigarrang|brown|коричнев\w*)\b/i, value: "Коричневый" },
  { match: /\b(bej|beige|беж\w*)\b/i, value: "Бежевый" },
];

/**
 * Uzbek civil plates: two region digits, a letter, three digits, two letters
 * (`01A123BC`). OCR frequently drops the spaces, so they are optional here and
 * stripped from the result.
 */
const PLATE = /\b(\d{2})\s?([A-Z])\s?(\d{3})\s?([A-Z]{2})\b/;

const findFirst = (text: string, candidates: string[]) => {
  const haystack = text.toLowerCase();
  return candidates.find((candidate) => haystack.includes(candidate.toLowerCase()));
};

/** Pulls the structured fields out of whatever Tesseract managed to read. */
export const parseCarDocument = (text: string): CarDocumentFields => {
  const normalised = text.replace(/[|]/g, "I").replace(/\s+/g, " ");
  const upper = normalised.toUpperCase();

  const plateMatch = upper.match(PLATE);
  const plate_number = plateMatch ? `${plateMatch[1]}${plateMatch[2]}${plateMatch[3]}${plateMatch[4]}` : undefined;

  // Registration years only; anything outside this window is a document number.
  const years = [...normalised.matchAll(/\b(19[89]\d|20[0-4]\d)\b/g)].map((m) => Number(m[1]));
  const thisYear = new Date().getFullYear();
  const year = years.filter((y) => y >= 1980 && y <= thisYear + 1).pop();

  return {
    make: findFirst(normalised, MAKES),
    model: findFirst(normalised, MODELS),
    year,
    plate_number,
    color: COLORS.find(({ match }) => match.test(normalised))?.value,
  };
};

/**
 * Recognises a document photo. `onProgress` receives 0–1 so the UI can show
 * real progress — the first run also downloads the language data, which is
 * slow enough that a bare spinner looks broken.
 */
export const readCarDocument = async (file: File, onProgress?: (ratio: number) => void): Promise<OcrResult> => {
  const { createWorker } = await import("tesseract.js");

  // Latin covers plates, makes and models; Cyrillic covers Russian labels.
  const worker = await createWorker(["eng", "rus"], undefined, {
    logger: ({ status, progress }) => {
      if (status === "recognizing text") onProgress?.(progress);
    },
  });

  try {
    const { data } = await worker.recognize(file);
    return { text: data.text, ...parseCarDocument(data.text) };
  } finally {
    await worker.terminate();
  }
};
