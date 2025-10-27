export const translations = {
  en: {
    pageTitle: "Pegboard Configurator",
    widthSliderLabel: "Width",
    heightSliderLabel: "Height",
  },
  de: {
    pageTitle: "Lochplattenkonfigurator",
    widthSliderLabel: "Breite",
    heightSliderLabel: "Höhe",
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

    // Update the page title
    document.title = t.pageTitle;

    // Add more DOM updates here as needed
}

// Set a default language variable if you want to manage it here
let currentLang = 'en';

export function getCurrentLang() {
    return currentLang;
}

export function toggleLang() {
    currentLang = currentLang === 'en' ? 'de' : 'en';
    return currentLang;
}