import React from 'react';
import {
  formatAmount,
  getCardType,
  getIssuerBank,
  generateStan,
  generateResponseCode,
  generateResponseMessage
} from '../utils/csvHelpers';
import DividerLine from './DividerLine';

const ReceiptTemplate = ({ transactionData, receiptRef }) => {
  const {
    'Customer name': customerName,
    'Address': address,
    'Date of Transaction': dateOfTransaction,
    'RRN': rrn,
    'Amount (in kobo)': amount,
    'Tid': tid,
    'MASKEDPAN': maskedPan,
    'Card Type': cardType,
    'Payment Type': paymentType,
    'Issuer Bank': issuerBank,
    'STAN': stan,
    'Response Code': responseCode,
    'Message': message,
    'Merchant': merchant
  } = transactionData;

  // Use provided data or fallback to derived/generated values
  const finalCardType = getCardType(cardType, maskedPan);
  const finalIssuerBank = getIssuerBank(issuerBank, maskedPan);
  const finalStan = generateStan(stan);
  const finalResponseCode = generateResponseCode(responseCode);
  const finalResponseMessage = generateResponseMessage(message);
  const finalPaymentType = paymentType || 'Card';
  const finalMerchant = merchant || 'ROLLOW STORE COMPANY';

  // Format date and time from CSV data (dd/mm/yy hh:mm format)
  const formatDateWithTime = (dateTimeString) => {
    if (!dateTimeString) return '';

    // Handle the format "dd/mm/yy hh:mm"
    const parts = dateTimeString.split(' ');
    if (parts.length === 2) {
      const datePart = parts[0]; // "dd/mm/yy"
      const timePart = parts[1]; // "hh:mm"

      // Parse the date part
      const dateComponents = datePart.split('/');
      if (dateComponents.length === 3) {
        const day = dateComponents[0];
        const month = dateComponents[1];
        const year = '20' + dateComponents[2]; // Convert yy to yyyy

        // Parse the time part
        const timeComponents = timePart.split(':');
        if (timeComponents.length === 2) {
          const hours = parseInt(timeComponents[0]);
          const minutes = timeComponents[1];

          // Convert to 12-hour format with AM/PM
          const period = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

          return `${day}-${month}-${year}, ${displayHours.toString().padStart(2, '0')}:${minutes} ${period}`;
        }
      }
    }

    // Fallback: try to parse as a standard date
    const date = new Date(dateTimeString);
    if (!isNaN(date.getTime())) {
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const formattedTime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      return `${formattedDate}, ${formattedTime}`;
    }

    return dateTimeString; // Return as-is if parsing fails
  };

  return (
    <div
      ref={receiptRef}
      className="receipt-container bg-white box-border content-stretch flex flex-col gap-3 items-center justify-start px-5 py-4 relative w-[230px] min-h-[400px]"
    >
      {/* Logo */}
      <div className="h-[45px] overflow-clip relative shrink-0 w-[72px]">
        <div className="absolute h-[44.91px] left-[0.23px] top-0 w-[71.531px]">
          <img
            src="/logo.svg"
            alt="Hydrogen Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Merchant Reprint Label */}
      <div className="font-mail-sans leading-[0] not-italic relative shrink-0 text-grey-2 text-[8px] text-center text-nowrap">
        <p className="block leading-[normal] whitespace-pre">*** MERCHANT REPRINT ***</p>
      </div>

      {/* Main Content */}
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0">
        {/* Business Info */}
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[220px]">
          <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-black text-[8px] text-center">
            <div className="font-mail-sans font-semibold relative shrink-0 w-[220px]">
              <p className="block leading-[normal]">{finalMerchant}</p>
            </div>
            <div className="font-mail-sans relative shrink-0 w-[220px]">
              <p className="block leading-[normal]">{address || 'No 11, Odeku street, bonny, Victoria Island'}</p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <DividerLine />

        {/* Approved Section */}
        <div className="box-border content-stretch flex gap-2.5 items-center justify-start px-0 py-0.5 relative shrink-0 w-[220px]">
          <div className="box-border content-stretch flex gap-2.5 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans font-semibold leading-[0] not-italic relative shrink-0 text-black text-[10px] text-nowrap">
              <p className="block leading-[normal] whitespace-pre">APPROVED</p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <DividerLine />

        {/* Transaction Details */}
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[220px]">
          <DetailRow label="Terminal ID" value={tid} />
          <DetailRow label="Date & Time" value={formatDateWithTime(dateOfTransaction)} />
          {customerName && <DetailRow label="Customer" value={customerName} />}
          <DetailRow label="CARD TYPE" value={finalCardType} />
          <DetailRow label="Payment type" value={finalPaymentType} />
          <DetailRow label="PAN" value={maskedPan} />
          <DetailRow label="ISSUER BANK" value={finalIssuerBank} />
          <DetailRow label="stan" value={finalStan} />
          <DetailRow label="RRN" value={rrn} />
        </div>

        {/* Divider Line */}
        <DividerLine />

        {/* Amount Section */}
        <div className="box-border content-stretch flex flex-col items-start justify-center px-0 py-1 relative shrink-0 w-[220px]">
          <div className="box-border content-stretch flex gap-2.5 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans font-semibold leading-[0] relative shrink-0 text-black text-[10px] text-nowrap">
              <p className="block leading-[normal] whitespace-pre">AMOUNT: {formatAmount(amount)}</p>
            </div>
          </div>
          <div className="box-border content-stretch flex gap-2.5 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans font-semibold leading-[0] not-italic relative shrink-0 text-black text-[10px] text-nowrap">
              <p className="block leading-[normal] whitespace-pre">PURCHASE</p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <DividerLine />

        {/* Response Details */}
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[220px]">
          <DetailRow label="RESPONSE CODE" value={finalResponseCode} />
          <DetailRow label="MESSAGE" value={finalResponseMessage} />
        </div>

        {/* Divider Line */}
        <DividerLine />

        {/* Footer */}
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start pb-0 pt-2 px-0 relative shrink-0 w-[220px]">
          <div className="box-border content-stretch flex gap-6 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans leading-[0] not-italic relative shrink-0 text-black text-[8px] text-nowrap">
              <p className="block leading-[normal] whitespace-pre">POWERED BY HYDROGEN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0">
    <div className="box-border content-stretch flex font-mail-sans gap-6 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-black text-[8px] w-[220px]">
      <div className="relative shrink-0 text-left text-nowrap uppercase">
        <p className="block leading-[normal] whitespace-pre">{label}</p>
      </div>
      <div className="basis-0 grow min-h-px min-w-px relative shrink-0 text-right">
        <p className="block leading-[normal]">{value}</p>
      </div>
    </div>
  </div>
);

export default ReceiptTemplate;
