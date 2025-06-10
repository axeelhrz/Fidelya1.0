'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// Icons
const SaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 15.2l3.2-2.7L12 9.8 8.8 12.5 12 15.2zM9 2l-1.83 2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

const MagnifierIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

const GridIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
    <path d="M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H20V18H18V20H16V18H13V20H11V16H14V15M16,15V18H18V15H16M4,20V14H10V20H4M6,16V18H8V16H6M4,12V11H6V12H4M9,12V11H10V12H9M6,12V11H8V12H6Z"/>
  </svg>
);

const ActionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
  </svg>
);

// Header component for CB screens
export const CBHeader: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
}> = ({ number, title, nacReferences }) => (
  <div className="bg-[#3C3C3C] px-8 py-6 flex items-center justify-between">
    <div>
      <h1 className="text-white font-bold text-4xl mb-2">
        <span className="text-6xl mr-4">{number}</span>
        {title}
      </h1>
      <p className="text-gray-300 text-lg">{nacReferences}</p>
    </div>
    <button className="w-12 h-12 bg-[#404040] rounded-lg flex items-center justify-center hover:bg-[#4A4A4A] transition-all duration-200 hover:scale-110">
      <SaveIcon />
    </button>
  </div>
);

// Subcause item component
export const CBSubcauseItem: React.FC<{
  number: string;
  text: string;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ number, text, isSelected = false, onClick }) => (
  <div 
    className={`
      flex items-center justify-between p-4 rounded-lg transition-all duration-200 cursor-pointer
      ${isSelected 
        ? 'bg-[#404040] ring-2 ring-[#FFD600]' 
        : 'bg-[#2E2E2E] hover:bg-[#353535]'
      }
    `}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <span className="text-[#FFD600] font-bold text-lg min-w-[3rem]">{number}</span>
      <span className="text-white text-base">{text}</span>
    </div>
    <button className="w-10 h-10 bg-[#FFD600] rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200">
      <ActionIcon />
    </button>
  </div>
);

// Action icons component
export const CBActionIcons: React.FC = () => (
  <div className="bg-[#404040] px-8 py-6 flex justify-center gap-8">
    <button className="w-16 h-16 bg-[#2E2E2E] rounded-lg flex items-center justify-center hover:bg-[#353535] transition-all duration-200 hover:scale-110 border border-gray-600">
      <CameraIcon />
    </button>
    <button className="w-16 h-16 bg-[#2E2E2E] rounded-lg flex items-center justify-center hover:bg-[#353535] transition-all duration-200 hover:scale-110 border border-gray-600">
      <MagnifierIcon />
    </button>
    <button className="w-16 h-16 bg-[#2E2E2E] rounded-lg flex items-center justify-center hover:bg-[#353535] transition-all duration-200 hover:scale-110 border border-gray-600">
      <DocumentIcon />
    </button>
  </div>
);

// Navigation component - Updated for 15 screens
export const CBNavigation: React.FC<{
  currentScreen: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onGrid?: () => void;
}> = ({ currentScreen, onPrevious, onNext, onGrid }) => {
  const router = useRouter();

  const handlePrevious = () => {
    if (currentScreen > 1) {
      router.push(`/tabla-scat/cb/${currentScreen - 1}`);
    } else {
      router.push('/tabla-scat/contacto');
    }
  };

  const handleNext = () => {
    if (currentScreen < 15) {
      router.push(`/tabla-scat/cb/${currentScreen + 1}`);
    } else {
      router.push('/tabla-scat/actos');
    }
  };

  const handleGrid = () => {
    router.push('/tabla-scat/cb');
  };

  return (
    <div className="bg-[#5C5C5C] px-8 py-6 flex items-center justify-center gap-8">
      <button 
        onClick={onPrevious || handlePrevious}
        className="w-16 h-16 bg-[#404040] rounded-lg flex items-center justify-center hover:bg-[#4A4A4A] transition-all duration-200 hover:scale-110"
        disabled={currentScreen === 1}
      >
        <ArrowLeftIcon />
      </button>
      
      <button 
        onClick={onGrid || handleGrid}
        className="w-16 h-16 bg-[#404040] rounded-lg flex items-center justify-center hover:bg-[#4A4A4A] transition-all duration-200 hover:scale-110"
      >
        <GridIcon />
      </button>
      
      <button 
        onClick={onNext || handleNext}
        className="w-16 h-16 bg-[#404040] rounded-lg flex items-center justify-center hover:bg-[#4A4A4A] transition-all duration-200 hover:scale-110"
        disabled={currentScreen === 15}
      >
        <ArrowRightIcon />
      </button>
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout2: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout3: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout4: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout5: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout6: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout7: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout8: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout9: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout10: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout11: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout12: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout13: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout14: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout15: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout16: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout17: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout18: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout19: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout20: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout21: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout22: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout23: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout24: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout25: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout26: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout27: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout28: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout29: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout30: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout31: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout32: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout33: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout34: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout35: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout36: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout37: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout38: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout39: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout40: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout41: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout42: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout43: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout44: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout45: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout46: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout47: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout48: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout49: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout50: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout51: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout52: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout53: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout54: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout55: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout56: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout57: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout58: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout59: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout60: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout61: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout62: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout63: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout64: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout65: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout66: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout67: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout68: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout69: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout70: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout71: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout72: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout73: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout74: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout75: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout76: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};

// Main CB screen layout component
export const CBScreenLayout77: React.FC<{
  number: number;
  title: string;
  nacReferences: string;
  subcauses: Array<{ number: string; text: string; }>;
  children?: React.ReactNode;
}> = ({ number, title, nacReferences, subcauses, children }) => {
  const [selectedSubcause, setSelectedSubcause] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex flex-col">
      {/* Header */}
      <CBHeader number={number} title={title} nacReferences={nacReferences} />
      
      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {subcauses.map((subcause, index) => (
            <CBSubcauseItem
              key={index}
              number={subcause.number}
              text={subcause.text}
              isSelected={selectedSubcause === subcause.number}
              onClick={() => setSelectedSubcause(subcause.number)}
            />
          ))}
        </div>
      </div>
      
      {/* Action icons */}
      <CBActionIcons />
      
      {/* Navigation */}
      <CBNavigation currentScreen={number} />
      
      {children}
    </div>
  );
};