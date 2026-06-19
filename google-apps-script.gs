var SPREADSHEET_ID = '1TjI5rFOn5z46cDYYjB5F8oLxLtTxA-InDOMjByZPlYI';
var BASE_SHEET = 'BaseData';
var MEAS_SHEET = 'Measurements';
var SETTINGS_SHEET = 'Settings';
var DEFAULT_NOTE = '1. 동일코드 내수 및 수출 포장박스 BOM 중복 구성\n2. CBM 자동구성 DW+박스형태+보정값 로직 수정 필요\n3. 박스업체 로트별 재단 치수 및 괘선 위치 상이';

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  if (params.action === 'saveNote') {
    return jsonResponse(saveNoteAndVerify(params.note), params.callback);
  }
  if (params.action === 'load' || params.callback) {
    return jsonResponse(loadData_(), params.callback);
  }
  var html = HtmlService.createHtmlOutputFromFile('cbm_dashboard_exec').getContent();
  html = html.replace('__SERVER_DATA_JSON__', JSON.stringify(loadData_()));
  var output = HtmlService.createHtmlOutput(html);
  output.setTitle('CBM Dashboard');
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return output;
}

function doPost(e) {
  var payload = JSON.parse(e.postData.contents || '{}');
  if (payload.action === 'saveNote') {
    return jsonResponse(saveNoteAndVerify(payload.note));
  }
  saveData_(payload);
  return jsonResponse({ ok: true, savedAt: new Date().toISOString() });
}

function loadData() {
  return loadData_();
}

function saveData(payload) {
  saveData_(payload || {});
  return { ok: true, savedAt: new Date().toISOString() };
}

function saveNote(note) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  writeNote_(ss, note);
  return { ok: true, savedAt: new Date().toISOString() };
}

function saveNoteAndVerify(note) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  writeNote_(ss, note);
  SpreadsheetApp.flush();
  return {
    ok: true,
    note: readNote_(ss),
    savedAt: new Date().toISOString(),
  };
}

function jsonResponse(data, callback) {
  var body = callback
    ? callback + '(' + JSON.stringify(data) + ');'
    : JSON.stringify(data);
  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}

function loadData_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return {
    base: readObjects_(ss.getSheetByName(BASE_SHEET)),
    measurements: readObjects_(ss.getSheetByName(MEAS_SHEET)),
    note: readNote_(ss),
  };
}

function saveData_(payload) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  writeObjects_(ss.getSheetByName(BASE_SHEET), ['id', 'code', 'color', 'name', 'w', 'd', 'h', 'kg', 'createdAt'], payload.base || []);
  writeObjects_(ss.getSheetByName(MEAS_SHEET), ['id', 'code', 'baseId', 'date', 'by', 'w', 'd', 'h', 'kg', 'memo'], payload.measurements || []);
  if (Object.prototype.hasOwnProperty.call(payload, 'note')) {
    writeNote_(ss, payload.note);
  }
}

function getSettingsSheet_(ss) {
  return ss.getSheetByName(SETTINGS_SHEET) || ss.insertSheet(SETTINGS_SHEET);
}

function readNote_(ss) {
  var sheet = getSettingsSheet_(ss);
  var value = sheet.getRange(1, 2).getValue();
  return value || DEFAULT_NOTE;
}

function writeNote_(ss, note) {
  var sheet = getSettingsSheet_(ss);
  sheet.getRange(1, 1, 1, 2).setValues([['note', note || DEFAULT_NOTE]]);
  sheet.setFrozenRows(1);
}

function readObjects_(sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0].map(String);
  return values.slice(1).filter(function(row) {
    return row.some(function(cell) { return cell !== ''; });
  }).map(function(row) {
    var obj = {};
    headers.forEach(function(header, i) { obj[header] = row[i]; });
    return obj;
  });
}

function writeObjects_(sheet, headers, rows) {
  sheet.clearContents();
  var values = [headers].concat(rows.map(function(row) {
    return headers.map(function(header) {
      return row[header] === null || row[header] === undefined ? '' : row[header];
    });
  }));
  sheet.getRange(1, 1, values.length, headers.length).setValues(values);
  sheet.setFrozenRows(1);
}
