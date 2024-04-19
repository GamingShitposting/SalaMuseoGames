(function(){

var Prefs = SalaMuseoGames.Prefs;
var Software = SalaMuseoGames.page.software_data;
var Screen = (Software && Software.screen);
var Site = SalaMuseoGames.site;
var iconUrl = SalaMuseoGames.page.icon;
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

if (Prefs.pwaManifests.value) {
  var manifestData;
  if (Prefs.softwarePwaManifests.value && Software) {
    // specific manifests on games pages
    var pageUrl = (location.href + ''); // TODO Url parameters to make the game open fullscreen and automatically start
    manifestData = {
      name: document.querySelector('.post-title').textContent,
      description: document.querySelector('.post-subtitle').textContent,
      start_url: pageUrl,
      scope: pageUrl,
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
      start_url: sitePath,
      scope: sitePath,
      display: "standalone",
    };
  }
  manifestData = Object.assign(manifestData, {
    scope: location.href,
    background_color: (Software && Software.background_color || getComputedStyle(document.body).backgroundColor),
    icons: [{
      src: (iconUrl ? absoluteUrlFromRelative(iconUrl) : (sitePath + '/assets/img/icons/mediumtile.png')),
      sizes: "any",
      purpose: "any",
    }],
  });
  var manifestElem = document.createElement('link');
  manifestElem.rel = 'manifest';
  manifestElem.href = ('data:application/manifest+json;utf8,' + encodeURIComponent(JSON.stringify(manifestData)));
  document.head.appendChild(manifestElem);
}

if (Prefs.offlineCache.value && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/ServiceWorker.js', { scope: "/SalaMuseoGames/" });
}

})();
