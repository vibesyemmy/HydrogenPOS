import React, { useCallback, useState } from 'react';
import { parseCSV, validateCSVData } from '../utils/csvHelpers';
import { getTemplateOptions, getTemplateConfig } from '../utils/templateConfig';

const CSVUploader = ({ onDataProcessed, onError, selectedTemplate }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const templateOptions = getTemplateOptions();
  const currentTemplate = getTemplateConfig(selectedTemplate);

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await parseCSV(file);
      const validation = validateCSVData(data, selectedTemplate);
      
      if (!validation.isValid) {
        onError(validation.error);
        return;
      }

      onDataProcessed(data);
    } catch (error) {
      onError('Failed to process CSV file. Please check the file format.');
    } finally {
      setIsProcessing(false);
    }
  }, [onDataProcessed, onError, selectedTemplate]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      handleFile(file);
    } else {
      onError('Please upload a valid CSV file.');
    }
  }, [handleFile, onError]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <div className="w-full">
      {/* File Upload */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        className="hidden"
        id="csv-upload"
        disabled={isProcessing}
      />
      <label
        htmlFor="csv-upload"
        className={`block border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
          isDragOver 
            ? 'border-[#00B2A9] bg-[#00B2A9]/10' 
            : 'border-gray-300 hover:border-gray-400'
        } ${
          isProcessing ? 'cursor-not-allowed' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-[#00B2A9]/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#00B2A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          
          <div>
            <p className="text-base font-medium text-gray-900 font-mail-sans">
              {isProcessing ? 'Processing CSV...' : 'Click here to upload files or drag and drop'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              CSV files only
            </p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default CSVUploader;
