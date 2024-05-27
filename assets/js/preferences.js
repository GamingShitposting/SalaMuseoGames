(function(){

var prefsIndex = 'SalaMuseoGames/Prefs/v1';

var Prefs = window.SalaMuseoGames.Prefs = {
  softwarePwaManifests: { default: true, /* dependsOn: "pwaManifests", */ name: "Allow installing individual games as PWAs" },
  pwaManifests: { default: false, name: "Allow installing the site home itself as a PWA" },
  offlineCache: { default: true, section: "data", name: "Cache site pages and game files offline", summary: "Allow faster site navigation, and gameplay while offline, by caching unlimited data. Disable to save device storage. (Note: data for some emulators and games is always cached regardless of this setting; you can only manage their data in their interface if they show an option.)" },
  dataExport: { section: "data", name: "Export site configuration and game saves", onclick: (function(){
    async function makeDownloadObj (data) {
      var name = 'SalaMuseoGames-Export.json';
      var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      if ('CompressionStream' in window) {
        name += '.gz';
        blob = new Blob([await new Response(
          blob.stream().pipeThrough(new CompressionStream('gzip')),
        ).blob()], { type: 'application/gzip' });
      }
      return { download: name, href: URL.createObjectURL(blob) };
    }
    var data = { localStorage, indexedDB: {} };
    var dbs = ["EmulatorJS-core", "/data/saves", "/idbfs", "/home/web_user/.renpy"];
    dbs.forEach(function(db){
      indexedDB.open(db).onsuccess = (function(event){
        idbBackupAndRestore.exportToJson(event.target.result).then(async function(json){
          data.indexedDB[db] = json;
          if (Object.keys(data.indexedDB).length === dbs.length) {
            SMG.Util.useTempElement(SMG.Util.makeElement('a', (await makeDownloadObj(data))), function(elem){ elem.click() });
          }
        });
      });
    });
  }), summary: "This will download a file. (Currently a beta, not all saves may be exported!)" },
  dataImport: { section: "data", name: "Import site configuration and game saves", onclick: (function(){
    SMG.Util.useTempElement(SMG.Util.makeElement('input', { type: 'file', onchange: function(event){
      function alertFinish () { alert('Importing data completed!') }
      var file = event.target.files[0];
      var type = file.type.split('/')[1];
      var stream = file.stream();
      if (type === 'json');
      else if (type === 'gzip') {
        if ('CompressionStream' in window) {
          stream = stream.pipeThrough(new DecompressionStream('gzip'));
        } else {
          return alert('Compressed archives are not supported in this browser. Please decompress externally (via gzip or 7z) and then upload the extracted JSON file.');
        }
      } else {
        return alert('File type not recognized.');
      }
      new Response(stream).json().then(function(data){
        localStorage.clear();
        Object.assign(localStorage, data.localStorage);
        var dbsCount = Object.keys(data.indexedDB).length;
        var importedDbsCount = 0;
        if (dbsCount === 0) {
          return alertFinish();
        }
        Object.keys(data.indexedDB).forEach(function(db){
          indexedDB.open(db).onsuccess = (function(event){
            idbBackupAndRestore.clearDatabase(event.target.result).then(function(){
              idbBackupAndRestore.importFromJson(event.target.result, data.indexedDB[db]).then(function(){
                if (++importedDbsCount === dbsCount) {
                  alertFinish();
                }
              });
            });
          });
        });
      });
    }, accept: 'text/json,application/json,application/gzip' }), function(elem){ elem.click() });
  }), summary: "(Currently a beta, not all saves may be imported!)" },
  // featurePreview: { default: false, name: "Use experimental features before their release", summary: "If some new site features or adjustments are scheduled to release soon, you might be chosen to preview them before they are officially available" },
  developerMode: { default: false, name: "Developer Mode", summary: "Show options and enable features dedicated to developers" },
  allowDownloads: { default: false, section: "developer", name: "Allow downloads where available", summary: "Only for developers." },
};

function SavePrefs () {
  var items = {};
  Object.keys(Prefs).forEach(function(key){
    items[key] = Prefs[key].value;
  });
  localStorage.setItem(prefsIndex, JSON.stringify(items));
}

var storedPrefs = JSON.parse(localStorage.getItem(prefsIndex)) || {};
Object.keys(Prefs).forEach(function(key){
  var storedValue = storedPrefs[key];
  Prefs[key].value = (storedValue !== undefined ? storedValue : Prefs[key].default);
});

var PrefsSections = {
  data: { name: "Data management", visible: true },
  developer: { name: "Development", visible: Prefs.developerMode.value },
  // advanced: { name: "Advanced", visible: true },
};

var configElem = document.querySelector('#ConfigurationCustomizer');
if (configElem) {
  var styleElem = document.createElement('style');
  configElem.innerHTML = null;
  configElem.appendChild(styleElem);
  Object.keys(Object.assign({ default: null }, PrefsSections)).forEach(function(key){
    var section = PrefsSections[key];
    var sectionElem = document.createElement('ul');
    sectionElem.dataset.section = key;
    sectionElem.style.display = (section && !section.visible ? 'none' : '');
    styleElem.innerHTML += `#ConfigurationCustomizer > ul[data-section="${key}"]:before { content: "${(section && section.name) || ''}" }`;
    configElem.appendChild(sectionElem);
  });
  Object.keys(Prefs).forEach(function(key){
    var pref = Prefs[key];
    var prefElem = document.createElement('li');
    var prefType = (pref.default === undefined && pref.onclick ? 'button' : 'checkbox');
    prefElem.dataset.pref = key;
    prefElem.innerHTML += `<label>
      <input type="${prefType}" ${pref.value && 'checked'} value="${prefType === 'button' && pref.name}"/>
      ${prefType !== 'button' ? pref.name : ''}
      <br/><small>${pref.summary || ''}</small>
    </label>`;
    prefElem.querySelector('input').onclick = pref.onclick;
    prefElem.querySelector('input').onchange = function(){
      Prefs[key].value = this.checked;
      SavePrefs();
    };
    configElem.querySelector(`[data-section="${pref.section || 'default'}"]`).appendChild(prefElem);
  });
}

SavePrefs();

})();
