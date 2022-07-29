
_id('input').addEventListener('input', () => {
    const val = _id('input').value.replace(/\r/g, '');
    const wordCount = countWords(val);
    const charCount = val.length;
    _id('countWords').innerText = wordCount;
    _id('countChars').innerText = `${charCount} (${val.replace(/ /g, '').length})`;
    _id('countLines').innerText = val.split('\n').length; 
    const wordFreq = (() => {
        let tmp = {};
        let words = getWords(val);
        words.forEach((word) => {
            word = word.toLowerCase();
            if (!tmp[word]) tmp[word] = 0;
            tmp[word]++;
        });
        return tmp;
    })();
    const charFreq = (() => {
        let tmp = {};
        val.split('').forEach((char) => {
            char = char.toLowerCase();
            if (!tmp[char]) tmp[char] = 0;
            tmp[char]++;
        });
        return tmp;
    })();
    _id('wordFreq').innerHTML = '';
    _id('charFreq').innerHTML = '';
    Object.keys(wordFreq).forEach((word) => {
        const freq = wordFreq[word];
        _id('wordFreq').innerHTML += `
            <div class="wordStat">
                <div class="head">
                    <div class="name">${word}</div>
                    <div class="meta">
                        <div>${freq}x</div>
                        <div>${Math.round((freq/wordCount)*100)}%</div>
                    </div>
                </div>
                <progress class="bar" min="0" max="100" step="0.001" value="${((freq/wordCount)*100)}"></progress>
            </div>
        `;
    });
});
_id('input').dispatchEvent(new Event('input'));