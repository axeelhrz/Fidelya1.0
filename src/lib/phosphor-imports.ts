/**
 * This file provides optimized imports for Phosphor icons
 * to reduce bundle size and improve performance.
 * 
 * Instead of importing from the main package, we import specific icons
 * from their individual files to enable better tree-shaking.
 */

// Common UI icons
export { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight';
export { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
export { CaretDown } from '@phosphor-icons/react/dist/ssr/CaretDown';
export { CaretUp } from '@phosphor-icons/react/dist/ssr/CaretUp';
export { Check } from '@phosphor-icons/react/dist/ssr/Check';
export { X } from '@phosphor-icons/react/dist/ssr/X';
export { List } from '@phosphor-icons/react/dist/ssr/List';
export { DotsThree } from '@phosphor-icons/react/dist/ssr/DotsThree';

// Theme icons
export { Sun } from '@phosphor-icons/react/dist/ssr/Sun';
export { Moon } from '@phosphor-icons/react/dist/ssr/Moon';

// Feature icons
export { RocketLaunch } from '@phosphor-icons/react/dist/ssr/RocketLaunch';
export { ShieldCheck } from '@phosphor-icons/react/dist/ssr/ShieldCheck';
export { Lock } from '@phosphor-icons/react/dist/ssr/Lock';
export { Database } from '@phosphor-icons/react/dist/ssr/Database';
export { Users } from '@phosphor-icons/react/dist/ssr/Users';
export { Lightning } from '@phosphor-icons/react/dist/ssr/Lightning';

// Contact icons
export { Envelope } from '@phosphor-icons/react/dist/ssr/Envelope';
export { Phone } from '@phosphor-icons/react/dist/ssr/Phone';
export { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';
export { Globe } from '@phosphor-icons/react/dist/ssr/Globe';

// Auth icons
export { SignIn } from '@phosphor-icons/react/dist/ssr/SignIn';
export { SignOut } from '@phosphor-icons/react/dist/ssr/SignOut';

// Tipos
export type { IconProps, IconWeight } from '@phosphor-icons/react';