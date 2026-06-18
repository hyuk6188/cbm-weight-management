const SPREADSHEET_ID = '1TjI5rFOn5z46cDYYjB5F8oLxLtTxA-InDOMjByZPlYI';
const BASE_SHEET = 'BaseData';
const MEAS_SHEET = 'Measurements';

function doGet(e) {
  return jsonResponse(loadData_(), e && e.parameter && e.parameter.callback);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');
  saveData_(payload);
  return jsonResponse({ ok: true, savedAt: new Date().toISOString() });
}

function jsonResponse(data, callback) {
  const body = callback
    ? `${callback}(${JSON.stringify(data)});`
    : JSON.stringify(data);
  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}

function loadData_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return {
    base: readObjects_(ss.getSheetByName(BASE_SHEET)),
    measurements: readObjects_(ss.getSheetByName(MEAS_SHEET)),
  };
}

function saveData_(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  writeObjects_(ss.getSheetByName(BASE_SHEET), ['id', 'code', 'color', 'name', 'w', 'd', 'h', 'kg', 'createdAt'], payload.base || []);
  writeObjects_(ss.getSheetByName(MEAS_SHEET), ['id', 'code', 'baseId', 'date', 'by', 'w', 'd', 'h', 'kg', 'memo'], payload.measurements || []);
}

function readObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1).filter(row => row.some(cell => cell !== '')).map(row => {
    const obj = {};
    headers.forEach((header, i) => obj[header] = row[i]);
    return obj;
  });
}

function writeObjects_(sheet, headers, rows) {
  sheet.clearContents();
  const values = [headers].concat(rows.map(row => headers.map(header => row[header] ?? '')));
  sheet.getRange(1, 1, values.length, headers.length).setValues(values);
  sheet.setFrozenRows(1);
}
