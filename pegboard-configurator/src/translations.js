export const translations = {
  en: {
    pageTitle: "Pegboard Configurator",
    header: "Pegboard Configurator",
    widthSliderLabel: "Width",
    heightSliderLabel: "Height",
    downloadButton: "Download SVG",
  },
  de: {
    pageTitle: "Lochplattenkonfigurator",
    header: "Lochplattenkonfigurator",
    widthSliderLabel: "Breite",
    heightSliderLabel: "Höhe",
    downloadButton: "SVG herunterladen",
  },
};

// A function to get a specific translation key for a language
export function getTranslation(key, lang) {
  // Simple check to ensure the key and language exist
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  // Default to English or return the key itself if not found
  return translations['en'][key] || key;
}

// A function to apply all necessary translations to the page
export function applyTranslations(lang) {
    const t = translations[lang];

    // Update the slider labels
    const widthLabel = document.getElementById('widthSliderLabel');
    if (widthLabel) widthLabel.textContent = t.widthSliderLabel;

    const heightLabel = document.getElementById('heightSliderLabel'); // Assuming this is the Height label
    if (heightLabel) heightLabel.textContent = t.heightSliderLabel;

    const header = document.getElementById("header");
    if (header) header.textContent = t.header;

    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) downloadButton.textContent = t.downloadButton;

    // Update the page title
    document.title = t.pageTitle;

    // Add more DOM updates here as needed
}

// Set a default language variable if you want to manage it here
let currentLang = 'en';

export function getCurrentLang() {
    return currentLang;
}