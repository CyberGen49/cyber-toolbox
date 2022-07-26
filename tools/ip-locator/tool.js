
let clientIp = '';

window.addEventListener('load', async() => {
    const res = await fetch('/get/ip');
    clientIp = (await res.json()).ip;
    if (!_id('host').value)
        _id('useClientIp').click();
});

_id('useClientIp').addEventListener('click', () => {
    _id('host').value = clientIp;
    _id('host').dispatchEvent(new Event('input'));
});

function validate() {
    _id('go').disabled = true;
    const host = _id('host').value;
    if (!isValidHostname(host) && !isValidIp(host)) return;
    _id('go').disabled = false;
}

_id('host').addEventListener('input', validate);

_id('go').addEventListener('click', async() => {
    _id('go').disabled = true;
    _id('results').innerHTML = `
        <div class="resultCard">
            <div class="placeholder">Locating...</div>
        </div>
    `;
    const host = _id('host').value;
    const res = await fetch(`/get/ipLocate?host=${host}`);
    const data = await res.json();
    if (data && data.status == 'good' && data.data.status == 'success') {
        const stats = data.data;
        console.log(stats);
        _id('results').innerHTML = '';
        [
            ['City', stats.city],
            ['State/Region', stats.regionName],
            ['Country', stats.country],
            ['Postal code', stats.zip],
            ['Coords (Lat, Lon)', `${stats.lat}, ${stats.lon}`],
            ['ISP', stats.isp],
            ['Timezone', stats.timezone],
        ].forEach((stat) => {
            if (!stat[1]) return;
            _id('results').innerHTML += `
                <div class="resultCard statCont">
                    <div class="name">${stat[0]}</div>
                    <div class="value copyable">${stat[1]}</div>
                </div>
            `;
        });
    } else {
        // ...
    }
    _id('go').disabled = false;
});