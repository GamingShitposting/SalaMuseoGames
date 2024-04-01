(function(){

var prefsIndex = 'SalaMuseoGames/Prefs/v1';

var Prefs = {
  pwaManifests: { default: true, name: "Allow installing the site as a PWA" },
  softwarePwaManifests: { default: true, dependsOn: "pwaManifests", name: "Allow installing individual games as PWAs" },
  // featurePreview: { default: false, name: "Use experimental features before their release", summary: "If some new site features or adjustments are scheduled to release soon, you might be chosen to preview them before they are officially available" },
  developerMode: { default: false, name: "Developer Mode", summary: "Show options and enable features dedicated to developers" },
  allowDownloads: { default: false, section: "developer", name: "Allow downloads where available" },
};

function SavePrefs () {
  var items = {};
  Object.keys(Prefs).forEach(function(key){
    items[key] = Prefs[key].value;
  });
  localStorage.setItem(prefsIndex, items);
}

var storedPrefs = JSON.parse(localStorage.getItem(prefsIndex) || {});
Object.keys(Prefs).forEach(function(key){
  var storedValue = storedPrefs[key];
  Prefs[key].value = (storedValue !== undefined ? storedValue : Prefs[key].default);
}):

var PrefsSections = {
  developer: { name: "Developer", visible: Prefs.developerMode.value },
};

if (ConfigurationCustomizerElem) {
  var rootElem = ConfigurationCustomizerElem;
  rootElem.innerHTML = null;
  Object.keys(Prefs).forEach(function(key){
  // TODO: finish HTML
    var pref = Prefs[key];
    var prefElem = document.createElement('p');
    prefElem.innerHTML += `<label><input type="checkbox" ${pref.value && 'checked'} disabled/> ${pref.name}</label><br/><small>${pref.summary}</small>`;
    rootElem.appendChild(prefElem);
  });
}

window.SalaMuseoGames.Prefs = Prefs;

})();