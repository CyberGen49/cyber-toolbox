
let clientIp = '';

window.addEventListener('load', async() => {
    const res = await fetch('/get/ip');
    clientIp = (await res.json()).ip;
    if (!_id('host').value)
        _id('useClientIp').click();
});

function validate() {
    _id('go').disabled = true;
    const host = _id('host').value;
    const port = parseInt(_id('port').value);
    if (port < 0 || port > 65535) return;
    if (!isValidHostname(host) && !isValidIp(host)) return;
    _id('go').disabled = false;
}

_id('host').addEventListener('input', validate);
_id('port').addEventListener('input', validate);

_id('useClientIp').addEventListener('click', () => {
    _id('host').value = clientIp;
    _id('host').dispatchEvent(new Event('input'));
});

_id('go').addEventListener('click', async() => {
    _id('go').disabled = true;
    const host = _id('host').value;
    const port = parseInt(_id('port').value);
    const res = await fetch(`/get/portCheck?host=${host}&port=${port}`);
    const status = (await res.json()).status;
    switch (status) {
        case 'open':
            _id('result').innerHTML = `<span class="success">Port ${port} is open on ${host}!</span>`;
            break;
        case 'closed':
            _id('result').innerHTML = `<span class="fail">Port ${port} is closed on ${host}.</span>`;
            break;
        default:
            _id('result').innerHTML = `Failed to check port!`;
            break;
    }
    _id('resultCont').classList.remove('hidden');
    _id('go').disabled = false;
});