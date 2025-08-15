import React, { useCallback, useState } from 'react';
import { parseCSV, validateCSVData } from '../utils/csvHelpers';

const CSVUploader = ({ onDataProcessed, onError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileProcess = useCallback(async (file) => {
    if (!file) return;
    
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel'];
    if (!allowedTypes.includes(file.type)) {
      onError('Please upload a valid CSV file');
      return;
    }

    setIsProcessing(true);
    
    try {
      const data = await parseCSV(file);
      const validation = validateCSVData(data);
      
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
  }, [onDataProcessed, onError]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileProcess(files[0]);
    }
  }, [handleFileProcess]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    handleFileProcess(file);
  }, [handleFileProcess]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Upload CSV File
            </h3>
            <p className="text-sm text-gray-500">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>

          <div className="flex justify-center">
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
              <span>Choose File</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p className="mb-2">Required CSV columns:</p>
        <div className="bg-gray-100 rounded p-2 text-left max-w-sm mx-auto">
          <p className="font-mono text-xs">Date of Transaction</p>
          <p className="font-mono text-xs">RRN</p>
          <p className="font-mono text-xs">Amount (in kobo)</p>
          <p className="font-mono text-xs">Tid</p>
          <p className="font-mono text-xs">MASKEDPAN</p>
        </div>
      </div>
    </div>
  );
};

export default CSVUploader;
