(function(){

return // TODO finish

var Prefs = SalaMuseoGames.Prefs;

if (Prefs.pwaManifests.value) {
  var manifestData;
  if (Prefs.softwarePwaManifests.value && SalaMuseoGames.page.software_data) {
    // TODO add individual manifests on games pages
  } else {
    // TODO add site manifest on global pages
  }
  var manifestElem = document.createElement('link');
  manifestElem.rel = 'manifest';
  manifestElem.href = 'data:application/manifest+json;utf8,' + encodeURIComponent(JSON.stringify(manifestData));
  document.head.appendChild(manifestElem);
}

})();
