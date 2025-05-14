import { getSiteUrl } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';
import { paths } from "./paths";

// Navigation Items
export const navItems = [
  { key: "dashboard", title: "Inicio", icon: "dashboard", href: paths.dashboard },
  { key: "polizas", title: "Pólizas", icon: "assignment", href: "/polizas" },
  { key: "clientes", title: "Clientes", icon: "people", href: "/clientes" },
  { key: "tareas", title: "Tareas", icon: "task", href: "/tareas" },
  { key: "aseguradoras", title: "Aseguradoras", icon: "business", href: "/aseguradoras" },
  { key: "configuracion", title: "Configuración", icon: "settings", href: "/configuracion" },
];

// Subscription Plans Configuration
export const subscriptionPlans = {
  basic: {
    name: 'Básico',
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID!,
    features: [
      'Gestión básica de pólizas',
      'Hasta 50 clientes',
      'Soporte por email',
    ],
  },
  pro: {
    name: 'Profesional',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    features: [
      'Gestión avanzada de pólizas',
      'Clientes ilimitados',
      'Soporte prioritario',
      'Reportes avanzados',
    ],
  },
  enterprise: {
    name: 'Empresarial',
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      'Todas las características Pro',
      'API access',
      'Soporte 24/7',
      'Personalización completa',
    ],
  },
};

// Main Configuration Interface
export interface Config {
  site: { 
    name: string; 
    description: string; 
    themeColor: string; 
    url: string 
  };
  logLevel: keyof typeof LogLevel;
  stripe: {
    publishableKey: string;
    basicPriceId: string;
    proPriceId: string;
    enterprisePriceId: string;
  };
}

// Configuration Object
export const config: Config = {
  site: { 
    name: 'Devias Kit', 
    description: '', 
    themeColor: '#090a0b', 
    url: getSiteUrl() 
  },
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? 'INFO',
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    basicPriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID!,
    proPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    enterprisePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!,
  },
};

// Auth Routes Configuration
export const authRoutes = {
  signIn: '/auth/sign-in',
  signUp: '/auth/sign-up',
  verifyEmail: '/auth/verify-email',
  afterCheckout: '/auth/after-checkout',
};

// API Routes Configuration
export const apiRoutes = {
  createCheckoutSession: '/api/create-checkout-session',
  verifySession: '/api/verify-session',
};

// Feature Flags and Limits
export const features = {
  maxClientsBasic: 50,
  maxClientsPro: -1, // unlimited
  maxClientsEnterprise: -1, // unlimited
};