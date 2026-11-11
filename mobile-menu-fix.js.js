/* Funderstone mobile menu fix
 * Static (GitHub Pages) copy of an Elementor site: Elementor's menu JS / icon
 * font are not fully available, so the burger button and sub-menus do nothing
 * on mobile. This script replaces that behaviour with plain JS + CSS.
 * Include on EVERY page, just before </body>:
 *   <script src="/mobile-menu-fix.js"></script>
 */
(function () {
  var BP = 1024; // Elementor "dropdown-tablet" breakpoint

  var css = '' +
    'nav.fs-dd{display:none!important}' +
    '@media (max-width:' + BP + 'px){' +
    /* burger icon drawn with CSS (icon font is missing) */
    '.elementor-nav-menu--toggle .elementor-menu-toggle{display:flex!important;align-items:center;justify-content:center;width:44px;height:44px;padding:0!important;border:0!important;background:transparent!important;cursor:pointer;position:relative;color:#004E91;-webkit-tap-highlight-color:transparent}' +
    '.elementor-nav-menu--toggle .elementor-menu-toggle i,.elementor-menu-toggle svg{display:none!important}' +
    '.elementor-nav-menu--toggle .elementor-menu-toggle::before,.elementor-nav-menu--toggle .elementor-menu-toggle::after{content:"";position:absolute;left:10px;right:10px;height:2px;background:currentColor;transition:transform .2s,box-shadow .2s}' +
    '.elementor-nav-menu--toggle .elementor-menu-toggle::before{top:50%;margin-top:-1px;box-shadow:0 -8px 0 currentColor,0 8px 0 currentColor}' +
    '.elementor-nav-menu--toggle .elementor-menu-toggle::after{top:50%;margin-top:-1px;opacity:0}' +
    '.elementor-nav-menu--toggle .elementor-menu-toggle.fs-open::before{box-shadow:none;transform:rotate(45deg)}' +
    '.elementor-nav-menu--toggle .elementor-menu-toggle.fs-open::after{opacity:1;transform:rotate(-45deg)}' +
    /* dropdown panel */
    'nav.fs-dd.fs-open{display:block!important;position:fixed!important;left:0!important;right:0!important;width:100%!important;transform:none!important;max-height:none!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch;background:#fff!important;z-index:99999!important;box-shadow:0 8px 16px rgba(0,0,0,.15);margin:0!important}' +
    'nav.fs-dd ul{position:static!important;width:auto!important;height:auto!important;min-width:0!important;margin:0!important;padding:0!important;list-style:none;transform:none!important;opacity:1!important;visibility:visible!important;box-shadow:none!important;border:0!important;left:auto!important;top:auto!important}' +
    'nav.fs-dd li{display:block!important;width:100%!important;float:none!important;position:relative;border-bottom:1px solid #eee}' +
    'nav.fs-dd li a{display:block!important;padding:14px 56px 14px 20px!important;color:#222!important;font-size:16px!important;font-weight:500!important;line-height:1.4!important;text-decoration:none;white-space:normal!important;background:transparent!important}' +
    'nav.fs-dd li li a{padding-left:36px!important;font-size:15px!important;font-weight:400!important;background:#f7f7f7!important}' +
    'nav.fs-dd li li li a{padding-left:52px!important;background:#efefef!important}' +
    'nav.fs-dd .sub-menu{display:none!important}' +
    'nav.fs-dd li.fs-sub-open>.sub-menu{display:block!important}' +
    'nav.fs-dd .sub-arrow,nav.fs-dd .dropdown-menu-toggle{display:none!important}' +
    '.fs-sub-btn,.fs-sub-btn:hover,.fs-sub-btn:focus,.fs-sub-btn:active{position:absolute!important;right:0!important;top:0!important;width:52px!important;height:50px!important;padding:0!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;cursor:pointer;color:#004E91!important;-webkit-tap-highlight-color:transparent}' +
    '.fs-sub-btn::before{content:"";position:absolute;left:50%;top:50%;width:9px;height:9px;margin:-7px 0 0 -5px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);transition:transform .2s}' +
    'li.fs-sub-open>.fs-sub-btn::before{transform:rotate(-135deg);margin-top:-2px}' +
    '}' +
    '@media (min-width:' + (BP + 1) + 'px){.fs-sub-btn{display:none!important}}';

  function addStyle() {
    var s = document.createElement('style');
    s.id = 'fs-mobile-menu-fix';
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }

  function setupWidget(w) {
    var btn = w.querySelector('.elementor-menu-toggle');
    var nav = w.querySelector('nav.elementor-nav-menu--dropdown');
    if (!btn || !nav || btn.getAttribute('data-fs')) return;
    btn.setAttribute('data-fs', '1');
    nav.classList.add('fs-dd');
    document.body.appendChild(nav); // escape header stacking context

    // add an expand button to every item that has a sub-menu
    var parents = nav.querySelectorAll('li.menu-item-has-children');
    for (var i = 0; i < parents.length; i++) {
      var li = parents[i];
      var label = (li.querySelector('a') || {}).textContent || '';
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fs-sub-btn';
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-label', '展開 ' + label.trim());
      li.insertBefore(b, li.querySelector('.sub-menu'));
    }

    function place() {
      var r = btn.getBoundingClientRect();
      var hdr = btn.closest('header') || btn.closest('.elementor-section') || btn;
      var top = Math.max(hdr.getBoundingClientRect().bottom, r.bottom);
      nav.style.setProperty('top', top + 'px', 'important');
      nav.style.setProperty('max-height', (window.innerHeight - top) + 'px', 'important');
    }

    function setOpen(open) {
      btn.classList.toggle('fs-open', open);
      btn.classList.toggle('elementor-active', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('fs-open', open);
      nav.setAttribute('aria-hidden', open ? 'false' : 'true');
      var links = nav.querySelectorAll('a');
      for (var j = 0; j < links.length; j++) {
        if (open) links[j].removeAttribute('tabindex'); else links[j].setAttribute('tabindex', '-1');
      }
      if (open) place();
    }

    w._fsToggle = function () { setOpen(!nav.classList.contains('fs-open')); };
    w._fsClose = function () { setOpen(false); };
    w._fsPlace = function () { if (nav.classList.contains('fs-open')) place(); };
  }

  function init() {
    addStyle();
    var widgets = document.querySelectorAll('.elementor-widget-nav-menu.elementor-nav-menu--toggle');
    for (var i = 0; i < widgets.length; i++) setupWidget(widgets[i]);

    // capture phase: runs before (and blocks) any half-working Elementor / smartmenus handlers
    function handler(e) {
      if (window.innerWidth > BP) return;
      var t = e.target;
      var toggle = t.closest && t.closest('.elementor-nav-menu--toggle .elementor-menu-toggle');
      if (toggle) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        var w = toggle.closest('.elementor-widget-nav-menu');
        if (w && w._fsToggle) { e.preventDefault(); e.stopPropagation(); w._fsToggle(); }
        return;
      }
      if (e.type !== 'click') return;
      var subBtn = t.closest && t.closest('.fs-sub-btn');
      if (subBtn) {
        e.preventDefault(); e.stopPropagation();
        var li = subBtn.parentNode;
        var open = !li.classList.contains('fs-sub-open');
        li.classList.toggle('fs-sub-open', open);
        subBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        return;
      }
      var link = t.closest && t.closest('nav.fs-dd a');
      if (link) { e.stopPropagation(); return; } // let the link navigate normally
      // tap outside closes the menu
      if (!(t.closest && t.closest('nav.fs-dd'))) {
        var ws = document.querySelectorAll('.elementor-widget-nav-menu.elementor-nav-menu--toggle');
        for (var k = 0; k < ws.length; k++) if (ws[k]._fsClose) ws[k]._fsClose();
      }
    }
    document.addEventListener('click', handler, true);
    document.addEventListener('keydown', handler, true);

    function onResize() {
      var ws = document.querySelectorAll('.elementor-widget-nav-menu.elementor-nav-menu--toggle');
      for (var k = 0; k < ws.length; k++) {
        if (window.innerWidth > BP) { if (ws[k]._fsClose) ws[k]._fsClose(); }
        else if (ws[k]._fsPlace) ws[k]._fsPlace();
      }
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();