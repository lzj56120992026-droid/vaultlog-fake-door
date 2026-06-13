/**
 * VaultLog Landing Page Event Tracker
 * 0-cost tracking with Google Analytics 4.
 */

(function () {
  'use strict';

  const config = window.VAULTLOG_CONFIG || {};

  // Initialize GA4 if ID is set
  function initGA4() {
    const gaId = config.GA4_ID;
    if (!gaId || gaId === 'G-PLACEHOLDER') {
      console.warn('[VaultLog Tracker] GA4_ID not configured. Tracking disabled.');
      return false;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure'
    });

    return true;
  }

  // Send event to GA4
  window.trackEvent = function (eventName, params) {
    if (!window.gtag) {
      console.log('[VaultLog Tracker] Event not sent (gtag unavailable):', eventName, params);
      return;
    }
    const safeName = String(eventName).toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const payload = Object.assign(
      {
        page_location: window.location.href,
        page_title: document.title
      },
      params || {}
    );
    window.gtag('event', safeName, payload);
  };

  // Track all elements with data-event attribute
  function trackClicks() {
    document.addEventListener('click', function (e) {
      const el = e.target.closest('[data-event]');
      if (!el) return;

      const eventName = el.getAttribute('data-event');
      if (!eventName) return;

      const params = {};
      Array.from(el.attributes).forEach(function (attr) {
        if (attr.name.startsWith('data-') && attr.name !== 'data-event') {
          const key = attr.name.replace('data-', '').replace(/-/g, '_');
          params[key] = attr.value;
        }
      });

      window.trackEvent(eventName, params);
    });
  }

  // Scroll depth tracking
  function trackScrollDepth() {
    const thresholds = [25, 50, 75, 90];
    const triggered = new Set();

    function checkDepth() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);

      thresholds.forEach(function (threshold) {
        if (percent >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold);
          window.trackEvent('scroll_depth', { depth_percent: threshold });
        }
      });
    }

    window.addEventListener('scroll', checkDepth, { passive: true });
    checkDepth();
  }

  // Visibility tracking for key sections
  function trackVisibility() {
    const selector = '[data-event="feature_seen"], [data-event="step_seen"], [data-event="usecase_seen"], [data-event="pricing_card_seen"], [data-event="phone_seen"]';
    const seen = new Set();

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          const eventName = entry.target.getAttribute('data-event');
          const params = {};
          Array.from(entry.target.attributes).forEach(function (attr) {
            if (attr.name.startsWith('data-') && attr.name !== 'data-event') {
              const key = attr.name.replace('data-', '').replace(/-/g, '_');
              params[key] = attr.value;
            }
          });
          window.trackEvent(eventName, params);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll(selector).forEach(function (el) {
      observer.observe(el);
    });
  }

  // Track headline variant
  function trackVariant(variantId) {
    window.trackEvent('headline_variant', { variant_id: variantId });
  }

  // Initialize
  initGA4();
  trackClicks();
  trackScrollDepth();
  trackVisibility();

  window.VaultLogTracker = {
    trackEvent: window.trackEvent,
    trackVariant: trackVariant
  };
})();
