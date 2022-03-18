const fs = require('fs')

const content = 'Some content!'

const writeToDisk = (log) => {
	try {
		fs.writeFileSync('/usr/src/app/files/hash.txt', log)
		//file written successfully

	} catch (err) {
		console.error(err)
	}
}

// 8-4-4-12
const longHash = () => {
	const s1 = Math.random().toString(36).substr(2, 10)
	const s2 = Math.random().toString(36).substr(2, 6)
	const s3 = Math.random().toString(36).substr(2, 6)
	const s4 = Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 6)
	const s = [s1, s2, s3, s4].join('-')

	return s
}

const printString = () => {
	log = 'Good Luck - ' + new Date().toISOString() + ' ' + longHash()

	// TODO
	// to write to file system now..
	writeToDisk(log)

	console.log('WRITTEN TO DISK: ', log)
	setTimeout(printString, 5000)
}

printString()
