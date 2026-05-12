import * as React from 'react'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      'text-xs font-medium text-foreground-muted',
      className || '',
    ]
      .join(' ')
      .trim()

    return <label ref={ref} className={classes} {...props} />
  },
)

Label.displayName = 'Label'

export { Label }
