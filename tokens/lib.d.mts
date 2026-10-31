export type Theme = 'light' | 'dark';

export interface ContrastPair {
  fg: string;
  bg: string;
  min: number;
}

export interface Tokens {
  primitive: Record<string, unknown>;
  semantic: Record<Theme, Record<string, string>>;
  contrastPairs: ContrastPair[];
}

export interface ContrastResult extends ContrastPair {
  theme: Theme;
  ratio: number;
  pass: boolean;
}

export const THEMES: readonly Theme[];
export function getPrimitive(tokens: Tokens, path: string): string;
export function resolveValue(tokens: Tokens, value: string): string;
export function resolveTheme(tokens: Tokens, theme: Theme): Record<string, string>;
export function toCss(tokens: Tokens): string;
export function luminance(hex: string): number;
export function contrast(a: string, b: string): number;
export function checkContrast(tokens: Tokens): ContrastResult[];
