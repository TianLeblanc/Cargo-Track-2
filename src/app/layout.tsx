import './globals.css';
import { Outfit } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import type { Metadata } from 'next';

const outfit = Outfit({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cargo Track',
  description: 'Envios internacionales hasta la puerta de tu casa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

