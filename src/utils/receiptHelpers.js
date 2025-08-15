import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const generateReceiptPDF = async (receiptElement, filename) => {
  if (!receiptElement) {
    return { success: false, error: 'Receipt element not found' };
  }

  try {
    // Wait a bit to ensure the element is fully rendered
    await new Promise(resolve => setTimeout(resolve, 200));

    // Temporarily make the element visible for capture
    const originalStyle = receiptElement.style.cssText;
    receiptElement.style.position = 'absolute';
    receiptElement.style.left = '0px';
    receiptElement.style.top = '0px';
    receiptElement.style.visibility = 'visible';
    receiptElement.style.zIndex = '9999';

    const canvas = await html2canvas(receiptElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 190,
      height: 400,
      scrollX: 0,
      scrollY: 0
    });

    // Restore original style
    receiptElement.style.cssText = originalStyle;

    const imgData = canvas.toDataURL('image/png');
    
    // Validate the image data
    if (!imgData || imgData === 'data:,') {
      throw new Error('Failed to generate image data');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200] // Receipt size
    });

    const imgWidth = 80;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message || 'Failed to generate PDF' };
  }
};

export const generateAllReceiptsZip = async (receiptElements, filenames) => {
  if (!receiptElements || receiptElements.length === 0) {
    return { success: false, error: 'No receipt elements provided' };
  }

  try {
    const zip = new JSZip();
    const pdfPromises = [];

    receiptElements.forEach((element, index) => {
      const filename = filenames[index];
      const pdfPromise = generateReceiptPDFBlob(element, filename);
      pdfPromises.push(pdfPromise);
    });

    const pdfBlobs = await Promise.all(pdfPromises);
    let successCount = 0;
    
    pdfBlobs.forEach((blob, index) => {
      if (blob.success) {
        zip.file(filenames[index], blob.data);
        successCount++;
      }
    });

    if (successCount === 0) {
      return { success: false, error: 'No receipts could be generated' };
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'hydrogen-pos-receipts.zip');
    
    return { success: true, error: null };
  } catch (error) {
    console.error('ZIP generation error:', error);
    return { success: false, error: error.message || 'Failed to generate ZIP file' };
  }
};

const generateReceiptPDFBlob = async (receiptElement, filename) => {
  if (!receiptElement) {
    return { 
      success: false, 
      data: null,
      error: 'Receipt element not found' 
    };
  }

  try {
    // Wait a bit to ensure the element is fully rendered
    await new Promise(resolve => setTimeout(resolve, 200));

    // Temporarily make the element visible for capture
    const originalStyle = receiptElement.style.cssText;
    receiptElement.style.position = 'absolute';
    receiptElement.style.left = '0px';
    receiptElement.style.top = '0px';
    receiptElement.style.visibility = 'visible';
    receiptElement.style.zIndex = '9999';

    const canvas = await html2canvas(receiptElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 190,
      height: 400,
      scrollX: 0,
      scrollY: 0
    });

    // Restore original style
    receiptElement.style.cssText = originalStyle;

    const imgData = canvas.toDataURL('image/png');
    
    // Validate the image data
    if (!imgData || imgData === 'data:,') {
      throw new Error('Failed to generate image data');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200]
    });

    const imgWidth = 80;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    return { 
      success: true, 
      data: pdf.output('blob'),
      error: null 
    };
  } catch (error) {
    console.error('PDF blob generation error:', error);
    return { 
      success: false, 
      data: null,
      error: error.message || 'Failed to generate PDF blob' 
    };
  }
};

export const generateStan = () => {
  return Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
};

export const generateResponseCode = () => {
  return '00'; // Success code
};

export const generateResponseMessage = () => {
  return 'Transaction successful';
};
