
function validate() {
    _id('go').disabled = true;
    const min = parseInt(_id('min').value);
    const max = parseInt(_id('max').value);
    if (min == '' || max == '') return;
    if (min > 9007199254740991 || min < -9007199254740991) return;
    if (max > 9007199254740991 || max < -9007199254740991) return;
    _id('go').disabled = false;
}

_id('min').addEventListener('input', validate);
_id('max').addEventListener('input', validate);

let interval;
_id('go').addEventListener('click', () => {
    _id('copy').disabled = true;
    const prev = parseInt(_id('result').innerText.replaceAll(',', ''));
    const min = parseInt(_id('min').value);
    const max = parseInt(_id('max').value);
    const num = Math.round(min+(Math.random()*(max-min)));
    const prevDiff = (num-prev);
    const stepCount = 35;
    const aniStep = prevDiff/stepCount;
    clearInterval(interval);
    let i = 0;
    interval = setInterval(() => {
        i++;
        _id('result').innerText = Math.round((prev+(aniStep*i)));
        if (i == stepCount) {
            clearInterval(interval);
            _id('result').innerText = num;
            _id('copy').disabled = false;
        }
        if (_id('commas').checked) _id('result').innerText = parseInt(_id('result').innerText).toLocaleString('en-us');
    }, 20);
});

_id('commas').addEventListener('change', () => {
    if (_id('commas').checked) {
        _id('result').innerText = parseInt(_id('result').innerText).toLocaleString('en-us');
    } else {
        _id('result').innerText = _id('result').innerText.replaceAll(',', '');
    }
});

window.addEventListener('load', () => {
    _id('go').click();
});

window.addEventListener('keyup', (event) => {
    if (event.code == 'Enter') {
        _id('go').click();
    }
});