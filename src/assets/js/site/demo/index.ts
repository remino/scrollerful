import { initCode } from './code'
import { initControls } from './controls'
import { initNavigation } from './navigation'
import { initProgress } from './progress'
import { initVideo } from './video'

const initDemo = () => {
	initControls()
	initProgress()
	initVideo()
	initCode()
	initNavigation()
}

export default initDemo
