
document.addEventListener('load', async () => {
    const res = await fetch('http://localhost:4000/direccionData')
    const dd = await res.json()
    console.log(dd)
})