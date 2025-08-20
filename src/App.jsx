import React, { useState } from 'react';
import CSVUploader from './components/CSVUploader';
import ReceiptPreview from './components/ReceiptPreview';

const App = () => {
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

  const handleTemplateChange = (templateKey) => {
    setSelectedTemplate(templateKey);
    // Reset when template changes
    setTransactions([]);
    setError(null);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.svg"
                alt="Hydrogen Logo"
                className="w-8 h-8"
              />
              <h1 className="text-xl font-bold text-gray-900">
                Hydrogen POS Receipt Generator
              </h1>
            </div>

            {showPreview && (
              <button
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Upload New File
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!showPreview ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Generate POS Receipts
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select a receipt template and upload your CSV file containing transaction data to generate professional POS receipts.
                Each transaction will be converted into a downloadable PDF receipt.
              </p>
            </div>

            <CSVUploader
              onDataProcessed={handleDataProcessed}
              onError={handleError}
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
            />

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How it works
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Select Template</h4>
                  <p className="text-sm text-gray-600">
                    Choose between Hydrogen or Medusa receipt templates
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Upload CSV</h4>
                  <p className="text-sm text-gray-600">
                    Drag and drop your CSV file or click to browse
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Preview & Download</h4>
                  <p className="text-sm text-gray-600">
                    Review all generated receipts in a paginated table and download
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ReceiptPreview
            transactions={transactions}
            selectedTemplate={selectedTemplate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Powered by Hydrogen POS • Built for your team</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
