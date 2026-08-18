# 풀향기 펜션 홈페이지

경상남도 밀양시 단장면에 위치한 풀향기 펜션의 공식 홈페이지입니다.

## 구성

- `index.html` — 메인 페이지 (펜션 소개, 객실, 부대시설, 오시는 길, 예약 문의 폼)
- `admin.html` — 예약 문의 관리자 페이지 (Supabase Auth 로그인 필요)
- `config.js` — Supabase 프로젝트 연결 설정 (URL, anon key)
- `styles.css` — 전체 스타일시트

## 기술 스택

- 순수 HTML/CSS/JavaScript (별도 빌드 도구 없음)
- [Supabase](https://supabase.com) — 예약 문의 저장(`reservations` 테이블)과 관리자 인증

## 로컬에서 미리보기

빌드 과정이 필요 없습니다. `index.html`을 브라우저로 바로 열거나, 간단한 정적 서버로 실행하세요.

```bash
npx serve .
```

## Supabase 설정

`config.js`에 Supabase 프로젝트의 URL과 anon(공개) key가 들어 있습니다. anon key는 클라이언트에 노출되어도 안전하도록 설계된 키이며, 실제 데이터 접근 제어는 Supabase 프로젝트의 Row Level Security(RLS) 정책으로 관리합니다.

## 관리자 페이지

`admin.html`에서 Supabase Auth로 로그인한 관리자만 예약 문의 목록(`reservations` 테이블)을 조회할 수 있습니다.
