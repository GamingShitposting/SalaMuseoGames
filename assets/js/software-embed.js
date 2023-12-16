(function(){
	var thisElement = document.querySelector(`script[src="${SalaMuseoGames.site.baseurl}/assets/js/software-embed.js"]`);
	var data = SalaMuseoGames.page.software_data;
	var platform = data.platform;
	var core = data.core;
	var backend = data.backend;
	var romUrl = (data.rom_url || 'https://gamingshitposting.github.io/ext-bin-1/roms/'+data.rom_index+'.7z');
	
	// set any overrides if specified ...
	
	switch (backend)
	{
		default:
		case 'cuttingedge':
		case 'emulatorjs':
			window.EJS_player = '#software-embed-frame';
			window.EJS_pathtodata = 'https://gamingshitposting.github.io/ext-bin-1/EmulatorJS/data/';
			window.EJS_core = (core || platform);
			window.EJS_gameUrl = romUrl;
			window.EJS_screenRecording = { videoBitrate: 150000000 };
			var frameElement = document.createElement('div');
			frameElement.style = 'width: 640px; height: 480px; max-width: 100%;';
			frameElement.innerHTML = '<div id="software-embed-frame"></div>';
			thisElement.parentElement.appendChild(frameElement);
			var scriptElement = document.createElement('script');
			scriptElement.src = EJS_pathtodata+'loader.js';
			document.body.appendChild(scriptElement);
		break;
		case 'standalone':
			var frameUrl = '';
			if (platform === 'nds' || core === 'desmume') {
				frameUrl = `https://octospacc.gitlab.io/Web-Archives-Misc/Repo/DeSmuME/#RomUrl=${romUrl}`;
			}
			else if (platform === 'dos') {
				frameUrl = `https://gamingshitposting.github.io/ext-bin-1/dos.zone/${data.rom_index}/index.html`;
			}
			thisElement.outerHTML = `
			<button onclick="(function(ctx){
				ctx.parentElement.scrollIntoView();
				ctx.parentElement.querySelector('iframe#software-embed-frame').focus();
			})(this)">Focus</button>
			<iframe id="software-embed-frame" src="${frameUrl}"></iframe>`;
		break;
	}
})();