// All site content lives in src/content/*.json and is edited through /admin (Decap CMS).
const workFiles = import.meta.glob("../content/works/*.json", { eager: true, import: "default" });
const seriesFiles = import.meta.glob("../content/series/*.json", { eager: true, import: "default" });
const pageFiles = import.meta.glob("../content/pages/*.json", { eager: true, import: "default" });

const slugOf = (path) => path.split("/").pop().replace(/\.json$/, "");

export const LANGS = ["en", "ru"];

export const works = Object.fromEntries(
  Object.entries(workFiles)
    .map(([p, w]) => [slugOf(p), { ...w, slug: slugOf(p) }])
    .filter(([, w]) => w.published !== false),
);

export const series = Object.entries(seriesFiles)
  .map(([p, s]) => ({
    ...s,
    id: slugOf(p),
    // keep the order Alisa set in the admin, skip removed or hidden works
    works: (s.works || []).filter((id) => works[id]),
  }))
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export const page = (name) => pageFiles[`../content/pages/${name}.json`] || {};

export const seriesOf = (slug) => series.find((s) => s.works.includes(slug));
// Image paths pasted from the GitHub website (…/blob/main/public/img/x.jpg) point to an HTML page,
// not to the file; turn them back into site paths so the photo still shows.
export const imgSrc = (src) => {
  const m = String(src || "").match(/^https:\/\/github\.com\/[^/]+\/[^/]+\/(?:blob|raw)\/[^/]+\/public(\/.+)$/);
  return m ? m[1] : src || "";
};
// Photos for the work page: the photo list, or the grid preview when the list is empty.
export const photosOf = (w) => {
  const list = (w.images || []).filter((im) => im && im.src).map((im) => ({ ...im, src: imgSrc(im.src) }));
  return list.length ? list : w.thumb ? [{ src: imgSrc(w.thumb), caption_en: "", caption_ru: "" }] : [];
};
export const hasImages = (w) => photosOf(w).length > 0;

// Works in site order (series order, then order inside a series).
export const orderedWorks = () => series.flatMap((s) => s.works.map((id) => works[id]));

// Text fields come in _en/_ru pairs; Russian falls back to English until translated.
export const pick = (obj, field, lang) =>
  (lang === "ru" && obj?.[`${field}_ru`]) || obj?.[`${field}_en`] || "";

export const paragraphs = (text) =>
  String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export const STATUS = {
  en: { Available: "Available", Reserved: "Reserved", Sold: "Sold", "Not for sale": "Not for sale" },
  ru: { Available: "Доступна", Reserved: "Зарезервирована", Sold: "Продана", "Not for sale": "Не продаётся" },
};

export const T = {
  en: {
    works: "Works", process: "Process", about: "About", cv: "CV", contact: "Contact",
    series: "Series", aboutSeries: "About the series", photoSoon: "Photo coming",
    year: "Year", medium: "Medium", size: "Dimensions", after: "After", status: "Status", cm: "cm",
    description: "Description", req: "Request price", reqText: (email) => `Write to ${email} with the title of the work.`,
    prev: "← Previous", next: "Next →", backTo: "All works",
    cvH: ["Profile", "Selected works", "Practice / methods", "Professional background"],
    portfolio: "Portfolio (PDF)", email: "Email", insta: "Instagram", notTranslated: "",
  },
  ru: {
    works: "Работы", process: "Процесс", about: "О практике", cv: "CV", contact: "Контакты",
    series: "Серия", aboutSeries: "О серии", photoSoon: "Фото появится",
    year: "Год", medium: "Техника", size: "Размер", after: "По мотивам", status: "Статус", cm: "см",
    description: "Описание", req: "Узнать цену", reqText: (email) => `Напишите на ${email}, указав название работы.`,
    prev: "← Предыдущая", next: "Следующая →", backTo: "Все работы",
    cvH: ["Профиль", "Избранные работы", "Практика / методы", "Профессиональный опыт"],
    portfolio: "Портфолио (PDF)", email: "Почта", insta: "Instagram", notTranslated: "Русская версия текста появится позже.",
  },
};

// URL helpers: English lives at the root, Russian under /ru.
export const href = (lang, path = "/") => (lang === "ru" ? `/ru${path === "/" ? "" : path}` || "/ru" : path);
export const langPaths = () => [{ params: { lang: undefined } }, { params: { lang: "ru" } }];
export const langOf = (param) => (param === "ru" ? "ru" : "en");
