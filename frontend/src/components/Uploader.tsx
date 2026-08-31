"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import imageCompression from 'browser-image-compression';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, X } from 'lucide-react';

interface UploaderProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

export default function Uploader({ onImageSelected, isLoading }: UploaderProps) {
  const { t } = useTranslation();
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const processFile = async (file: File) => {
    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      onImageSelected(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isLoading
  });

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Convert base64 to File
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
          processFile(file);
          setShowCamera(false);
        });
    }
  }, [webcamRef]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {showCamera ? (
        <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="w-full rounded-lg mb-4"
          />
          <div className="flex gap-4">
            <button
              onClick={capture}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Camera size={20} />
              {t('capture')}
            </button>
            <button
              onClick={() => setShowCamera(false)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              <X size={20} />
              {t('cancel_camera')}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div
            {...getRootProps()}
            className={`w-full p-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors text-center bg-white
              ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">{t('upload_prompt')}</p>
          </div>
          
          <div className="flex items-center w-full gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 font-medium">{t('or')}</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button
            onClick={() => setShowCamera(true)}
            disabled={isLoading}
            className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Camera size={20} className="text-gray-500" />
            {t('capture_photo')}
          </button>
        </div>
      )}
    </div>
  );
}
