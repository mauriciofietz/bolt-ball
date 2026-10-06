/* Bolt Ball: escolhe o idioma da pagina (en, pt, es, fr, de). Ordem: #idioma na URL > escolha salva > idioma do aparelho > en.
   Roda no <head> (sem defer) para nao piscar os idiomas. Sem JS, a pagina mostra todos, um abaixo do outro. */
(function () {
  var LANGS = ['en', 'pt', 'es', 'fr', 'de'];
  var HTML_LANG = { en: 'en', pt: 'pt-BR', es: 'es', fr: 'fr', de: 'de' };
  var root = document.documentElement;

  function fromHash() {
    var h = (location.hash || '').replace('#', '').split('-')[0];
    return LANGS.indexOf(h) >= 0 ? h : null;
  }
  function saved() {
    try {
      var s = localStorage.getItem('boltball.lang');
      return LANGS.indexOf(s) >= 0 ? s : null;
    } catch (e) {
      return null;
    }
  }
  function device() {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      // so o idioma principal: "fr-CA" -> fr, "de-AT" -> de, "pt-PT" -> pt
      var l = String(list[i]).toLowerCase().split(/[-_]/)[0];
      if (LANGS.indexOf(l) >= 0) return l;
    }
    return 'en';
  }

  function apply(l, remember) {
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', HTML_LANG[l]);
    var t = root.getAttribute('data-title-' + l);
    if (t) document.title = t;
    if (remember) {
      try {
        localStorage.setItem('boltball.lang', l);
      } catch (e) {
        /* sem armazenamento: so nao lembra */
      }
    }
    var links = document.querySelectorAll('.langs a');
    for (var i = 0; i < links.length; i++) links[i].setAttribute('aria-current', links[i].getAttribute('data-set') === l ? 'true' : 'false');
    // links internos levam o idioma junto
    var inner = document.querySelectorAll('a[data-keep]');
    for (var j = 0; j < inner.length; j++) {
      var base = inner[j].getAttribute('href').split('#')[0];
      inner[j].setAttribute('href', base + '#' + l);
    }
  }

  function scrollToHash() {
    var id = (location.hash || '').slice(1);
    if (!id || LANGS.indexOf(id) >= 0) return;
    var el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'DETAILS') el.open = true;
    el.scrollIntoView();
  }

  apply(fromHash() || saved() || device(), !!fromHash());

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-lang'), false);
    scrollToHash();
  });
  window.addEventListener('hashchange', function () {
    var l = fromHash();
    if (l) {
      apply(l, true);
      scrollToHash();
    }
  });
})();
