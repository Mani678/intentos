import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'IntentOS — Just say what you want',
  description: 'The AI-powered payment engine. No wallets, no chains, no complexity.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%237c5cfc'/><text y='.9em' font-size='70' x='15' fill='white' font-family='Arial' font-weight='bold'>I</text></svg>",
  },
  openGraph: {
    title: 'IntentOS',
    description: 'Just say what you want to do with money.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1a1a1d',
                border: '1px solid #2a2a2d',
                color: '#fafafa',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}