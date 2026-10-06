import { useState, type ComponentPropsWithRef } from 'react'
import './segmented-switch.css'

export type SegmentedSwitchOption<T extends string> = {
  value: T
  label: string
  id?: string
  controls?: string
  disabled?: boolean
}

type SegmentedSwitchProps<T extends string> = Omit<ComponentPropsWithRef<'div'>, 'children' | 'onChange' | 'defaultValue'> & {
  options: readonly SegmentedSwitchOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  size?: 's' | 'm'
  disabled?: boolean
}

export function SegmentedSwitch<T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  size = 'm',
  disabled = false,
  className,
  ref,
  ...rest
}: SegmentedSwitchProps<T>) {
  const [internalValue, setInternalValue] = useState<T | undefined>(() => defaultValue ?? options[0]?.value)
  const selectedValue = value ?? internalValue

  function select(nextValue: T) {
    if (nextValue === selectedValue) return
    if (value === undefined) setInternalValue(nextValue)
    onChange?.(nextValue)
  }

  return (
    <div {...rest} ref={ref} role="group" className={`segmented-switch segmented-switch--${size}${className ? ` ${className}` : ''}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          id={option.id}
          aria-controls={option.controls}
          aria-pressed={selectedValue === option.value}
          disabled={disabled || option.disabled}
          onClick={() => select(option.value)}
          className="segmented-switch-option"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
