import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load({
    apiKey: 'IzPUpYfVsdWJtvv9RnGO', region: 'ap'
})


const generateFrontId = () => {
    return new Promise((resolve, reject) => {
        fpPromise
            .then(fp => fp.get())
            .then(result => resolve(result.visitorId))
    })


}

export { generateFrontId }