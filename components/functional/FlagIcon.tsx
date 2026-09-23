/**
 * Inline flags for the language picker.
 *
 * Emoji flags were the obvious choice and the wrong one: Windows ships no
 * glyphs for regional-indicator pairs, so `🇷🇺` renders as the letters "RU",
 * which is exactly what showed up in the app. These are tiny hand-rolled SVGs —
 * no font dependency, no icon-set download, crisp at any size.
 */
export type FlagCode = "ru" | "uz" | "en";

const FLAGS: Record<FlagCode, React.ReactNode> = {
  ru: (
    <>
      <rect width="24" height="6" y="0" fill="#fff" />
      <rect width="24" height="6" y="6" fill="#0039A6" />
      <rect width="24" height="6" y="12" fill="#D52B1E" />
    </>
  ),
  uz: (
    <>
      <rect width="24" height="5.4" y="0" fill="#0099B5" />
      <rect width="24" height="1" y="5.4" fill="#CE1126" />
      <rect width="24" height="5.2" y="6.4" fill="#fff" />
      <rect width="24" height="1" y="11.6" fill="#CE1126" />
      <rect width="24" height="5.4" y="12.6" fill="#1EB53A" />
      <circle cx="5" cy="2.8" r="1.9" fill="#fff" />
      <circle cx="5.9" cy="2.5" r="1.9" fill="#0099B5" />
    </>
  ),
  en: (
    <>
      <rect width="24" height="18" fill="#012169" />
      <path d="M0 0l24 18M24 0L0 18" stroke="#fff" strokeWidth="3.6" />
      <path d="M0 0l24 18M24 0L0 18" stroke="#C8102E" strokeWidth="2.2" />
      <path d="M12 0v18M0 9h24" stroke="#fff" strokeWidth="6" />
      <path d="M12 0v18M0 9h24" stroke="#C8102E" strokeWidth="3.6" />
    </>
  ),
};

export const FlagIcon = ({ code, className }: { code: FlagCode; className?: string }) => (
  <svg
    viewBox="0 0 24 18"
    aria-hidden="true"
    focusable="false"
    className={className}
    // The clip keeps the Union Jack's diagonals inside the rounded rectangle.
    style={{ borderRadius: 3, overflow: "hidden", flexShrink: 0 }}
  >
    {FLAGS[code]}
  </svg>
);
