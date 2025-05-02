import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: 'Voxx Test Harness | EV Rabbit',
    description: 'Test Harness for EV Rabbit'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={cn(' h-dvh w-full min-w-[360px] bg-background font-sans antialiased', geistSans.variable, geistMono.variable)}>
                <TooltipProvider>
                    <ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
                        <NuqsAdapter>{children}</NuqsAdapter>
                        <div className='absolute top-2 right-2 z-50 shadow-lg'>
                            <ModeToggle />
                        </div>
                        <Toaster
                            position='bottom-right'
                            closeButton={true}
                            duration={3500}
                            richColors
                            className={`${geistSans.className}`}
                        />
                    </ThemeProvider>
                </TooltipProvider>
            </body>
        </html>
    );
}
