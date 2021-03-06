document.addEventListener('DOMContentLoaded', () => {
    const ipcRenderer = require('electron').ipcRenderer;
    const DiscordRPC = require('discord-rpc');
    const ClientId = '460456226090778634';
    let discord = false;
    const rpc = new DiscordRPC.Client({ transport: 'ipc' });
    let last = ['owo', {}];

    ipcRenderer.on('media', (event, store) => {
        console.log('key:', store);
        if (store === 'nextTrack') {
            document.getElementsByClassName('next-button')[0].click();
        } else if (store === 'previousTrack') {
            document.getElementsByClassName('previous-button')[0].click();
        } else if (store === 'playPause') {
            document.getElementsByClassName('play-pause-button')[0].click();
        } else {
            console.log('unhandled key');
        }
    });

    const API = document.getElementsByClassName('ytmusic-app')[3].playerApi_;

    API.addEventListener('onStateChange', (a) => {
        const data = API.getVideoData();
        const curTime = API.getCurrentTime();
        // const lengh = API.getDuration();
        const now = Date.now() / 1000;

        if (!data.author || !data.title || !data.video_id) { return console.log('invalid state'); }
        const act = {
            largeImageKey: 'large_logo',
            // smallImageKey: 'small_logo',
            details: `${data.author} - ${data.title}`,
            state: `youtu.be/${data.video_id}`,
            type: 'WATCHING',
            startTimestamp: Math.round(now - curTime),
        };
        last[1] = act;
    });

    API.addEventListener('onReady', () => console.log('onReady'));

    function updateDiscord() {
        if (!last[1].state) { return console.log('no data!'); }
        if (last[0] === last[1].state) { return console.log('dont update'); }
        last[0] = last[1].state;
        rpc.setActivity(last[1]);
        console.log(`discord presence updated`);
    }

    rpc.on('ready', () => {
        console.log('discord detected!');
        if (discord) { return; }
        discord = true;

        setInterval(() => {
            updateDiscord();
        }, 15000);
    });
    rpc.login(ClientId).catch(console.error);
}, false);
