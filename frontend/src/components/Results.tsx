"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2 } from 'lucide-react';

interface Solution {
  organic_treatment: string;
  chemical_treatment: string;
  preventive_measures: string;
  seasonal_tips: string;
}

interface ResultsProps {
  disease: string;
  confidence: number;
  severity: string;
  solution: Solution;
}

export default function Results({ disease, confidence, severity, solution }: ResultsProps) {
  const { t, i18n } = useTranslation();

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'none': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVoiceOutput = () => {
    const textToRead = `${t('disease')} is ${disease.replace(/_/g, ' ')}. 
      ${t('severity')} is ${severity}. 
      ${t('organic')}: ${solution.organic_treatment}
      ${t('chemical')}: ${solution.chemical_treatment}
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-6">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{disease.replace(/_/g, ' ')}</h2>
          <div className="flex gap-3 mt-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {(confidence * 100).toFixed(0)}% {t('confidence')}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(severity)}`}>
              {severity} {t('severity')}
            </span>
          </div>
        </div>
        <button
          onClick={handleVoiceOutput}
          className="p-3 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
          title={t('voice_output')}
        >
          <Volume2 size={24} />
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">{t('remedy')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">{t('organic')}</h4>
            <p className="text-gray-700 text-sm">{solution.organic_treatment}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">{t('chemical')}</h4>
            <p className="text-gray-700 text-sm">{solution.chemical_treatment}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">{t('preventive')}</h4>
            <p className="text-gray-700 text-sm">{solution.preventive_measures}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">{t('seasonal')}</h4>
            <p className="text-gray-700 text-sm">{solution.seasonal_tips}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
