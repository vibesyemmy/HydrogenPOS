export const RECEIPT_TEMPLATES = {
  hydrogen: {
    name: 'Hydrogen',
    description: 'Standard Hydrogen POS receipt template',
    requiredFields: [
      'Customer name',
      'Address',
      'Date of Transaction',
      'RRN',
      'Amount (in kobo)',
      'Tid',
      'MASKEDPAN',
      'Card Type',
      'Payment Type',
      'Issuer Bank',
      'STAN',
      'Response Code',
      'Message',
      'Merchant'
    ],
    sampleData: {
      'Customer name': 'John Doe',
      'Address': '123 Main Street Lagos',
      'Date of Transaction': '12/7/24',
      'RRN': '100000000000',
      'Amount (in kobo)': '10000',
      'Tid': '2044ZSRO',
      'MASKEDPAN': '468219******5436',
      'Card Type': 'Visa',
      'Payment Type': 'Card',
      'Issuer Bank': 'Zenith Bank',
      'STAN': '0123456789',
      'Response Code': '00',
      'Message': 'Transaction successful',
      'Merchant': 'ROLLOW STORE COMPANY'
    }
  },
  medusa: {
    name: 'Medusa',
    description: 'Medusa POS receipt template',
    requiredFields: [
      'Merchant',
      'Amount',
      'Date',
      'Terminal ID',
      'PAN',
      'Customer name',
      'Expiry Date',
      'PIN Verified',
      'RRN',
      'STAN',
      'Response Code'
    ],
    sampleData: {
      'Merchant': 'ROLLOW STORE COMPANY',
      'Amount': '74000',
      'Date': '01/May/2024, 05:23 PM',
      'Terminal ID': '2044Y5PE',
      'PAN': '539983******5910',
      'Customer name': 'Oluwabukunfunmi Josiah',
      'Expiry Date': '27/08',
      'PIN Verified': 'Online',
      'RRN': '167560769532',
      'STAN': '0129475012',
      'Response Code': '00'
    }
  }
};

export const getTemplateConfig = (templateKey) => {
  return RECEIPT_TEMPLATES[templateKey] || RECEIPT_TEMPLATES.hydrogen;
};

export const getTemplateOptions = () => {
  return Object.entries(RECEIPT_TEMPLATES).map(([key, config]) => ({
    value: key,
    label: config.name,
    description: config.description
  }));
};
