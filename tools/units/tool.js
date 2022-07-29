
let conversions = {};
let group = {};
let unitA;
let unitB;

window.addEventListener('load', async() => {
    const res = await fetch('./conversions.json');
    conversions = await res.json();
    const resMoneyVal = await fetch('./currency-values.json');
    const resMoneyNames = await fetch('./currency-symbols.json');
    moneyVal = await resMoneyVal.json();
    moneyNames = await resMoneyNames.json();
    Object.keys(moneyNames.symbols).forEach((id) => {
        conversions.currency.units[id.toLowerCase()] = {
            name: moneyNames.symbols[id],
            toBase: `x/${moneyVal.rates[id]}`
        }
    });
    conversions.currency.name += ` (${moneyVal.date})`;
    console.log(conversions);
    _id('group').innerHTML = '';
    Object.keys(conversions).forEach((key) => {
        const group = conversions[key];
        if (Object.keys(group.units).length == 0) return;
        _id('group').innerHTML += `
            <option value="${key}">${group.name}</option>
        `;
    });
    _id('group').value = 'length';
    _id('group').dispatchEvent(new Event('change'));
});

_id('group').addEventListener('change', () => {
    group = conversions[_id('group').value];
    _id('aUnit').innerHTML = '';
    _id('bUnit').innerHTML = '';
    _id('a').value = group.defaultVal || 1;
    Object.keys(group.units).forEach((key) => {
        const unit = group.units[key];
        [_id('aUnit'), _id('bUnit')].forEach((el) => {
            el.innerHTML += `
                <option value="${key}" ${unit.placeholder ? 'disabled':''}>${unit.name}</option>
            `;
        });
    });
    _id('aUnit').value = group.defaultSel[0];
    _id('bUnit').value = group.defaultSel[1];
    _id('group').disabled = false;
    _id('aUnit').disabled = false;
    _id('bUnit').disabled = false;
    calculate('a');
});

function calculate(caller) {
    const a = _id('a');
    const b = _id('b');
    unitA = _id(`aUnit`).value;
    unitB = _id(`bUnit`).value;
    const unitIdsByLength = Object.keys(group.units).sort((a, b) => {
        return (a.length-b.length);
    }).reverse();
    const parseExp = (exp) => {
        while (true) {
            let changed = false;
            unitIdsByLength.forEach((key) => {
                if (exp.match(new RegExp(key))) {
                    exp = exp.replace(key, group.units[key].toBase);
                    changed = true;
                }
            });
            if (!changed) break;
        }
        return exp;
    };
    const _rel = (a, b, unitA, unitB) => {
        const baseEq = parseExp(group.units[unitA].toBase);
        const valueEq = group.units[unitB].fromBase || `y/(${parseExp(group.units[unitB].toBase)})`;
        console.log(baseEq, valueEq);
        let base = parseFloat(math.evaluate(baseEq, {
            x: parseFloat(a.value)
        }));
        if (group.units[unitB].fromBase)
            b.value = roundSmart(parseFloat(math.evaluate(valueEq, {
                x: base
            })).toLocaleString('fullwide', { useGrouping: false }), 5);
        else
            b.value = roundSmart(parseFloat(math.evaluate(valueEq, {
                x: 1, y: base
            })).toLocaleString('fullwide', { useGrouping: false }), 5);
    };
    if (caller == 'b') _rel(b, a, unitB, unitA);
    else _rel(a, b, unitA, unitB);
}

[_id('aUnit'), _id('bUnit')].forEach((el) => {
    el.addEventListener('change', () => {
        if (_id('aUnit').value == _id('bUnit').value) {
            _id('aUnit').value = unitB;
            _id('bUnit').value = unitA;
        }
        calculate('a');
    });
});
[_id('a'), _id('b')].forEach((el) => {
    el.addEventListener('input', () => {
        calculate(el.id);
    });
});