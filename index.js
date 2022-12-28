const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

export default async () => {
	console.log('Wait...')
	await sleep(1000)
	console.log('Hello!')
}
