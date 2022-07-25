
_id('input').addEventListener('input', (e) => {
    let lines = _id('input').value.replace('\r', '').split('\n');
    switch (_id('order').value) {
        case 'az':
            lines.sort((a, b) => {
                return a.localeCompare(b, undefined, {
                    numeric: true,
                    sensitivity: 'base'
                });
            });
            break;
        case 'za':
            lines.sort((b, a) => {
                return a.localeCompare(b, undefined, {
                    numeric: true,
                    sensitivity: 'base'
                });
            });
            break;
        case 'sl':
            lines.sort((a, b) => {
                return (a.length-b.length);
            });
            break;
        case 'sl':
            lines.sort((b, a) => {
                return (a.length-b.length);
            });
            break;
    }
    _id('output').value = lines.join('\n');
    _id('output').dispatchEvent(new Event('resize'));
});

_id('order').addEventListener('change', () => {
    _id('input').dispatchEvent(new Event('input'));
});