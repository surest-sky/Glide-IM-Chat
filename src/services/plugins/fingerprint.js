import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'




const generateFrontId = () => {
    // Initialize an agent at application startup.
    const fpPromise = FingerprintJS.load({
        apiKey: 'IzPUpYfVsdWJtvv9RnGO', region: 'ap'
    })
    return new Promise((resolve, reject) => {
        fpPromise
            .then(fp => fp.get())
            .then(result => resolve(result.visitorId))
    })


}

export { generateFrontId }