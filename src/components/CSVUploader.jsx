import React, { useCallback, useState } from 'react';
import { parseCSV, validateCSVData } from '../utils/csvHelpers';
import { getTemplateOptions, getTemplateConfig } from '../utils/templateConfig';

const CSVUploader = ({ onDataProcessed, onError, selectedTemplate, onTemplateChange }) => {
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
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Template Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Receipt Template</h3>
        <div className="space-y-3">
          {templateOptions.map((option) => (
            <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="template"
                value={option.value}
                checked={selectedTemplate === option.value}
                onChange={(e) => onTemplateChange(e.target.value)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isProcessing ? 'Processing CSV...' : 'Upload CSV File'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>

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
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? 'Processing...' : 'Choose File'}
          </label>
        </div>
      </div>

      {/* Required Fields */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Required CSV Columns for {currentTemplate.name}
        </h3>
        <div className="bg-gray-100 rounded p-3 space-y-1">
          {currentTemplate.requiredFields.map((field, index) => (
            <p key={index} className="font-mono text-xs text-gray-700">
              {field}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CSVUploader;
