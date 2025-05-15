// Type definitions for AOS (Animate On Scroll)
declare module 'aos' {
  export interface AosOptions {
    // Core options
    disable?: boolean | string | ((...args: unknown[]) => boolean);
    startEvent?: string;
    initClassName?: string;
    animatedClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    debounceDelay?: number;
    throttleDelay?: number;
    
    // Animation options
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
  }
  
  export interface AOS {
    init(options?: AosOptions): void;
    refresh(hard?: boolean): void;
    refreshHard(): void;
  }
  
  const aos: AOS;
  export default aos;
}

// CSS module declaration
declare module 'aos/dist/aos.css' {
  const content: Record<string, string>;
  export default content;
}
