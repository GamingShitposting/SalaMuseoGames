(function(){

var prefsIndex = 'SalaMuseoGames/Prefs/v1';

var Prefs = window.SalaMuseoGames.Prefs = {
  softwarePwaManifests: { default: true, /* dependsOn: "pwaManifests", */ name: "Allow installing individual games as PWAs" },
  pwaManifests: { default: false, name: "Allow installing the site home itself as a PWA" },
  offlineCache: { default: true, name: "Cache site pages and game files offline", summary: "Allow faster site navigation, and gameplay without an Internet connection, by caching unlimited data offline. Disable if you want to save storage. (Note that data for some emulators and games is always cached regardless of this setting; you can only manage their data when they show an option in their interface.)" },
  dataExport: { onclick: (function(){
    var data = { localStorage, indexedDB: {} };
    var dbs = ["EmulatorJS-core", "/data/saves", "/home/web_user/.renpy"];
    dbs.forEach(function(db){
      indexedDB.open(db).onsuccess = (function(event){
        idbBackupAndRestore.exportToJson(event.target.result).then(function(json){
          data.indexedDB[db] = json;
          if (Object.keys(data.indexedDB).length === dbs.length) {
            var anchorElem = SMG.Util.makeElement('a', {
              hidden: true, download: 'SalaMuseoGames-Export.json',
              href: URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' })),
            });
            document.body.appendChild(anchorElem);
            anchorElem.click();
            document.body.removeChild(anchorElem);
          }
        });
      });
    });
  }), section: "data", name: "Export site configuration and game saves", summary: "(Currently a beta, not all saves might be exported! Import feature coming soon.)" },
  // dataImport: { onclick: (function(){}), section: "data", name: "Import site configuration and game saves" },
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
