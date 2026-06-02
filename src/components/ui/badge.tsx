import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        pago: 'bg-green-500/10 text-green-400 border-green-500/20',
        pendente: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        jacson: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        manueli: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        pix: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        cartao: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        dinheiro: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        fixo: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
