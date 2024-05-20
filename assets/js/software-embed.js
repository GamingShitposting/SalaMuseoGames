(function(){

var bin1Path = 'https://gamingshitposting.github.io/ext-bin-1';
var thisElement = document.querySelector(`script[src="${SalaMuseoGames.site.baseurl}/assets/js/software-embed.js"]`);
var data = SalaMuseoGames.page.software_data;
var platform = data.platform;
var core = data.core;
var backend = data.backend;
var romUrl = (data.rom_url || `${bin1Path}/roms/${data.rom_index}.7z`);
var frameUrl = (data.frame_url || `${bin1Path}/${data.frame_index}`);

function button (name, onclick) { return `<button name="${name.split(' ')[0]}" onclick="(${onclick})(this)">${name}</button>` }

var buttonEnlarge = button('Enlarge ↔️', function(){
	document.body.classList[
		!document.body.className.split(' ').includes('cinema-view') ? 'add' : 'remove'
	]('cinema-view');
});

function diyEmbedHtml (frameUrl) { return (
	button('Focus 🔳️', function(ctx){
		ctx.parentElement.scrollIntoView();
		ctx.parentElement.querySelector('iframe#software-embed-frame').focus();
	}) + ' ' +
	button('Fullscreen 🖼️', function(ctx){
		ctx.parentElement.querySelector('iframe#software-embed-frame').requestFullscreen();
	}) + ' ' +
	buttonEnlarge + ' ' +
	button('Reload ♻️', function(ctx){
		var frame = ctx.parentElement.querySelector('iframe#software-embed-frame');
		var src = frame.src;
		frame.src = '';
		frame.src = src;
	}) + ' ' +
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
		window.EJS_pathtodata = 'https://gamingshitposting.github.io/ext-bin-1/EmulatorJS/data/';
		window.EJS_core = (core || platform);
		window.EJS_gameUrl = romUrl;
		window.EJS_screenRecording = { videoBitrate: 150000000 };
		thisElement.parentElement.appendChild(SMG.Util.elementFromHtml(buttonEnlarge));
		thisElement.parentElement.appendChild(SMG.Util.makeElement('div', {
			style: 'width: 640px; height: 480px; max-width: 100%;',
			innerHTML: '<div id="software-embed-frame"></div>',
		}));
		document.body.appendChild(SMG.Util.makeElement('script', { src: `${EJS_pathtodata}loader.js` }));
	break;
	case 'standalone':
		var frameUrl = '';
		if (platform === 'nds' || core === 'desmume') {
			frameUrl = `https://octospacc.gitlab.io/Web-Archives-Misc/Repo/DeSmuME/#RomUrl=${romUrl}`;
		}
		else if (platform === 'dos') {
			frameUrl = `https://gamingshitposting.github.io/ext-bin-1/dos.zone/${data.rom_index}/index.html`;
		}
		thisElement.outerHTML = diyEmbedHtml(frameUrl);
	break;
}

})();
