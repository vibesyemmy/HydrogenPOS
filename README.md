# Hydrogen POS Receipt Generator

A modern React application for generating professional POS receipts from CSV transaction data. Built with clean, maintainable code following anti-nesting principles.

## Features

- **CSV Upload**: Drag and drop or browse to upload CSV files
- **Receipt Generation**: Convert transaction data into professional POS receipts
- **PDF Download**: Download individual receipts as PDF files
- **Batch Download**: Download all receipts as a ZIP file
- **Real-time Preview**: Preview all receipts before downloading
- **Responsive Design**: Works on desktop and mobile devices
- **Clean Code**: Built with anti-nesting principles for maintainability

## CSV Format

The application expects CSV files with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| Date of Transaction | Transaction date | 12/7/24 |
| RRN | Retrieval Reference Number | 1.71992E+11 |
| Amount | Transaction amount (in kobo) | 10000 |
| Tid | Terminal ID | 2044ZSRO |
| MASKEDPAN | Masked card number | 468219******5436 |

## Technology Stack

- **React 18+** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Papa Parse** - CSV parsing library
- **jsPDF** - PDF generation
- **html2canvas** - HTML to canvas conversion
- **JSZip** - ZIP file generation
- **File Saver** - File download handling

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hydrogen-pos
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to Vercel or any static hosting service.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting service

## Project Structure

```
src/
├── components/
│   ├── CSVUploader.jsx      # CSV file upload component
│   ├── ReceiptPreview.jsx   # Receipt preview and download
│   └── ReceiptTemplate.jsx  # Receipt template component
├── utils/
│   ├── csvHelpers.js        # CSV processing utilities
│   └── receiptHelpers.js    # PDF generation utilities
├── App.jsx                  # Main application component
├── main.jsx                 # React entry point
└── index.css               # Global styles
```

## Code Quality

This project follows strict anti-nesting principles:

- **Maximum 2 levels of nesting** in any function
- **Early returns** for validation and error handling
- **Extracted functions** for complex logic
- **Array methods** instead of nested loops
- **Optional chaining** for safe property access
- **Strategy patterns** for complex conditionals

## Customization

### Receipt Template

The receipt template is based on the Figma design and can be customized in `src/components/ReceiptTemplate.jsx`.

### Business Information

Update the business details in the receipt template:
- Company name
- Address
- Logo (currently using a placeholder)

### Styling

The application uses Tailwind CSS. Customize colors and styling in `tailwind.config.js`.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the anti-nesting principles
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.

---

**Built with ❤️ by the Hydrogen POS Team**
