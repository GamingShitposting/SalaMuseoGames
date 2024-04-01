(function(){

var Prefs = SalaMuseoGames.Prefs;

if (Prefs.pwaManifests.value) {
  var manifestData;
  // TODO add site manifest on global pages
  if (Prefs.softwarePwaManifests.value /* && onGamePage */) {
    // TODO add individual manifests on games pages
  } else {
  }
  var manifestElem = document.createElement('link');
  manifestElem.rel = 'manifest';
  manifestElem.href = '' + encodeURIComponent(JSON.stringify(manifestData));
  document.head.appendChild(manifestElem);
}

})();