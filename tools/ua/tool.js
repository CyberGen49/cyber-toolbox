
_id('ua').value = window.navigator.userAgent;

_id('ua').addEventListener('input', () => {
    _id('go').disabled = true;
    if (_id('ua').value) _id('go').disabled = false;
});

_id('go').addEventListener('click', () => {
    const stats = UAParser(_id('ua').value);
    console.log(stats);
    let isValidUa = false;
    _id('results').innerHTML = '';
    [
        ['Browser', stats.browser.name],
        ['Browser version', stats.browser.version],
        ['Browser engine', stats.engine.name],
        ['OS', stats.os.name],
        ['OS version', stats.os.version],
        ['Device type', stats.device.type],
        ['Device vendor', stats.device.vendor],
        ['Device model', stats.device.model],
    ].forEach((stat) => {
        if (!stat[1]) return;
        isValidUa = true;
        _id('results').innerHTML += `
            <div class="resultCard statCont">
                <div class="name">${stat[0]}</div>
                <div class="value copyable">${stat[1]}</div>
            </div>
        `;
    });
    if (!isValidUa) {
        _id('results').innerHTML = `
            <div class="resultCard">
                <div class="placeholder fail">Invalid user agent string!</div>
            </div>
        `;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code == 'Enter') {
        _id('go').click();
    }
});