import { create } from 'zustand';

export interface ParsedIntent {
  intent: 'payment' | 'split' | 'donation' | 'transfer' | 'swap' | 'unknown';
  recipient?: string | null;
  recipientAddress?: string | null;
  amount?: number | null;
  currency?: string | null;
  sourceChain?: string | null;
  destinationChain?: string | null;
  memo?: string | null;
  splitParticipants?: string[] | null;
  rawInput: string;
  confidence: number;
  humanReadableSummary: string;
}

export type AppScreen =
  | 'dashboard'
  | 'parsing'
  | 'preview'
  | 'confirming'
  | 'success'
  | 'failed'
  | 'history';

interface IntentStore {
  // Current flow state
  screen: AppScreen;
  currentInput: string;
  parsedIntent: ParsedIntent | null;
  txHash: string | null;
  txId: string | null;
  isExecuting: boolean;
  error: string | null;

  // Actions
  setScreen: (screen: AppScreen) => void;
  setCurrentInput: (input: string) => void;
  setParsedIntent: (intent: ParsedIntent | null) => void;
  setTxHash: (hash: string | null) => void;
  setTxId: (id: string | null) => void;
  setIsExecuting: (v: boolean) => void;
  setError: (err: string | null) => void;
  reset: () => void;
}

const initialState = {
  screen: 'dashboard' as AppScreen,
  currentInput: '',
  parsedIntent: null,
  txHash: null,
  txId: null,
  isExecuting: false,
  error: null,
};

export const useIntentStore = create<IntentStore>((set) => ({
  ...initialState,
  setScreen: (screen) => set({ screen }),
  setCurrentInput: (currentInput) => set({ currentInput }),
  setParsedIntent: (parsedIntent) => set({ parsedIntent }),
  setTxHash: (txHash) => set({ txHash }),
  setTxId: (txId) => set({ txId }),
  setIsExecuting: (isExecuting) => set({ isExecuting }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
