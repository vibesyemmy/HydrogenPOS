import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CSVUploader from './CSVUploader';
import ReceiptPreview from './ReceiptPreview';

const POSGenerator = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('hydrogen');

  const handleDataProcessed = (data) => {
    setTransactions(data);
    setError(null);
    setShowPreview(true);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setShowPreview(false);
  };

  const handleReset = () => {
    setTransactions([]);
    setError(null);
    setShowPreview(false);
  };

  const handleDownloadTemplate = () => {
    const templateFile = selectedTemplate === 'medusa' 
      ? '/medusa_template.csv' 
      : '/hydrogen_template.csv';
    
    const link = document.createElement('a');
    link.href = templateFile;
    link.download = templateFile.substring(1); // Remove leading slash
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTemplateChange = (templateKey) => {
    setSelectedTemplate(templateKey);
    // Reset when template changes
    setTransactions([]);
    setError(null);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F9FAFB'}}>
      {/* Modal-style container */}
      <div className="flex items-start justify-center min-h-screen p-4 pt-8">
        <div className={`bg-white rounded-lg shadow-lg w-full ${showPreview ? 'max-w-[1248px]' : 'max-w-2xl'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src="/HYD_logo_light.svg"
                alt="Hydrogen Logo"
                className="h-8 w-auto"
              />
            </div>
            <button
              onClick={() => showPreview ? handleReset() : navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showPreview ? 'Upload New File' : 'Cancel'}
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {!showPreview ? (
              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 font-mail-sans">
                    Select Receipt Template
                  </h3>
                  <div className="space-y-3">
                    {/* Hydrogen Standard Option */}
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate === 'hydrogen' 
                          ? 'border-green-400' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      style={{
                        backgroundColor: selectedTemplate === 'hydrogen' ? '#D1FADF' : 'white'
                      }}
                      onClick={() => handleTemplateChange('hydrogen')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 font-mail-sans">
                            Hydrogen Standard
                          </h4>
                          <p className="text-sm text-gray-500">
                            Standard Hydrogen POS receipt template
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedTemplate === 'hydrogen'
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {selectedTemplate === 'hydrogen' && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Medusa Option */}
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate === 'medusa' 
                          ? 'border-green-400' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      style={{
                        backgroundColor: selectedTemplate === 'medusa' ? '#D1FADF' : 'white'
                      }}
                      onClick={() => handleTemplateChange('medusa')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 font-mail-sans">
                            Medusa
                          </h4>
                          <p className="text-sm text-gray-500">
                            Medusa POS receipt template
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedTemplate === 'medusa'
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {selectedTemplate === 'medusa' && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload CSV Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900 font-mail-sans">
                      Upload CSV File
                    </h3>
                    <button 
                      onClick={handleDownloadTemplate}
                      className="flex items-center space-x-2 text-sm text-[#00B2A9] hover:text-[#00B2A9]/80 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download sample file here</span>
                    </button>
                  </div>
                  
                  <CSVUploader 
                    onDataProcessed={handleDataProcessed}
                    onError={handleError}
                    selectedTemplate={selectedTemplate}
                  />
                  
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Error processing file
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <ReceiptPreview 
                transactions={transactions} 
                selectedTemplate={selectedTemplate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSGenerator;