import CheckRounded from '@mui/icons-material/CheckRounded'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import './control-icons.css'

/* Drawn marks for PLACE checkboxes and radios. The theme passes these to every MUI Checkbox and Radio. */
export function CheckboxIcon({ checked = false }: { checked?: boolean }) {
  return <span className={`place-checkbox${checked ? ' is-checked' : ''}`} aria-hidden="true">{checked && <CheckRounded />}</span>
}

export function RadioIcon({ checked = false }: { checked?: boolean }) {
  return <span className={`place-radio${checked ? ' is-checked' : ''}`} aria-hidden="true" />
}

/** Chevron used by Select and Autocomplete, matching the chevrons elsewhere in the portal. */
export function SelectChevron(props: { className?: string }) {
  return <ExpandMoreRounded {...props} />
}

/** Plain × for removable chips, instead of MUI’s filled circle. */
export function ChipDeleteIcon(props: { className?: string; onClick?: () => void }) {
  return <CloseRounded {...props} />
}
