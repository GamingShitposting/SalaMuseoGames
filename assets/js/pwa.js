(function(){

var Prefs = SalaMuseoGames.Prefs;
var Software = SalaMuseoGames.page.software_data;
var Screen = (Software && Software.screen);
var Site = SalaMuseoGames.site;

if (Prefs.pwaManifests.value) {
  var manifestData;
  if (Prefs.softwarePwaManifests.value && Software) {
    // specific manifests on games pages
    manifestData = {
      name: document.querySelector('.post-title').textContent,
      description: document.querySelector('.post-subtitle').textContent,
      start_url: (location.href + ''), // TODO Url parameters to make the game open fullscreen and automatically start
      display: ((Screen && Screen.display) || "standalone"),
      orientation: ((Screen && Screen.orientation) || "any"),
    };
  } else {
    // site manifest on global pages
    var ldData;
    for (var elem of document.querySelectorAll('script[type="application/ld+json"]')) {
      // extract site data from JSON-LD data blocks
      var data = JSON.parse(elem.innerHTML);
      if (data['@type'] === 'Organization') {
        ldData = data;
        break;
      };
    }
    manifestData = {
      name: ldData.name,
      description: ldData.description,
      start_url: (Site.url + Site.baseurl),
      display: "standalone",
    };
  }
  manifestData = Object.assign(manifestData, {
    scope: location.href,
    background_color: (Software && Software.background_color || getComputedStyle(document.body).backgroundColor),
    icons: [{
      src: (SalaMuseoGames.page.icon || (Site.url + Site.baseurl + '/assets/img/icons/mediumtile.png')),
      sizes: "any",
      purpose: "any",
    }],
  });
  var manifestElem = document.createElement('link');
  manifestElem.rel = 'manifest';
  manifestElem.href = ('data:application/manifest+json;utf8,' + encodeURIComponent(JSON.stringify(manifestData)));
  document.head.appendChild(manifestElem);
}

if (Prefs.offlineCache.value) {
  navigator.serviceWorker.register('/SalaMuseoGames-ServiceWorker.js');
}

})();
