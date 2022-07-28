
let items = [];
let timeout;

_id('input').addEventListener('input', () => {
    items = _id('input').value.replace(/\r/g, '').split('\n').filter(String);
    _id('go').disabled = true;
    if (items.length > 1) _id('go').disabled = false;
});
_id('input').addEventListener('keyup', (e) => {
    e.stopPropagation();
});

_id('go').addEventListener('click', () => {
    _id('result').innerText = `Selecting...`;
    _id('result').classList.add('placeholder');
    _id('copy').disabled = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        _id('result').innerText = items[Math.round(Math.random()*(items.length-1))];
        _id('result').classList.remove('placeholder');
        _id('copy').disabled = false;
    }, (300+(Math.random()*300)));
});

window.addEventListener('keyup', (event) => {
    if (event.code == 'Enter') {
        _id('go').click();
    }
});