(function(){
	var thisElement = document.querySelector(`script[src="${SalaMuseoGames.site.baseurl}/assets/js/software-embed.js"]`);
	var data = SalaMuseoGames.page.software_data;
	var platform = data.platform;
	var core = data.platform;
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
			frameElement.outerHTML = `<div style="width:640px; height:480px; max-width:100%">
				<div id="software-embed-frame"></div>
			</div>`;
			thisElement.parentElement.appendChild(frameElement);
			thisElement.innerHTML = '';
			thisElement.src = EJS_pathtodata+'loader.js';
		break;
		case 'standalone':
			thisElement.outerHTML = `<iframe id="software-embed-frame" src=""></iframe>`;
		break;
	}
})();