
import fs from 'fs';
import path from 'path';
import http from 'http';
import mime from 'mime';
import clc from 'cli-color';
import parseHtml from 'node-html-parser';
import isPortReachable from 'is-port-reachable';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.chdir(__dirname);

let initData;
const getInitData = (() => {
    const toolDirs = fs.readdirSync('./tools');
    const toolGroups = JSON.parse(fs.readFileSync('./tools/groups.json', 'utf-8'));
    let data = { tools: [], groups: toolGroups }
    toolDirs.forEach((dir) => {
        if (dir.match(/\./g)) return;
        let tool = JSON.parse(fs.readFileSync(`./tools/${dir}/meta.json`));
        tool.id = dir;
        data.tools.push(tool);
    });
    initData = data;
    return data;
});
getInitData();

const web = http.createServer(async(req, res) => {
    const reqPath = path.normalize(req.url.split('?')[0]);
    const reqPathSplit = reqPath.split('/').filter(String);
    const params = new URLSearchParams(req.url.split('?')[1]);
    const ip = req.headers['cf-connecting-ip'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'] || '';
    let isEnded = false;
    const logRequest = (code) => {
        console.log(clc.cyanBright(ip), clc.yellowBright(req.method), clc.yellow(code), clc.greenBright(req.url));
    }
    const end = (body = null, code = 200) => {
        if (isEnded) return;
        isEnded = true;
        logRequest(code);
        res.statusCode = code;
        return res.end(body);
    }
    const endStream = (stream, code = 200) => {
        isEnded = true;
        logRequest(code);
        stream.pipe(res);
        stream.on('close', () => {
            end(code);
        });
        stream.on('error', () => {
            end(`500 Internal Server Error`, 500);
        });
    }
    switch (reqPathSplit[0]) {
        case 'assets':
            const filePath = path.join('.', reqPath);
            if (fs.existsSync(filePath)) {
                if (fs.statSync(filePath).isDirectory())
                    return end(`403 Access Denied`, 403);
                res.setHeader('Content-Type', mime.getType(filePath));
                const stream = fs.createReadStream(filePath);
                return endStream(stream);
            } else {
                return end(`404 Not Found`, 404);
            }
        case 'get':
            switch (reqPathSplit[1]) {
                case 'init':
                    res.setHeader('Content-Type', 'application/json');
                    return end(JSON.stringify(getInitData()));
                case 'ip':
                    res.setHeader('Content-Type', 'application/json');
                    return end(JSON.stringify({ ip: ip }));
                case 'portCheck':
                    res.setHeader('Content-Type', 'application/json');
                    if (!params.get('host') || !params.get('port'))
                        return end(JSON.stringify({ status: 'fail' }));
                    const isOpen = await isPortReachable(parseInt(params.get('port')), { host: params.get('host') });
                    if (isOpen)
                        return end(JSON.stringify({ status: 'open' }));
                    else
                        return end(JSON.stringify({ status: 'closed' }));
                default:
                    return end(`404 Not Found`, 404);
            }
        case 'tool':
            initData.tools.forEach((tool) => {
                if (reqPathSplit[1] == tool.id) {
                    const filePath = `./tools/${tool.id}/${reqPathSplit[2]}`;
                    if (fs.existsSync(filePath)) {
                        res.setHeader('Content-Type', mime.getType(filePath));
                        if (filePath.match(/tool\.html$/)) {
                            const document = parseHtml.parse(fs.readFileSync('./tools/base.html', 'utf-8'));
                            document.getElementsByTagName('head')[0].innerHTML += `<title>${tool.name}</title>`;
                            document.getElementById('content').innerHTML = fs.readFileSync(filePath, 'utf-8');
                            return end(document.toString());
                        }
                        const stream = fs.createReadStream(filePath);
                        return endStream(stream);
                    }
                }
            });
            return end(`404 Not Found`, 404);
        default:
            res.setHeader('Content-Type', 'text/html');
            let document = parseHtml.parse(fs.readFileSync('./app/app.html', 'utf-8'));
            let title = `Cyber's Toolbox`;
            let desc = `A growing collection of useful tools to make your life a bit easier.`;
            initData.tools.forEach((tool) => {
                if (reqPathSplit[0] == tool.id) {
                    title = tool.name;
                    desc = tool.desc;
                }
            });
            let themeColour = `#1c1d21`;
            if (ua.toLowerCase().match(/discordbot/g))
                themeColour = `#f2a6d9`;
            document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
                <meta property="og:title" content="${title}">
                <meta name="description" content="${desc}">
                <meta name="theme-color" content="${themeColour}">
                <meta property="og:description" content="${desc}">
            `);
            return end(document.toString());
    }
});

web.listen(8689);
web.on('listening', () => {
    console.log(`HTTP server is ready`);
});