import { addCopyButtons } from '@remino/functions'

export const initCode = () => {
	addCopyButtons({
		blockSelector: '.prose__article pre',
		wrapperClass: 'code-block',
		wrapperElement: true,
	})
}
