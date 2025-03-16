declare module 'js-dos' {
  export interface DosBoxConfig {
    canvas: HTMLCanvasElement;
    wdosboxUrl: string;
  }

  export interface DosBoxFS {
    extract(url: string): Promise<void>;
  }

  export interface DosBoxInstance {
    exit(): void;
    createFs(): Promise<DosBoxFS>;
    run(commands: string[]): Promise<void>;
  }

  export function DosBox(config: DosBoxConfig): Promise<DosBoxInstance>;
}

// Add global type
interface Window {
  DosBox?: (config: import('js-dos').DosBoxConfig) => Promise<import('js-dos').DosBoxInstance>;
} 