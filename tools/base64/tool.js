
_id('input').addEventListener('input', (e) => {
    _id('output').value = btoa(_id('input').value);
    _id('output').dispatchEvent(new Event('resize'));
});
_id('output').addEventListener('input', (e) => {
    try {
        _id('input').value = atob(_id('output').value);
    } catch (error) {
        _id('input').value = `Invalid base64`;
    }
    _id('input').dispatchEvent(new Event('resize'));
});