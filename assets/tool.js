
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

if (params.nobg) document.body.classList.add('noBack');
if (params.nocenter) document.body.classList.add('noCenter');
if (params.noscroll) document.body.classList.add('noScroll');