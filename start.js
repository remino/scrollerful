#!/usr/bin/env node

import main from './index.js'

main()
	.then(() => {})
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
