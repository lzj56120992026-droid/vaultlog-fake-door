/**
 * VaultLog Landing Page Configuration
 * Edit this file with your own IDs before deploying.
 */

window.VAULTLOG_CONFIG = {
  // Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)
  // Create free at https://analytics.google.com
  GA4_ID: 'G-PLACEHOLDER',

  // Email collection endpoint
  // Option A: Google Apps Script Web App URL (recommended, free, unlimited submissions)
  // See README.md for setup instructions.
  FORM_ENDPOINT: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',

  // Option B: Formspree form endpoint (free tier: 50 submissions/month)
  // Uncomment and use this if you prefer Formspree:
  // FORM_ENDPOINT: 'https://formspree.io/f/YOUR_FORM_ID',

  // A/B test headline variants
  // The page will randomly pick one on load and track which variant converts.
  HEADLINE_VARIANTS: [
    {
      id: 'v1_thoughts',
      text: 'Your thoughts, locked to your device.'
    },
    {
      id: 'v2_nocloud',
      text: 'No-cloud private notes. Face ID. Export anytime.'
    },
    {
      id: 'v3_iphone',
      text: 'What happens on your iPhone stays on your iPhone.'
    }
  ],

  // Fake waitlist counter base number (adds a realistic starting count)
  WAITLIST_BASE_COUNT: 0,

  // Currency and pricing
  PRICING: {
    yearly: 29.99,
    monthly: 8.99,
    currency: '$'
  }
};
