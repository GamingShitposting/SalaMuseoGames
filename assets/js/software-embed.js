(function(){

var bin1Path = 'https://gamingshitposting.github.io/ext-bin-1';
var thisElement = document.querySelector(`script[src="${SalaMuseoGames.site.baseurl}/assets/js/software-embed.js"]`);
var data = SalaMuseoGames.page.software_data;
var platform = data.platform;
var core = data.core;
var backend = data.backend;
var frameUrl = (data.frame_url || `${bin1Path}/${data.frame_index}`);

function romUrl (suffix) { return (data.rom_url || `${bin1Path}/roms/${data.rom_index}${suffix || ''}`) }

function makeButton (name, onclick) { return `<button name="${name.split(' ')[0]}" onclick="(${onclick})(this, this.parentElement.parentElement)">${name}</button>` }

function controlsHtml (picks) { return ( '<span class="software-embed-controls">' +
	(picks.all || picks.focus ? makeButton('Focus 🔳️', function(button, wrapper){
		wrapper.scrollIntoView();
		var iframe = wrapper.querySelector('iframe#software-embed-frame');
		if (iframe) {
			iframe.focus();
		} else {
			var articleStyle = document.querySelector('section.post > article').style;
			if (wrapper.style.length === 0) {
				articleStyle.zIndex = 10;
				wrapper.style = 'z-index: 1; position: fixed; top: 0; margin-top: 0; background: black; height: 100vh; left: 0;';
				document.body.style.overflowY = 'hidden';
				button.textContent = 'Unfocus 🔳️';
			} else {
				document.body.style.overflowY = wrapper.style = articleStyle.zIndex = null;
				button.textContent = 'Focus 🔳️';
			}
		}
	}) + ' ' : '') +
	(picks.all || picks.fullscreen ? makeButton('Fullscreen 🖼️', function(button, wrapper){
		var iframe = wrapper.querySelector('iframe#software-embed-frame')
		iframe.requestFullscreen();
		iframe.focus();
	}) + ' ' : '') +
	(picks.all || picks.enlarge ? makeButton('Enlarge ↔️', function(button){ document.body.classList[
		!document.body.className.split(' ').includes('cinema-view')
			? (button.textContent = 'Shrink ↔️', 'add') : (button.textContent = 'Enlarge ↔️', 'remove')
	]('cinema-view') }) + ' ' : '') +
	(picks.all || picks.reload ? makeButton('Reload ♻️', function(button, wrapper){
		var frame = wrapper.querySelector('iframe#software-embed-frame');
		var src = frame.src;
		frame.src = '';
		setTimeout(function(){ frame.src = src }, 33); // timeout to work around a bug where the frame remains blank
	}) + ' ' : '') + '</span>'
) }

function diyEmbedHtml (frameUrl) { return (controlsHtml({ all: true }) +
	`<iframe id="software-embed-frame" class="software-embed-frame" src="${frameUrl}"></iframe>`
) }

// TODO set any overrides if specified ...

if (platform === 'web') {
	thisElement.outerHTML = diyEmbedHtml(frameUrl);
} else switch (backend) {
	default:
	case 'cuttingedge':
	case 'emulatorjs':
		window.EJS_player = '#software-embed-frame';
		window.EJS_pathtodata = `${bin1Path}/EmulatorJS/data/`;
		window.EJS_core = (core || platform);
		window.EJS_gameUrl = romUrl('.7z');
		window.EJS_screenRecording = { videoBitrate: 150000000 };
		thisElement.parentElement.appendChild(SMG.Util.elementFromHtml(controlsHtml({ focus: true, enlarge: true })));
		thisElement.parentElement.appendChild(SMG.Util.makeElement('div', {
			className: 'software-embed-container',
			style: 'width: 640px; height: 480px; max-width: 100%;',
			innerHTML: '<div id="software-embed-frame"></div>',
		}));
		document.body.appendChild(SMG.Util.makeElement('script', { src: `${EJS_pathtodata}loader.js` }));
	break;
	case 'standalone':
		var frameUrl = '';
		if (platform === 'nds' || core === 'desmume') {
			frameUrl = `https://octospacc.gitlab.io/Web-Archives-Misc/Repo/DeSmuME/#RomUrl=${romUrl()}`;
		} else if (platform === 'dos') {
			frameUrl = `${bin1Path}/dos.zone/${data.rom_index}/index.html`;
		} else if (platform === 'pc98' || core === 'np2') {
			frameUrl = `${bin1Path}/runtime/np2-emularity/index.html#rom=${romUrl('.zip')}`;
		}
		thisElement.outerHTML = diyEmbedHtml(frameUrl);
	break;
}

})();
