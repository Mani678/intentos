import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatAmount(amount: number, currency = 'USDC'): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${currency}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export const CHAIN_NAMES: Record<string, string> = {
  arbitrum: 'Arbitrum',
  ethereum: 'Ethereum',
  base: 'Base',
  polygon: 'Polygon',
};

export const INTENT_LABELS: Record<string, string> = {
  payment: 'Payment',
  split: 'Split',
  donation: 'Donation',
  transfer: 'Transfer',
  swap: 'Swap',
  unknown: 'Unknown',
};

export const INTENT_ICONS: Record<string, string> = {
  payment: '💸',
  split: '✂️',
  donation: '❤️',
  transfer: '🔀',
  swap: '🔄',
  unknown: '❓',
};
