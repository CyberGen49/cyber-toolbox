
_id('input').addEventListener('input', () => {
    let split = _id('input').value.split('');
    let str = [];
    split.forEach((char) => {
        if (Math.random() > 0.5)
            str.push(char.toUpperCase());
        else
            str.push(char.toLowerCase());
    });
    _id('output').value = str.join('');
    _id('output').dispatchEvent(new Event('resize'));
});