import React from 'react';

const DividerLine = () => {
  return (
    <div className="flex items-center justify-center w-full py-1">
      <div className="w-full h-[1px] flex">
        {Array.from({ length: 220 }, (_, i) => (
          <div
            key={i}
            className={`h-full ${i % 2 === 0 ? 'bg-grey-2' : 'bg-transparent'}`}
            style={{ width: '1px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default DividerLine;
