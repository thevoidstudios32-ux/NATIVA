import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-forest text-sand hover:bg-forest-soft',
        earth: 'bg-earth text-forest-deep hover:bg-earth-deep hover:text-paper',
        outline: 'border border-forest/30 text-forest hover:border-forest hover:bg-forest/5',
        ghost: 'text-ink hover:bg-forest/5 hover:text-forest',
        light: 'bg-paper text-forest hover:bg-sand',
        'outline-light': 'border border-sand/50 text-sand hover:border-sand hover:bg-sand/10',
        danger: 'bg-danger text-paper hover:bg-danger/90',
        link: 'h-auto px-0 text-forest underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3.5',
        md: 'h-11 px-5',
        lg: 'h-12 px-6 text-[15px]',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
