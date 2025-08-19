import React, { useRef, useState, useMemo, useEffect } from 'react';
import ReceiptTemplate from './ReceiptTemplate';
import { generateReceiptPDF, generateAllReceiptsZip } from '../utils/receiptHelpers';
import { formatAmount, formatDate, getCardType } from '../utils/csvHelpers';

const ReceiptPreview = ({ transactions }) => {
  const receiptRefs = useRef({});
  const [downloading, setDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [receiptsReady, setReceiptsReady] = useState(false);
  const receiptsPerPage = 10;

  const totalPages = Math.ceil(transactions.length / receiptsPerPage);
  const startIndex = (currentPage - 1) * receiptsPerPage;
  const endIndex = startIndex + receiptsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  // Ensure receipts are ready after render
  useEffect(() => {
    const timer = setTimeout(() => {
      setReceiptsReady(true);
    }, 500); // Increased delay to ensure proper rendering
    return () => clearTimeout(timer);
  }, [transactions]);

  const handleDownloadSingle = async (index) => {
    if (!receiptsReady) {
      alert('Please wait a moment for receipts to load');
      return;
    }

    const actualIndex = startIndex + index;
    const receiptRef = receiptRefs.current[actualIndex];
    
    if (!receiptRef) {
      alert('Receipt not ready. Please try again.');
      return;
    }

    try {
      const filename = `receipt-${actualIndex + 1}-${transactions[actualIndex].RRN}.pdf`;
      const result = await generateReceiptPDF(receiptRef, filename);
      
      if (!result.success) {
        alert(`Failed to download receipt: ${result.error}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  const handleDownloadAll = async () => {
    if (!transactions.length) return;

    if (!receiptsReady) {
      alert('Please wait a moment for receipts to load');
      return;
    }

    setDownloading(true);

    try {
      const receiptElements = [];
      const filenames = [];

      // Generate all receipt templates first
      for (let i = 0; i < transactions.length; i++) {
        const receiptRef = receiptRefs.current[i];
        if (receiptRef) {
          receiptElements.push(receiptRef);
          filenames.push(`receipt-${i + 1}-${transactions[i].RRN}.pdf`);
        }
      }

      if (receiptElements.length === 0) {
        alert('No receipts ready for download. Please try again.');
        return;
      }

      const result = await generateAllReceiptsZip(receiptElements, filenames);
      
      if (!result.success) {
        alert(`Failed to generate zip file: ${result.error}`);
      }
    } catch (error) {
      console.error('Batch download error:', error);
      alert('An error occurred while generating receipts. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const setReceiptRef = (index, ref) => {
    if (ref) {
      receiptRefs.current[index] = ref;
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {pages}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages} ({transactions.length} total receipts)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Receipt Preview
          </h2>
          <p className="text-gray-600">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleDownloadAll}
            disabled={downloading || !transactions.length || !receiptsReady}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download All (ZIP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RRN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTransactions.map((transaction, index) => (
                <tr key={startIndex + index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction['Date of Transaction'])}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {transaction.RRN}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.Tid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getCardType(transaction.MASKEDPAN)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatAmount(transaction.Amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDownloadSingle(index)}
                      disabled={!receiptsReady}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* Hidden Receipt Templates for PDF Generation - All receipts rendered with proper dimensions */}
      <div 
        className="absolute left-[-9999px] top-0 w-[230px]"
        style={{ visibility: 'hidden', position: 'absolute' }}
      >
        {transactions.map((transaction, index) => (
          <div key={index} className="w-[230px] min-h-[400px]">
            <ReceiptTemplate
              transactionData={transaction}
              receiptRef={(ref) => setReceiptRef(index, ref)}
            />
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No transactions to display</p>
        </div>
      )}
    </div>
  );
};

export default ReceiptPreview;
