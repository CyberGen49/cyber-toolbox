
const beatsMin = 2;
const beatsMax = 32;
const bpmGet = (() => { return parseInt(_id('bpm').value) });
let beats = 4;
let isPlaying = false;
let startTime = 0;
let beatPos = 1;
let beatsPlayed = 0;
let interval;
const sound = {
    down: zounds.load('./beatDown.ogg'),
    up: zounds.load('./beatUp.ogg')
};
let taps = [];
let lastTap = 0;

function applyBeats() {
    _id('beatAdd').disabled = false;
    _id('beatRemove').disabled = false;
    if (beats <= beatsMin) _id('beatRemove').disabled = true;
    if (beats >= beatsMax) _id('beatAdd').disabled = true;
    _id('beatCount').innerText = beats;
    _id('beats').innerHTML = '';
    for (let i = 0; i < beats; i++) {
        _id('beats').innerHTML += `<div class="beat"></div>`;
    } 
    beatPos = 1;
}
_id('beatAdd').addEventListener('click', () => {
    beats = clamp((beats+1), beatsMin, beatsMax);
    applyBeats();
});
_id('beatRemove').addEventListener('click', () => {
    beats = clamp((beats-1), beatsMin, beatsMax);
    applyBeats();
});

function validateBpm() {
    _id('play').disabled = true;
    _id('bpmUp').disabled = false;
    _id('bpmDown').disabled = false;
    const bpm = bpmGet();
    if (!bpm) return;
    if (bpm < 1 || bpm > 9999) return;
    _id('play').disabled = false;
    if (bpm == 1) _id('bpmDown').disabled = true;
    if (bpm == 9999) _id('bpmUp').disabled = true;
}
_id('bpm').addEventListener('input', () => {
    playStop();
    validateBpm();
});
_id('bpm').addEventListener('change', () => {
    const bpm = bpmGet();
    if (!bpm) _id('bpm').value = 120;
    if (bpm < 1) _id('bpm').value = 1;
    if (bpm > 9999) _id('bpm').value = 9999;
    validateBpm();
});
_id('bpmUp').addEventListener('click', () => {
    _id('bpm').value = clamp((bpmGet()+1), 1, 9999);
    validateBpm();
});
_id('bpmDown').addEventListener('click', () => {
    _id('bpm').value = clamp((bpmGet()-1), 1, 9999);
    validateBpm();
});

function playStart() {
    isPlaying = true;
    startTime = Date.now();
    beatsPlayed = 0;
    beatPos = 1;
    interval = setInterval(() => {
        const mspb = (1000/(bpmGet()/60));
        if (Date.now() > (startTime+(beatsPlayed*mspb))) {
            beatsPlayed++;
            const beatEl = _class('beat')[beatPos-1];
            if (beatPos == 1) sound.up.play();
            else sound.down.play();
            beatEl.classList.add('active');
            setTimeout(() => {
                beatEl.classList.remove('active');
            }, (mspb/2));
            beatPos++;
            if (beatPos > beats) beatPos = 1;
        }
    }, 1);
    _class('icon', _id('play'))[0].innerText = 'pause';
}
function playStop() {
    clearInterval(interval);
    isPlaying = false;
    _class('icon', _id('play'))[0].innerText = 'play_arrow';
}
_id('play').addEventListener('click', () => {
    if (isPlaying) return playStop();
    return playStart();
});

_id('tapper').addEventListener('click', () => {
    playStop();
    if ((Date.now()-lastTap) > 2000) taps = [];
    const tapDelay = (() => {
        if (taps.length > 0)
            return (Date.now()-lastTap);
    })();
    lastTap = Date.now();
    if (taps.length === 0) {
        taps.push(0);
        return;
    }
    taps.push(tapDelay);
    let avgDelay = 0;
    taps.forEach((tap) => {
        if (tap > 0) avgDelay += tap;
    });
    const mspb = (avgDelay/(taps.length-1));
    _id('bpm').value = Math.round((1000*60)/mspb);
});

window.addEventListener('keydown', (event) => {
    if (event.code == 'KeyT') {
        _id('tapper').classList.add('active');
        _id('tapper').click();
    }
    if (event.code == 'Space' || event.code == 'KeyP') {
        event.preventDefault();
        _id('play').click();
    }
});
window.addEventListener('keyup', (event) => {
    if (event.code == 'KeyT') {
        _id('tapper').classList.remove('active');
    }
});