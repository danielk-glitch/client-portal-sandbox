import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import './note-see-more.css'

/**
 * "View note →" at the right end of a note row's name line. It animates in when the row is hovered or focused (CSS),
 * and stays visible on touch screens, which have no hover. Plain text, not a button: the whole row is the tap target.
 */
export function NoteSeeMore() {
  return <span className="note-see-more" aria-hidden="true">View note<ArrowForwardRounded className="note-see-more-arrow" /></span>
}
