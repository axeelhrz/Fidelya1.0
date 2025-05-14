import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ variant = 'default' }: LogoProps) => {
  const textColor = variant === 'white' ? 'text-white' : 'text-[#1ED760]';

  return (
    <Link href="/" className="flex items-center">
      <div className="relative flex items-center">
        <span className="font-sora font-bold text-2xl">
          Reel<span className={textColor}>Genius</span>
        </span>
        <span className="ml-1 text-xs bg-[#FF3366] text-white px-1.5 py-0.5 rounded-md font-medium">
          BETA
        </span>
      </div>
    </Link>
  );
};

export default Logo;