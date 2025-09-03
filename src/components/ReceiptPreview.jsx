import React, { useRef, useState, useMemo, useEffect } from 'react';
import ReceiptTemplate from './ReceiptTemplate';
import MedusaReceiptTemplate from './MedusaReceiptTemplate';
import { generateReceiptPDF, generateAllReceiptsZip } from '../utils/receiptHelpers';
import { formatAmount, formatDate, getCardType } from '../utils/csvHelpers';

const ReceiptPreview = ({ transactions, selectedTemplate }) => {
  const receiptRefs = useRef({});
  const [downloading, setDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [receiptsReady, setReceiptsReady] = useState(false);
  const [previewReceipt, setPreviewReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const receiptsPerPage = 10;

  // Get the appropriate template component
  const getTemplateComponent = () => {
    switch (selectedTemplate) {
      case 'medusa':
        return MedusaReceiptTemplate;
      case 'hydrogen':
      default:
        return ReceiptTemplate;
    }
  };

  const TemplateComponent = getTemplateComponent();

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return transactions;
    
    const term = searchTerm.toLowerCase().trim();
    return transactions.filter(transaction => {
      return (
        (transaction['Customer name'] && transaction['Customer name'].toLowerCase().includes(term)) ||
        (transaction.RRN && transaction.RRN.toLowerCase().includes(term)) ||
        (transaction.Tid && transaction.Tid.toLowerCase().includes(term)) ||
        (transaction['Terminal ID'] && transaction['Terminal ID'].toLowerCase().includes(term)) ||
        (transaction['Card Type'] && transaction['Card Type'].toLowerCase().includes(term)) ||
        (transaction['Issuer Bank'] && transaction['Issuer Bank'].toLowerCase().includes(term)) ||
        (transaction['Amount (in kobo)'] && transaction['Amount (in kobo)'].toString().includes(term)) ||
        (transaction['Amount'] && transaction['Amount'].toString().includes(term)) ||
        (transaction['Date of Transaction'] && transaction['Date of Transaction'].toLowerCase().includes(term)) ||
        (transaction['Date'] && transaction['Date'].toLowerCase().includes(term)) ||
        (transaction.MASKEDPAN && transaction.MASKEDPAN.toLowerCase().includes(term)) ||
        (transaction.PAN && transaction.PAN.toLowerCase().includes(term))
      );
    });
  }, [transactions, searchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredTransactions.length / receiptsPerPage);
  const startIndex = (currentPage - 1) * receiptsPerPage;
  const endIndex = startIndex + receiptsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Ensure receipts are ready after render
  useEffect(() => {
    const timer = setTimeout(() => {
      setReceiptsReady(true);
    }, 500); // Increased delay to ensure proper rendering
    return () => clearTimeout(timer);
  }, [transactions]); // Depends on all transactions, not just current page

  const handleDownloadSingle = async (index) => {
    if (!receiptsReady) return;
    
    const actualIndex = startIndex + index;
    
    setDownloading(true);
    try {
      // Create a temporary receipt element for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '230px';
      tempContainer.style.minHeight = '400px';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '0';
      tempContainer.style.margin = '0';
      document.body.appendChild(tempContainer);

      // Create the receipt template element
      const receiptElement = document.createElement('div');
      receiptElement.style.width = '230px';
      receiptElement.style.minHeight = '400px';
      receiptElement.style.backgroundColor = 'white';
      tempContainer.appendChild(receiptElement);

      // Render the receipt template into the temporary element
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(receiptElement);
      root.render(
        <TemplateComponent
          transactionData={transactions[actualIndex]}
          receiptRef={null}
        />
      );

      // Wait longer for the receipt to fully render including all content
      await new Promise(resolve => setTimeout(resolve, 1000));

      const filename = `receipt-${actualIndex + 1}.pdf`;
      const result = await generateReceiptPDF(receiptElement, filename);
      
      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);
      
      if (!result.success) {
        console.error('PDF generation failed:', result.error);
        alert('Failed to generate PDF. Please try again.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePreviewReceipt = (index) => {
    const actualIndex = startIndex + index;
    setPreviewReceipt(actualIndex);
  };

  const handleClosePreview = () => {
    setPreviewReceipt(null);
  };

  const handleDownloadAll = async () => {
    if (!receiptsReady) return;
    
    setDownloading(true);
    try {
      const receiptElements = [];
      const filenames = [];
      
      // Create temporary receipt elements for each transaction
      for (let i = 0; i < transactions.length; i++) {
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '230px';
        tempContainer.style.minHeight = '400px';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.padding = '0';
        tempContainer.style.margin = '0';
        document.body.appendChild(tempContainer);

        const receiptElement = document.createElement('div');
        receiptElement.style.width = '230px';
        receiptElement.style.minHeight = '400px';
        receiptElement.style.backgroundColor = 'white';
        tempContainer.appendChild(receiptElement);

        // Render the receipt template
        const { createRoot } = await import('react-dom/client');
        const root = createRoot(receiptElement);
        root.render(
          <TemplateComponent
            transactionData={transactions[i]}
            receiptRef={null}
          />
        );

        // Wait longer for rendering to ensure all content is visible
        await new Promise(resolve => setTimeout(resolve, 800));

        receiptElements.push({
          element: receiptElement,
          root: root,
          container: tempContainer
        });
        filenames.push(`receipt-${i + 1}.pdf`);
      }

      if (receiptElements.length === 0) {
        alert('No receipts available for download.');
        return;
      }

      const result = await generateAllReceiptsZip(
        receiptElements.map(item => item.element), 
        filenames
      );
      
      // Clean up all temporary elements
      receiptElements.forEach(item => {
        item.root.unmount();
        document.body.removeChild(item.container);
      });
      
      if (!result.success) {
        console.error('ZIP generation failed:', result.error);
        alert('Failed to generate ZIP file. Please try again.');
      }
    } catch (error) {
      console.error('Download all error:', error);
      alert('Failed to download all receipts. Please try again.');
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
    setCurrentPage(page);
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

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => goToPage(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
        >
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 text-sm font-medium border ${
            i === currentPage
              ? 'bg-gray-900 border-gray-900 text-white'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => goToPage(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
        >
          Next
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-1 mt-4">
        {pages}
      </div>
    );
  };

  // Helper function to get display value based on template
  const getDisplayValue = (transaction, field) => {
    if (selectedTemplate === 'medusa') {
      switch (field) {
        case 'date':
          return transaction['Date'] || formatDate(transaction['Date of Transaction']);
        case 'amount':
          return transaction['Amount'] ? formatAmount(transaction['Amount']) : formatAmount(transaction['Amount (in kobo)']);
        case 'terminalId':
          return transaction['Terminal ID'] || transaction['Tid'];
        case 'pan':
          return transaction['PAN'] || transaction['MASKEDPAN'];
        case 'customer':
          return transaction['Customer name'] || 'N/A';
        default:
          return transaction[field] || 'N/A';
      }
    } else {
      // Hydrogen template
      switch (field) {
        case 'date':
          return formatDate(transaction['Date of Transaction']);
        case 'amount':
          return formatAmount(transaction['Amount (in kobo)']);
        case 'terminalId':
          return transaction['Tid'];
        case 'pan':
          return transaction['MASKEDPAN'];
        case 'customer':
          return transaction['Customer name'] || 'N/A';
        default:
          return transaction[field] || 'N/A';
      }
    }
  };

  return (
    <div className="space-y-6 w-[1200px]">
      {/* Header and Download All Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Receipt Preview ({transactions.length} {transactions.length === 1 ? 'Transaction' : 'Transactions'})
        </h2>
        <button
          onClick={handleDownloadAll}
          disabled={!receiptsReady || downloading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{downloading ? 'Processing...' : 'Download All (ZIP)'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name, RRN, terminal ID, card type, bank, amount, date, or PAN..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden w-[1200px]">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RRN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  'Terminal ID'
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
                    {getDisplayValue(transaction, 'date')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getDisplayValue(transaction, 'customer')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {transaction.RRN}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getDisplayValue(transaction, 'terminalId')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction['Card Type'] || getCardType(null, transaction.MASKEDPAN || transaction.PAN)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getDisplayValue(transaction, 'amount')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreviewReceipt(index)}
                        disabled={!receiptsReady}
                        className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center space-x-1"
                        title="Preview Receipt"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => handleDownloadSingle(index)}
                        disabled={!receiptsReady}
                        className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black px-3 py-1.5 rounded text-sm transition-colors flex items-center space-x-1"
                        title="Download PDF"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>PDF</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* Preview Modal */}
      {previewReceipt !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Receipt Preview #{previewReceipt + 1}
              </h3>
              <button
                onClick={handleClosePreview}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex justify-center">
              <TemplateComponent
                transactionData={transactions[previewReceipt]}
                receiptRef={null}
              />
            </div>
            <div className="flex justify-end p-4 border-t space-x-2">
              <button
                onClick={handleClosePreview}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadSingle(previewReceipt - startIndex);
                  handleClosePreview();
                }}
                disabled={!receiptsReady}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          {searchTerm ? (
            <div>
              <p className="text-gray-500 mb-2">No transactions found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            <p className="text-gray-500">No transactions to display</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiptPreview;
