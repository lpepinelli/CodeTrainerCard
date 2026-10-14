import font from '../../../api/src/assets/fonts/pokemonFireRed.ttf?inline'
import { renderLogo } from '../../../api/src/templates/logo'

// Always the red preset: the ball reads best in red, whatever color the card uses
const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderLogo('FF8A8A', font))}`

function Logo() {
  return <img className="logo" src={src} alt="" />
}

export default Logo
