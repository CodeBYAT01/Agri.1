import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app_title: "AgriHealth - Plant Disease Detector",
      upload_prompt: "Drag & drop an image here, or click to select",
      or: "OR",
      capture_photo: "Capture from Camera",
      cancel_camera: "Cancel Camera",
      capture: "Capture",
      analyzing: "Analyzing with AI...",
      disease: "Disease",
      confidence: "Confidence",
      severity: "Severity",
      remedy: "Suggested Remedy",
      organic: "Organic Treatment",
      chemical: "Chemical Treatment",
      preventive: "Preventive Measures",
      seasonal: "Seasonal Tips",
      voice_output: "Read Aloud",
      offline: "Server is unreachable. Please check your connection.",
      history: "Previous Scans"
    }
  },
  hi: {
    translation: {
      app_title: "एग्रीहेल्थ - पौधे रोग पहचानकर्ता",
      upload_prompt: "यहां एक छवि खींचें और छोड़ें, या चुनने के लिए क्लिक करें",
      or: "या",
      capture_photo: "कैमरे से फोटो लें",
      cancel_camera: "कैमरा रद्द करें",
      capture: "फोटो खींचें",
      analyzing: "एआई के साथ विश्लेषण किया जा रहा है...",
      disease: "बीमारी",
      confidence: "आत्मविश्वास",
      severity: "गंभीरता",
      remedy: "सुझाए गए उपाय",
      organic: "जैविक उपचार",
      chemical: "रासायनिक उपचार",
      preventive: "निवारक उपाय",
      seasonal: "मौसमी सुझाव",
      voice_output: "पढ़कर सुनाएं",
      offline: "सर्वर तक नहीं पहुंचा जा सका। कृपया अपना कनेक्शन जांचें।",
      history: "पिछले स्कैन"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
