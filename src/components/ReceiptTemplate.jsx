import React from 'react';
import { 
  formatAmount, 
  formatDate, 
  getCardType, 
  getIssuerBank 
} from '../utils/csvHelpers';
import { 
  generateStan, 
  generateResponseCode, 
  generateResponseMessage 
} from '../utils/receiptHelpers';

const ReceiptTemplate = ({ transactionData, receiptRef }) => {
  const {
    'Date of Transaction': dateOfTransaction,
    'RRN': rrn,
    'Amount': amount,
    'Tid': tid,
    'MASKEDPAN': maskedPan
  } = transactionData;

  const cardType = getCardType(maskedPan);
  const issuerBank = getIssuerBank(maskedPan);
  const stan = generateStan();
  const responseCode = generateResponseCode();
  const responseMessage = generateResponseMessage();

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

      {/* Customer Copy Label */}
      <div className="font-mail-sans leading-[0] not-italic relative shrink-0 text-grey-2 text-[8px] text-center text-nowrap">
        <p className="block leading-[normal] whitespace-pre">*** CUSTOMER COPY ***</p>
      </div>

      {/* Main Content */}
      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0">
        {/* Business Info */}
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[220px]">
          <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-black text-[8px] text-center">
            <div className="font-mail-sans font-semibold relative shrink-0 w-[220px]">
              <p className="block leading-[normal]">ROLLOW STORE COMPANY</p>
            </div>
            <div className="font-mail-sans relative shrink-0 w-[220px]">
              <p className="block leading-[normal]">No 11, Odeku street, bonny, Victoria Island</p>
            </div>
          </div>
        </div>

        {/* Approved Section */}
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-0 py-1 relative shrink-0 w-[220px]">
          <div className="absolute border-grey-2 border-[1px_0px] border-dashed inset-0 pointer-events-none" />
          <div className="box-border content-stretch flex flex-row gap-2.5 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans font-semibold leading-[0] not-italic relative shrink-0 text-black text-[10px] text-left text-nowrap">
              <p className="block leading-[normal] whitespace-pre">APPROVED</p>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[220px]">
          <DetailRow label="Transaction ID" value={tid} />
          <DetailRow label="Date & Time" value={`${formatDate(dateOfTransaction)}, 05:23 PM`} />
          <DetailRow label="CARD TYPE" value={cardType} />
          <DetailRow label="Payment type" value="Card" />
          <DetailRow label="PAN" value={maskedPan} />
          <DetailRow label="ISSUER BANK" value={issuerBank} />
          <DetailRow label="stan" value={stan} />
          <DetailRow label="RRN" value={rrn} />
        </div>

        {/* Amount Section */}
        <div className="box-border content-stretch flex flex-col items-start justify-center px-0 py-1 relative shrink-0 w-[220px]">
          <div className="absolute border-grey-2 border-[1px_0px] border-dashed inset-0 pointer-events-none" />
          <div className="box-border content-stretch flex flex-row gap-2.5 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans font-semibold leading-[0] relative shrink-0 text-black text-[10px] text-left text-nowrap">
              <p className="block leading-[normal] whitespace-pre">AMOUNT: {formatAmount(amount)}</p>
            </div>
          </div>
          <div className="box-border content-stretch flex flex-row gap-2.5 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans font-semibold leading-[0] not-italic relative shrink-0 text-black text-[10px] text-left text-nowrap">
              <p className="block leading-[normal] whitespace-pre">PURCHASE</p>
            </div>
          </div>
        </div>

        {/* Response Details */}
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[220px]">
          <DetailRow label="RESPONSE CODE" value={responseCode} />
          <DetailRow label="MESSAGE" value={responseMessage} />
        </div>

        {/* Footer */}
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start pb-0 pt-2 px-0 relative shrink-0 w-[220px]">
          <div className="absolute border-grey-2 border-[1px_0px_0px] border-dashed bottom-0 left-0 pointer-events-none right-0 top-[-1px]" />
          <div className="box-border content-stretch flex flex-row gap-6 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans leading-[0] not-italic relative shrink-0 text-black text-[8px] text-left text-nowrap">
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
    <div className="box-border content-stretch flex flex-row font-mail-sans gap-6 items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-black text-[8px] w-[220px]">
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
