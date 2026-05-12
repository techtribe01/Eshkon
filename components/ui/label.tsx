import * as React from 'react'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      'text-sm font-medium text-slate-700',
      className || '',
    ]
      .join(' ')
      .trim()

    return <label ref={ref} className={classes} {...props} />
  },
)

Label.displayName = 'Label'

export { Label }
