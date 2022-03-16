// 8-4-4-12
const s1 = Math.random().toString(36).substr(2, 10)
const s2 = Math.random().toString(36).substr(2, 6)
const s3 = Math.random().toString(36).substr(2, 6)
const s4 = Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 6)
const s = [s1, s2, s3, s4].join('-')

const printString = () => {
        console.log('hell', new Date().toISOString() + ' ' + s)

        setTimeout(printString, 5000)
}

printString()
