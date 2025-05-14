import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ variant = 'default', size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { width: 120, height: 32 },
    md: { width: 150, height: 40 },
    lg: { width: 180, height: 48 },
  };

  const { width, height } = sizes[size];

  return (
    <Link href="/" className="flex items-center">
      <div className="relative flex items-center">
        <span className="font-sora font-bold text-2xl">
          Reel<span className="text-[#1ED760]">Genius</span>
        </span>
        <span className="ml-1 text-xs bg-[#FF3366] text-white px-1.5 py-0.5 rounded-md font-medium">
          BETA
        </span>
      </div>
    </Link>
  );
};

export default Logo;