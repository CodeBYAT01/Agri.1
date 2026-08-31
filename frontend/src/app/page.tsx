"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Uploader from '@/components/Uploader';
import Results from '@/components/Results';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n'; // Initialize i18n
import { Loader2, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('scanHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (res: any) => {
    const updated = [res, ...history].slice(0, 10); // keep last 10
    setHistory(updated);
    localStorage.setItem('scanHistory', JSON.stringify(updated));
  };

  const handleImageSelected = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload
      const uploadRes = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const taskId = uploadRes.data.task_id;
      
      // 2. Poll for status
      const pollTimer = setInterval(async () => {
        try {
          const statusRes = await axios.get(`${API_BASE_URL}/predict/status/${taskId}`);
          if (statusRes.data.status === 'completed') {
            clearInterval(pollTimer);
            setResult(statusRes.data);
            saveToHistory(statusRes.data);
            setIsLoading(false);
          } else if (statusRes.data.status === 'error') {
            clearInterval(pollTimer);
            setError("Error processing image.");
            setIsLoading(false);
          }
        } catch (e) {
          clearInterval(pollTimer);
          setError(t('offline'));
          setIsLoading(false);
        }
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(t('offline'));
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">{t('app_title')}</h1>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm font-medium"
          >
            {i18n.language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Uploader onImageSelected={handleImageSelected} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-green-600">
            <Loader2 className="animate-spin w-12 h-12" />
            <p className="text-lg font-medium animate-pulse">{t('analyzing')}</p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800">
            <AlertCircle className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {result && !isLoading && (
          <Results 
            disease={result.disease}
            confidence={result.confidence}
            severity={result.severity}
            solution={result.solution}
          />
        )}
        
        {history.length > 0 && !isLoading && !result && (
          <div className="mt-16">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">{t('history')}</h3>
            <div className="space-y-4">
              {history.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50" onClick={() => setResult(item)}>
                  <span className="font-medium text-gray-800">{item.disease.replace(/_/g, ' ')}</span>
                  <span className="text-sm text-gray-500">{(item.confidence * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
