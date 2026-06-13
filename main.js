/**
 * VaultLog Landing Page Interactions
 */

(function () {
  'use strict';

  const config = window.VAULTLOG_CONFIG || {};

  // A/B test: randomly pick a headline variant
  function setupHeadlineVariant() {
    const variants = config.HEADLINE_VARIANTS || [];
    if (!variants.length) return;

    // Pick variant deterministically based on session to avoid flicker
    let variantIndex = 0;
    try {
      const saved = sessionStorage.getItem('vaultlog_variant');
      if (saved !== null) {
        variantIndex = parseInt(saved, 10) % variants.length;
      } else {
        variantIndex = Math.floor(Math.random() * variants.length);
        sessionStorage.setItem('vaultlog_variant', String(variantIndex));
      }
    } catch (e) {
      variantIndex = Math.floor(Math.random() * variants.length);
    }

    const variant = variants[variantIndex];
    const titleEl = document.getElementById('hero-title');
    if (titleEl && variant) {
      titleEl.textContent = variant.text;
      titleEl.setAttribute('data-variant', variant.id);
    }

    if (window.VaultLogTracker && window.VaultLogTracker.trackVariant) {
      window.VaultLogTracker.trackVariant(variant.id);
    }
  }

  // Pricing toggle
  function setupPricingToggle() {
    const buttons = document.querySelectorAll('[data-plan-select]');
    const yearlyPrice = document.getElementById('price-yearly');
    const monthlyPrice = document.getElementById('price-monthly');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const plan = btn.getAttribute('data-plan-select');

        buttons.forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-plan-select') === plan);
        });

        // Update URL param for tracking
        const url = new URL(window.location.href);
        url.searchParams.set('plan', plan);
        window.history.replaceState({}, '', url.toString());

        if (window.trackEvent) {
          window.trackEvent('pricing_toggle', { selected_plan: plan });
        }
      });
    });

    // Read plan from URL
    const url = new URL(window.location.href);
    const planParam = url.searchParams.get('plan');
    if (planParam === 'monthly') {
      const monthlyBtn = document.querySelector('[data-plan-select="monthly"]');
      if (monthlyBtn) monthlyBtn.click();
    }
  }

  // Waitlist form
  function setupWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    const messageEl = document.getElementById('form-message');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const emailInput = form.querySelector('input[name="email"]');
      const updatesInput = form.querySelector('input[name="updates"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email || !isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        if (window.trackEvent) {
          window.trackEvent('form_error', { error_type: 'invalid_email' });
        }
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Joining...';
      showMessage('', '');

      if (window.trackEvent) {
        window.trackEvent('form_submit', {
          email_domain: email.split('@')[1] || 'unknown',
          updates_optin: updatesInput ? updatesInput.checked : false
        });
      }

      const endpoint = config.FORM_ENDPOINT || '';
      if (!endpoint || endpoint.includes('YOUR_SCRIPT_ID') || endpoint.includes('YOUR_FORM_ID')) {
        // Demo mode: simulate success
        setTimeout(function () {
          showMessage('Thanks! This is a demo form. Configure FORM_ENDPOINT in config.js to collect real emails.', 'success');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Join waitlist';
          if (window.trackEvent) {
            window.trackEvent('form_demo_success', { email_domain: email.split('@')[1] || 'unknown' });
          }
        }, 800);
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            updates: updatesInput ? updatesInput.checked : false,
            variant: document.getElementById('hero-title')?.getAttribute('data-variant') || 'default',
            source: window.location.href,
            submitted_at: new Date().toISOString()
          })
        });

        if (response.ok) {
          showMessage('You\'re on the list! We\'ll email you when early access is ready.', 'success');
          form.reset();
          incrementWaitlistCounter();
          if (window.trackEvent) {
            window.trackEvent('form_success', { email_domain: email.split('@')[1] || 'unknown' });
          }
        } else {
          throw new Error('Server returned ' + response.status);
        }
      } catch (err) {
        showMessage('Something went wrong. Please try again later.', 'error');
        if (window.trackEvent) {
          window.trackEvent('form_error', { error_type: 'server_error', error_message: err.message });
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join waitlist';
      }
    });

    function showMessage(text, type) {
      if (!messageEl) return;
      messageEl.textContent = text;
      messageEl.className = 'form-message' + (type ? ' ' + type : '');
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  }

  // Waitlist counter
  function setupWaitlistCounter() {
    const el = document.getElementById('waitlist-count');
    if (!el) return;

    const base = typeof config.WAITLIST_BASE_COUNT === 'number' ? config.WAITLIST_BASE_COUNT : 0;
    // Add today's incremental number to make it feel alive
    const today = new Date().toDateString();
    const hash = today.split('').reduce(function (acc, ch) {
      return acc + ch.charCodeAt(0);
    }, 0);
    const count = base + (hash % 12) + 3;

    animateNumber(el, 0, count, 1200);
  }

  function incrementWaitlistCounter() {
    const el = document.getElementById('waitlist-count');
    if (!el) return;
    const current = parseInt(el.textContent.replace(/,/g, ''), 10) || 0;
    animateNumber(el, current, current + 1, 400);
  }

  function animateNumber(el, start, end, duration) {
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.round(start + (end - start) * easeOutQuart(progress));
      el.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function () {
    setupHeadlineVariant();
    setupPricingToggle();
    setupWaitlistForm();
    setupWaitlistCounter();
  });
})();
