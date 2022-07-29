
import fetch, { Headers } from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.chdir(__dirname);

(async() => {
    const headers = new Headers();
    headers.append('apikey', fs.readFileSync('./_key.txt', 'utf-8'))
    const res = await fetch('https://api.apilayer.com/exchangerates_data/latest?base=USD', {
        headers: headers
    });
    const json = await res.json();
    console.log(json);
    fs.writeFileSync('./currency-values.json', JSON.stringify(json, null, 4));
})();