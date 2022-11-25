
// Javascript for the single-page app

const isRedirected = params.get('redirected');
const _init = (async() => {
    const res = await fetch(`/get/init`);
    return res.json();
})();
const baseTitle = document.title;
let settings = localStorageObjGet('settings');

async function updatePage(url = window.location.href, replace = false) {
    const init = await _init;
    if (replace) window.history.replaceState(baseTitle, null, url);
    else window.history.pushState(baseTitle, null, url);
    _id('main').style.opacity = 0;
    await sleep(200);
    _id('main').innerHTML = '';
    const path = window.location.pathname;
    const pathSplit = path.split('/').filter(String);
    const popupSizeDefault = {
        width: 750,
        height: 550
    };
    init.tools.forEach((tool) => {
        let popupSize = tool.popup || popupSizeDefault;
        if (pathSplit[0] !== tool.id || tool.hidden) return;
        _id('main').innerHTML = `
            <div id="head">
                <div class="content">
                    <div class="title">${tool.name}</div>
                    <div class="desc">${tool.desc}</div>
                    <div class="controls">
                        <button id="toolReload" class="controlBtn material-symbols-outlined" title="Reload tool">refresh</button>
                        <button id="toolShare" class="controlBtn material-symbols-outlined" title="Copy filled tool link">share</button>
                        <button id="toolPopout" class="controlBtn material-symbols-outlined" title="Open tool in popup">open_in_new</button>
                    </div>
                </div>
            </div>
            <iframe id="toolFrame" src="/tool/${tool.id}/tool.html?nobg=true&nocenter=true&noscroll=true"></iframe>
        `;
        _id('toolFrame').addEventListener('load', () => {
            _id('toolFrame').style.opacity = 1;
        });
        _id('toolReload').addEventListener('click', () => {
            _id('toolFrame').contentWindow.location.reload();
        });
        _id('toolShare').addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href);
        });
        _id('toolPopout').addEventListener('click', () => {
            window.open(`/tool/${tool.id}/tool.html`, `popup-${tool.id}`, `left=${(screen.availWidth/2)-(popupSize.width/2)},top=${(screen.availHeight/2)-(popupSize.height/2)},width=${popupSize.width},height=${popupSize.height}`);
            updatePage('/');
        });
        document.title = `${tool.name} | ${baseTitle}`;
    });
    if (_id('main').innerHTML == '') {
        let content = [];
        let initLocal = JSON.parse(JSON.stringify(init));
        initLocal.tools.forEach((tool) => {
            if (tool.hidden) tool.group = 'wip';
        });
        initLocal.groups.forEach((group) => {
            content.push(`<h4>${group.name}</h4>`);
            content.push(`<div class="toolCont">`);
            let count = 0;
            initLocal.tools.forEach((tool) => {
                let popupSize = tool.popup || popupSizeDefault;
                if (tool.group !== group.id) return;
                content.push(`
                    <button class="toolCard" data-id="${tool.id}" ${(tool.hidden) ? 'disabled':''} data-popup-width="${popupSize.width}" data-popup-height="${popupSize.height}">
                        <div class="icon material-symbols-outlined">${tool.icon}</div>
                        <div class="context">
                            <div class="name">${tool.name}</div>
                            <div class="desc">${tool.desc}</div>
                        </div>
                    </button>
                `);
                count++;
            });
            content.push(`</div>`);
            if (count === 0) content.splice(-3);
        });
        _id('main').innerHTML = `
            <div id="content">
                <div class="notice" style="margin-bottom: 15px">
                    <p>If you use Discord, consider checking out <a href="https://cybot.simplecyber.org">Cybot</a>, a bot which has commands for most of these tools and more!</p>
                </div>
                <label class="selectOption">
                    <input type="checkbox" id="launchInPopup">
                    <div class="innerLabel">
                        Launch tools as popups by default
                        <small>Or hold shift while clicking a tool to open it in a popup</small>
                    </div>
                </label>
                ${content.join('')}
                <div style="height: 15px"></div>
                <h5 style="text-align: center"><a target="_blank" href="https://github.com/CyberGen49/cyber-toolbox/issues/new?assignees=CyberGen49&labels=enhancement&template=tool-request.md&title=%5BTool+Request%5D">I have an idea for a new tool...</a></h5>
            </div>
        `;
        _id('launchInPopup').checked = settings.launchInPopup | false;
        _id('launchInPopup').addEventListener('change', () => {
            settings.launchInPopup = _id('launchInPopup').checked;
            localStorageObjSet('settings', settings);
        });
        [..._class('toolCard')].forEach((el) => {
            el.addEventListener('click', (e) => {
                if (e.shiftKey || settings.launchInPopup)
                    window.open(`/tool/${el.dataset.id}/tool.html`, `popup-${el.dataset.id}`, `left=${(screen.availWidth/2)-(el.dataset.popupWidth/2)},top=${(screen.availHeight/2)-(el.dataset.popupHeight/2)},width=${el.dataset.popupWidth},height=${el.dataset.popupHeight}`);
                else
                    updatePage(`/${el.dataset.id}`);
            });
        });
        document.title = baseTitle;
    }
    await sleep(200);
    _id('main').style.opacity = 1;
    _id('main').style.transform = '';
}
window.addEventListener('popstate', () => {
    updatePage(undefined, true);
});

window.addEventListener('load', () => {
    updatePage();
    _id('home').addEventListener('click', () => {
        updatePage('/');
    });
    _id('github').addEventListener('click', () => {
        window.open('https://github.com/CyberGen49/cyber-toolbox', '_blank');
    });
    if (isRedirected) showPopup(`The tools have moved`, `
        <p>Hey, it looks like you tried to access a tool on SimpleCyber.org!</p>
        <p>SimpleCyber.org was recently rebuilt from scratch, and all tools were removed, so you've been redirected to the new, dedicated tools site, Cyber's Toolbox!</p>
        <p>Not all tools that were previously available on SimpleCyber.org are in Cyber's Toolbox yet, but they should appear soon.</p>
    `, [{
        label: 'Okay',
        primary: true
    }]);
});
window.addEventListener('message', (e) => {
    switch (e.data.action) {
        case 'scrollHeight':
            _id('toolFrame').style.height = `${e.data.height}px`;
            break;
    }
});

document.addEventListener('scroll', () => {
    if (window.scrollY > 0) _id('topbar').classList.add('scrolled');
    else _id('topbar').classList.remove('scrolled');
});