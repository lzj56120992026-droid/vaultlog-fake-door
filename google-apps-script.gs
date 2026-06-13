/**
 * VaultLog Waitlist Collector
 * Google Apps Script Web App for 0-cost email collection.
 *
 * Deploy as Web App (Execute as: Me, Access: Anyone).
 * The first submission will create a Google Sheet named "VaultLog Waitlist".
 */

const SHEET_NAME = 'VaultLog Waitlist';

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ success: false, error: 'Invalid JSON' }, 400);
  }

  const email = String(data.email || '').trim().toLowerCase();
  const updates = data.updates === true || data.updates === 'true';
  const variant = String(data.variant || 'default');
  const source = String(data.source || '');
  const submittedAt = String(data.submitted_at || new Date().toISOString());

  if (!email || !isValidEmail(email)) {
    return jsonResponse({ success: false, error: 'Invalid email' }, 400);
  }

  const sheet = getOrCreateSheet();
  sheet.appendRow([email, updates, variant, source, submittedAt, new Date()]);

  return jsonResponse({ success: true, message: 'Subscribed' }, 200);
}

function doGet(e) {
  return jsonResponse({ status: 'VaultLog collector is running' }, 200);
}

function getOrCreateSheet() {
  const files = DriveApp.getFilesByName(SHEET_NAME);
  let spreadsheet;
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(SHEET_NAME);
    const sheet = spreadsheet.getActiveSheet();
    sheet.appendRow(['email', 'updates_optin', 'headline_variant', 'source_url', 'submitted_at_iso', 'recorded_at']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }
  return spreadsheet.getActiveSheet();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(payload, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
    .setHttpResponseCode ? null : null; // setHttpResponseCode not always available; ContentService handles status via output
}
