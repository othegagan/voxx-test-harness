'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'w-full inline-flex items-center justify-center text-nowrap whitespace-nowrap rounded-md text-sm font-medium  focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring  disabled:pointer-events-none ',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
                outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
                quiet: 'hover:bg-accent hover:text-accent-foreground',
                accent: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-xs',
                success: 'bg-green-500 text-background hover:bg-green-500/90 shadow-xs',
                warning: 'bg-amber-500 text-background hover:bg-amber-500/90 shadow-xs',
                danger: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
                black: 'bg-foreground text-background shadow-xs '
            },
            size: {
                default: 'h-9 px-4 py-2 w-full',
                xs: 'h-6 px-2 py-1 text-[10px]',
                sm: 'h-8  px-3 text-xs',
                lg: 'h-10  px-8',
                icon: 'h-8 w-8 w-full'
            },
            shape: {
                default: '',
                square: 'aspect-square p-0',
                circle: 'rounded-full aspect-square p-0'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            shape: 'default'
        }
    }
);

//@ts-ignore
export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    href?: string;
    toolTip?: string;
}

const Button = ({
    ref,
    className,
    variant,
    size,
    shape,
    asChild = false,
    isLoading,
    loadingText,
    prefix,
    suffix,
    href,
    children,
    toolTip,
    ...props
}: ButtonProps) => {
    const Comp = asChild ? Slot : href ? 'a' : 'button';
    const isDisabled = isLoading || props.disabled;

    // Determine where to render the loader
    const renderPrefix = !isLoading || !suffix;
    const renderSuffix = isLoading && suffix;

    // Adjust focus styles dynamically
    // const focusStyles = Comp === 'a' ? 'focus:ring-blue-400' : 'focus:outline-hidden focus:ring-3 focus:ring-offset-2';

    const buttonContent = (
        <Comp
            className={cn(
                'group cursor-pointer select-none gap-2 transition-all duration-300 ease-linear active:scale-95',
                isDisabled && 'cursor-not-allowed opacity-60',
                buttonVariants({ variant, size, shape, className })
                // focusStyles // Apply focus styles only if Comp is not 'a'
            )}
            //@ts-ignore
            ref={ref}
            href={href}
            disabled={isDisabled}
            {...props}>
            {/* Conditionally render the prefix or loader */}
            {renderPrefix && (isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : prefix ? <span>{prefix}</span> : null)}

            {/* Handle text or children */}
            {typeof children === 'string' ? (
                <span className='truncate'>{isLoading && loadingText ? loadingText : children}</span>
            ) : (
                children
            )}

            {/* Conditionally render the suffix or loader */}
            {renderSuffix && <Loader2 className='h-4 w-4 animate-spin' />}
            {!renderSuffix && suffix && <span>{suffix}</span>}
        </Comp>
    );

    if (toolTip) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                <TooltipContent>{toolTip}</TooltipContent>
            </Tooltip>
        );
    }

    return buttonContent;
};
Button.displayName = 'Button';

export { Button, buttonVariants };
