import React from 'react';
import { format } from 'date-fns';

interface FlechasDiaProps {
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
}

const FlechasDia: React.FC<FlechasDiaProps> = ({ currentDate, onPrevDay, onNextDay }) => {
  return (
    <div className="flex justify-between items-center gap-2 w-4/6">
      <button onClick={onPrevDay} className="bg-cover rounded">
        <img src="/img/arrow-left.svg" alt="arrow-left" className='w-7'/>
      </button>
      <div className="bg-white rounded">
        <p className="text-black font-bold">{format(currentDate, 'EEEE, d MMMM')}</p>
      </div>
      <button onClick={onNextDay} className="bg-cover rounded">
        <img src="/img/arrow-right.svg" alt="arrow-right" className='w-7'/>
      </button>
    </div>
  );
};

export default FlechasDia;