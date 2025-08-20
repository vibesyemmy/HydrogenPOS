import React from 'react';
import { formatAmount } from '../utils/csvHelpers';
import DividerLine from './DividerLine';

const MedusaReceiptTemplate = ({ transactionData, receiptRef }) => {
  const {
    'Merchant': merchant,
    'Amount': amount,
    'Date': date,
    'Terminal ID': terminalId,
    'PAN': pan,
    'Customer name': customerName,
    'Expiry Date': expiryDate,
    'PIN Verified': pinVerified,
    'RRN': rrn,
    'STAN': stan,
    'Response Code': responseCode
  } = transactionData;

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
      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0">
        {/* Business Info */}
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[220px]">
          <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0">
            <div className="font-mail-sans font-semibold leading-[0] not-italic relative shrink-0 text-black text-[8px] text-center w-[220px]">
              <p className="block leading-[normal]">{merchant || 'ROLLOW STORE COMPANY'}</p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <DividerLine />

        {/* Amount Section */}
        <div className="box-border content-stretch flex flex-col items-start justify-center px-0 py-1 relative shrink-0 w-[220px]">
          <div className="box-border content-stretch flex gap-2.5 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans font-semibold leading-[0] not-italic relative shrink-0 text-black text-[10px] text-nowrap">
              <p className="block leading-[normal] whitespace-pre">PURCHASE</p>
            </div>
          </div>
          <div className="box-border content-stretch flex gap-2.5 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans font-semibold leading-[0] relative shrink-0 text-black text-[10px] text-nowrap">
              <p className="block leading-[normal] whitespace-pre">{formatAmount(amount)}</p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <DividerLine />

        {/* Approval and Date Section */}
        <div className="box-border content-stretch flex flex-col gap-0.5 items-center justify-center px-0 py-1 relative shrink-0 w-[220px]">
          <div className="box-border content-stretch flex gap-2.5 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="font-mail-sans font-semibold leading-[0] not-italic relative shrink-0 text-black text-[10px] text-nowrap">
              <p className="block leading-[normal] whitespace-pre">*** Approved ***</p>
            </div>
          </div>
          <div className="font-mail-sans leading-[0] min-w-full not-italic relative shrink-0 text-black text-[8px] text-center">
            <p className="block leading-[normal]">{date || '01/May/2024, 05:23 PM'}</p>
          </div>
        </div>

        {/* Divider Line */}
        <DividerLine />

        {/* Transaction Details */}
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[220px]">
          <DetailRow label="Terminal ID:" value={terminalId} />
          <DetailRow label="PAN:" value={pan} />
          <DetailRow label="NAME:" value={customerName} />
          <DetailRow label="Expiry Date:" value={expiryDate} />
          <DetailRow label="PIN Verified" value={pinVerified} />
          
          {/* Divider Line */}
          <DividerLine />
          
          <DetailRow label="RRN" value={rrn} />
          <DetailRow label="stan" value={stan} />
          <DetailRow label="RESPONSE CODE" value={responseCode} />
          
          {/* Divider Line */}
          <DividerLine />
        </div>

        {/* Footer */}
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-[220px]">
          <div className="box-border content-stretch flex gap-6 items-start justify-center p-0 relative shrink-0 w-[220px]">
            <div className="basis-0 font-mail-sans grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-black text-[8px] text-center">
              <p className="block leading-[normal]">
                *** MEDUSA: 1.21-hdg
                <br aria-hidden="true" className />
                Thank you for using our services
                <br aria-hidden="true" className />
                SN: C39P008D00405572 ***
              </p>
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
      <div className="relative shrink-0 text-nowrap uppercase">
        <p className="block leading-[normal] whitespace-pre">{label}</p>
      </div>
      <div className="basis-0 grow min-h-px min-w-px relative shrink-0 text-right">
        <p className="block leading-[normal]">{value}</p>
      </div>
    </div>
  </div>
);

export default MedusaReceiptTemplate;
