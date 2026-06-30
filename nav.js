/* nav.js — auto-collapse the mobile nav drawer after a link is tapped
   ----------------------------------------------------------------
   The mobile menu is a CSS checkbox-hack: #nav-toggle (a hidden
   checkbox) drives `.nav__mobile-menu` via the :checked selector.
   Tapping a link inside the drawer would otherwise leave the toggle
   checked, so the menu stays open over the page you just jumped to.
   This unchecks the toggle on link clicks so the drawer closes.

   Only anchors inside .nav__mobile-menu close it — the theme and
   language buttons are <button>s and are intentionally left out so
   you can switch theme/language without the drawer snapping shut.
   ---------------------------------------------------------------- */
(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  if (!toggle) return;

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('.nav__mobile-menu a') : null;
    if (link) {
      toggle.checked = false;
    }
  });
})();
