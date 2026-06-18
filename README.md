# CBM 및 중량 관리 대시보드

포장박스 기준 데이터와 실측 데이터를 비교하는 단일 HTML 대시보드입니다.

## 공개 대시보드

GitHub Pages 배포 후 아래 주소에서 접속합니다.

```text
https://hyuk6188.github.io/cbm-weight-management/
```

## Google Sheets 데이터 원본

대시보드는 아래 Google Sheets 문서를 데이터 원본으로 사용하도록 설정되어 있습니다.

```text
https://docs.google.com/spreadsheets/d/1TjI5rFOn5z46cDYYjB5F8oLxLtTxA-InDOMjByZPlYI
```

시트 탭 이름은 `BaseData`, `Measurements`를 유지해야 합니다.

## 쓰기 동기화

브라우저에서 입력한 내용을 Google Sheets에 저장하려면 `google-apps-script.gs` 내용을 Google Apps Script에 붙여 넣고 웹앱으로 배포한 뒤, 발급된 웹앱 URL을 `cbm_dashboard_exec.html`의 `APPS_SCRIPT_WEBAPP_URL`에 입력합니다.
