(function(){

var SMG = SalaMuseoGames;
var Prefs = SMG.Prefs;
var Software = SMG.page.software_data;
var Screen = (Software && Software.screen);
var Site = SMG.site;
var iconUrl = SMG.page.icon;
var coverUrl = SMG.page.image;
var sitePath = (Site.url + Site.baseurl);

function absoluteUrlFromRelative (url) {
  if (url.startsWith('/')) {
    return (sitePath + url);
  } else if (url.startsWith('./') || url.startsWith('../')) {
    return (location.href + url);
  } else {
    return url;
  }
}

if (Prefs.pwaManifests.value || Prefs.softwarePwaManifests.value) {
  var manifestData = {};
  if (Prefs.softwarePwaManifests.value && Software) {
    // specific manifests on games pages
    var pageUrl = (location.href + '?pwaLaunch=1'); // TODO Url parameters to make the game open fullscreen and automatically start
    manifestData = {
      name: document.querySelector('.post-title').textContent,
      description: document.querySelector('.post-subtitle').textContent,
      start_url: pageUrl,
      scope: pageUrl,
      display: ((Screen && Screen.display) || "standalone"),
      orientation: ((Screen && Screen.orientation) || "any"),
    };
  } else if (Prefs.pwaManifests.value) {
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
      start_url: (sitePath + '/'),
      scope: (sitePath + '/'),
      display: "standalone",
    };
  }
  manifestData = Object.assign(manifestData, {
    background_color: (Software && Software.background_color || getComputedStyle(document.body).backgroundColor),
    icons: [{
      src: ((iconUrl || coverUrl) ? absoluteUrlFromRelative(iconUrl || coverUrl) : (sitePath + '/assets/img/icons/mediumtile.png')),
      sizes: "any",
      purpose: "any",
    }],
  });
  document.head.appendChild(SMG.Util.makeElement('link', {
    rel: 'manifest', href: ('data:application/manifest+json;utf8,' + encodeURIComponent(JSON.stringify(manifestData))),
  }));
}

if ('serviceWorker' in navigator) {
  var cachingScopes = ['SalaMuseoGames', 'ext-bin-1'];
  if (Prefs.offlineCache.value) {
    cachingScopes.forEach(function(scope){
      navigator.serviceWorker.register('/ServiceWorker.js', { scope: `/${scope}/` });
    });
  } else {
    navigator.serviceWorker.getRegistrations().then((workers) => {
      for (var worker of workers) {
        if (cachingScopes.includes(worker.scope.split('/').slice(-2)[0])) {
          worker.unregister();
        }
      }
    });
  }
}

})();
