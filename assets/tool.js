
// Javascript code shared by all tools

let scrollHeight = 0;

setInterval(() => {
    const height = _id('content').clientHeight+50;
    if (height !== scrollHeight) {
        window.top.postMessage({
            action: 'scrollHeight',
            height: height
        }, '*');
        scrollHeight = height;
    }
}, 10);

if (params.get('nobg')) document.body.classList.add('noBack');
if (params.get('nocenter')) document.body.classList.add('noCenter');
if (params.get('noscroll')) document.body.classList.add('noScroll');