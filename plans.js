/* plans.js — dashboard plan demo (Free / Pro / Team)
   ----------------------------------------------------------------
   - Sets data-plan="free|pro|team" on <html>
   - Plan-scoped UI is shown/hidden purely by CSS via [data-plan-only]
     (so there is no flash); this script only handles interaction:
       * the in-page "Preview plan" switcher (.plan-switch__btn)
       * any upgrade/upsell control carrying [data-plan-set]
   - Persists the choice in localStorage ("dash-plan")
   - Reflects the active plan in the URL (?plan=) without a reload so
     the view can be deep-linked and shared
   - The early inline script in dashboard.html applies the initial
     plan before paint; this file keeps everything in sync afterwards
   ---------------------------------------------------------------- */
(function () {
  'use strict';

  var STORAGE_KEY = 'dash-plan';
  var VALID = ['free', 'pro', 'team'];

  function isValid(plan) {
    return VALID.indexOf(plan) !== -1;
  }

  function save(plan) {
    try { localStorage.setItem(STORAGE_KEY, plan); } catch (e) { /* ignore */ }
  }

  function current() {
    var p = document.documentElement.getAttribute('data-plan');
    return isValid(p) ? p : 'free';
  }

  // Keep the switcher's pressed state in sync for assistive tech. The
  // visible active styling is handled by CSS keyed off html[data-plan].
  function syncControls(plan) {
    var buttons = document.querySelectorAll('.plan-switch__btn');
    for (var i = 0; i < buttons.length; i++) {
      var setTo = buttons[i].getAttribute('data-plan-set');
      buttons[i].setAttribute('aria-pressed', setTo === plan ? 'true' : 'false');
    }
  }

  // Update ?plan= in the address bar without reloading or adding history
  // noise, so switching plans stays snappy and deep-linkable.
  function syncUrl(plan) {
    if (!window.history || !window.history.replaceState) return;
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('plan', plan);
      window.history.replaceState({}, '', url);
    } catch (e) { /* ignore */ }
  }

  function apply(plan) {
    if (!isValid(plan)) plan = 'free';
    document.documentElement.setAttribute('data-plan', plan);
    save(plan);
    syncControls(plan);
    syncUrl(plan);
  }

  function init() {
    syncControls(current());

    document.addEventListener('click', function (e) {
      var target = e.target.closest ? e.target.closest('[data-plan-set]') : null;
      if (!target) return;
      var plan = target.getAttribute('data-plan-set');
      if (!isValid(plan)) return;
      // These controls double as links (href="?plan=...") so the demo
      // still works without JS; intercept to switch instantly when JS runs.
      e.preventDefault();
      apply(plan);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
