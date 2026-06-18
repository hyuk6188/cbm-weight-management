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

브라우저에서 입력한 내용을 Google Sheets에 저장하고 다른 PC에서 실시간으로 보려면 아래 Apps Script 웹앱으로 연결합니다.

```text
https://script.google.com/macros/s/AKfycbziJBymbJthT2slzUPcXza2Nb_5GVvhjXrC9qWsOi87G5u0ZDyXwazafhEc5f_IWoRyMw/exec
```

현재 Google Workspace 정책상 익명 공개 웹앱은 403으로 막힐 수 있어, Google 계정 로그인 상태에서 동기화하는 방식으로 배포했습니다.

재배포가 필요하면 아래 순서로 연결합니다.

1. Google Sheets에서 `확장 프로그램 > Apps Script`를 엽니다.
2. `google-apps-script.gs` 내용을 붙여 넣고 저장합니다.
3. `배포 > 새 배포 > 웹 앱`을 선택합니다.
4. 실행 권한은 본인, 액세스 권한은 실제 사용 범위에 맞게 선택합니다.
5. 발급된 웹앱 URL을 `cbm_dashboard_exec.html`의 `APPS_SCRIPT_WEBAPP_URL`에 입력합니다.
6. 변경 내용을 커밋하고 GitHub에 푸시하면 공개 대시보드가 해당 시트와 동기화됩니다.

`APPS_SCRIPT_WEBAPP_URL`이 비어 있으면 대시보드는 내장 데이터와 브라우저 저장소만 사용하며, Google Sheets 직접 읽기는 시도하지 않습니다.
