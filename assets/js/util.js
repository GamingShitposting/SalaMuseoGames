(function(){

var Util = window.SalaMuseoGames.Util = {};

Util.makeElement = (function(tag, attrs){
  return Object.assign(document.createElement(tag), attrs);
});

Util.elementFromHtml = (function(html){
  return Util.makeElement('div', { innerHTML: html.trim() }).children[0];
});

Util.useTempElement = (function(elem, callback){
  Object.assign(elem, { hidden: true });
  document.body.appendChild(elem);
  callback(elem);
  document.body.removeChild(elem);
});

})();
