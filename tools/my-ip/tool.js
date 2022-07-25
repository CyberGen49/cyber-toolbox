
window.addEventListener('load', async() => {
    const res = await fetch('/get/ip');
    const ip = (await res.json()).ip;
    _id('result').innerText = ip;
    _id('result').classList.remove('placeholder');
});