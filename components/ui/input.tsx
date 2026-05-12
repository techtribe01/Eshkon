import * as React from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={[
          'flex h-9 w-full rounded border border-border bg-surface px-3 py-2',
          'text-sm text-foreground placeholder:text-foreground-subtle',
          'transition-colors hover:border-border-strong',
          'focus-visible:border-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-[invalid=true]:border-red-400',
          className,
        ]
          .join(' ')
          .trim()}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export { Input }
