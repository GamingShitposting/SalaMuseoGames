(function(){

var prefsIndex = 'SalaMuseoGames/Prefs/v1';

var Prefs = {
  pwaManifests: { default: true, name: "Allow installing the site as a PWA" },
  softwarePwaManifests: { default: true, dependsOn: "pwaManifests", name: "Allow installing individual games as PWAs" },
  // offlineCache: { default: true, name: "Cache site pages and game files offline", summary: "Allow faster site navigation, and gameplay without an Internet connection, by caching unlimited data offline. Disable if you want to save storage. (Note that game data for some emulators is always cached regardless of this setting, you can manage their data from their embedded UI.)" },
  // dataExport: { onclick: (function(){}), section: "data", name: "Export configuration and gamesaves" },
  // dataImport: { onclick: (function(){}), section: "data", name: "Import configuration and gamesaves" },
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
    styleElem.innerHTML += `#ConfigurationCustomizerElem > ul[data-section="${key}"]:before { content: "${(section && section.name) || ''}" }`;
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

window.SalaMuseoGames.Prefs = Prefs;
SavePrefs();

})();
