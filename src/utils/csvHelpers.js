import Papa from 'papaparse';

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('CSV parsing failed'));
          return;
        }
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const validateCSVData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { isValid: false, error: 'No data found in CSV' };
  }

  const requiredFields = ['Date of Transaction', 'RRN', 'Amount', 'Tid', 'MASKEDPAN'];
  const firstRow = data[0];
  
  const missingFields = requiredFields.filter(field => !(field in firstRow));
  
  if (missingFields.length > 0) {
    return { 
      isValid: false, 
      error: `Missing required fields: ${missingFields.join(', ')}` 
    };
  }

  return { isValid: true, error: null };
};

export const formatAmount = (amount) => {
  if (!amount) return '₦0.00';
  
  const numericAmount = parseFloat(amount) / 100; // Convert from kobo to naira
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(numericAmount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getCardType = (maskedPan) => {
  if (!maskedPan) return 'Unknown';
  
  const pan = maskedPan.replace(/\*/g, '');
  
  if (pan.startsWith('4')) return 'Visa';
  if (pan.startsWith('5')) return 'Mastercard';
  if (pan.startsWith('3')) return 'American Express';
  
  return 'Unknown';
};

export const getIssuerBank = (maskedPan) => {
  if (!maskedPan) return 'Unknown';
  
  const pan = maskedPan.replace(/\*/g, '');
  
  // Simple bank detection based on PAN ranges
  if (pan.startsWith('519911')) return 'Access Bank';
  if (pan.startsWith('539983')) return 'GT Bank';
  if (pan.startsWith('468219')) return 'Zenith Bank';
  if (pan.startsWith('516227')) return 'UBA';
  if (pan.startsWith('539941')) return 'GT Bank';
  if (pan.startsWith('524282')) return 'UBA';
  if (pan.startsWith('492069')) return 'Zenith Bank';
  
  return 'Unknown Bank';
};
