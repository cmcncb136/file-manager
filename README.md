# File Manager

File Manager는 로컬 PC에 흩어져 있는 파일, 폴더, 이미지 리소스, 실행 파일을 더 직관적으로 찾고 관리하기 위해 만든 Electron 기반 데스크톱 파일 관리 애플리케이션입니다.

일반적인 파일 탐색기에서는 파일의 성격이나 사용 목적을 한눈에 파악하기 어렵고, 자주 사용하는 실행 파일이나 작업 폴더도 위치를 기억해 직접 찾아가야 하는 불편함이 있습니다. 이 프로젝트는 이러한 문제를 개선하기 위해 각 파일 항목에 카테고리, Kind, 대표 이미지, 설명, 실행 경로를 함께 등록할 수 있도록 설계했습니다.

등록한 항목은 카드 형태로 표시되며, 사용자는 검색과 필터를 통해 원하는 항목을 빠르게 찾을 수 있습니다. 또한 등록된 실행 파일이나 폴더를 애플리케이션에서 바로 열 수 있어, 자주 사용하는 로컬 리소스를 한곳에서 관리하고 실행할 수 있습니다.
## 주요 기능

- 실행 파일과 루트 폴더 등록
- 대표 이미지, 설명, 카테고리, Kind 정보 관리
- 제목 검색, 카테고리 필터, Kind 필터
- 제목, 생성일, 수정일, 즐겨찾기 기준 정렬
- 항목 즐겨찾기 토글
- 등록된 실행 파일 또는 폴더 열기
- 실행 파일 중복 등록 감지
- 로컬 이미지 선택 및 앱 데이터 경로로 복사
- 제목/폴더명 기반 이미지 추천 검색
- 동영상 프레임 추출 및 대표 이미지 등록
- SQLite DB import/export
- 라이트/다크 테마 전환

## 기술 스택

### Desktop

Electron, electron-vite, electron-builder, Electron Toolkit

### Renderer

Vue 3, TypeScript, Vite, Pinia, PrimeIcons, Iconify

### Main & Data

TypeScript, TypeORM, SQLite, tsyringe, reflect-metadata

### OS Integration

Electron dialog, Electron shell, Node.js fs/path/os, Windows shortcut

## 아키텍처 개요

이 프로젝트는 Electron의 `Main Process`, `Preload Script`, `Renderer Process`를 분리해 구성합니다.

```text
Vue Component
  -> Pinia Store
  -> window.api.callService(...)
  -> Preload ipcRenderer.invoke(...)
  -> Main ipcMain.handle(...)
  -> Application Service
  -> Repository
  -> TypeORM
  -> SQLite
```

### 주요 디렉터리

```text
src/main
  Electron Main Process, BrowserWindow, IPC handler, SQLite 초기화

src/preload
  Renderer에 노출할 window.api 정의

src/renderer
  Vue UI, Pinia store, 화면 컴포넌트

src/application
  Item, Category, Kind, FileRef, ImageMapping 유스케이스

src/domain
  핵심 도메인 타입

src/entity
  TypeORM Entity

src/infrastructure
  TypeORM Repository 래퍼

build
  앱 아이콘, afterPack hook
```

## Renderer와 Electron 통신

Renderer에서 파일 시스템이나 DB 접근이 필요할 때는 Preload에서 노출한 `window.api`를 통해 Main Process에 요청합니다.

```text
Renderer
  -> window.api.selectImage()
  -> Preload
  -> ipcRenderer.invoke('select-image')
  -> Main Process
  -> dialog.showOpenDialog()
  -> 선택된 파일 경로 반환
```

서비스 호출은 `application-call` 채널을 통해 처리합니다.

```text
window.api.callService('ItemService', 'findItemWithPathAll')
window.api.callService('ItemService', 'saveRaw', [JSON.stringify(saveItem)])
window.api.callService('FileRefService', 'openFileById', [id])
```

현재 서비스 호출은 범용 dispatch 채널을 사용합니다. Renderer는 서비스 이름, 메서드 이름, payload를 전달하고 Main Process는 등록된 application service를 실행한 뒤 결과를 반환합니다.

## 로컬 데이터 저장

앱 데이터는 SQLite에 저장됩니다.

```text
app.getPath('userData')/database.sqlite
```

주요 테이블은 다음과 같습니다.

- `item`: 항목 기본 정보, 대표 이미지/파일 참조 ID, 즐겨찾기, 생성/수정일
- `category`: 카테고리
- `kind`: Kind
- `item_and_category`: 항목-카테고리 연결
- `item_and_kind`: 항목-Kind 연결
- `image_mapping`: 원본 이미지 경로와 앱 내부 복사 경로
- `file_ref`: 원본 파일 경로와 앱 내부 링크 파일 경로

## 파일 처리 방식

이미지는 앱 데이터 경로 아래 `image` 폴더로 복사합니다.

```text
로컬 이미지 선택
  -> ImageMappingService
  -> FileService.copyFileToAppFolder()
  -> userData/image
  -> image_mapping 저장
```

실행 파일과 폴더는 Windows 바로가기 파일로 연결 정보를 관리합니다.

```text
shell.writeShortcutLink()
  -> userData/link 아래 .lnk 생성
  -> file_ref 저장
```

## 패키징 트러블슈팅

패키징된 앱 실행 시 `call-bind-apply-helpers` 모듈을 찾지 못하는 문제가 있었습니다.

원인은 개발 환경의 `node_modules`와 패키징 결과물의 `node_modules` 배치가 달라진 것이었습니다. 패키징 결과에서는 해당 패키지가 아래 위치에만 들어갔습니다.

```text
app/node_modules/call-bind/node_modules/call-bind-apply-helpers
```

하지만 `dunder-proto`는 다음 위치에서 모듈을 찾기 때문에 런타임 오류가 발생했습니다.

```text
app/node_modules/call-bind-apply-helpers
```

해결을 위해 `electron-builder`의 `afterPack` hook을 추가했습니다.

- 패키징 직후 누락된 런타임 dependency를 루트 `node_modules`로 복사
- `call-bind-apply-helpers`, `dunder-proto/get`, `get-proto`, `typeorm` resolve 검증
- `electron-builder.yml`을 단일 빌더 설정 파일로 정리

관련 파일:

- `electron-builder.yml`
- `build/afterPack.js`

## 프로젝트 실행

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Type Check & Build

```bash
npm run build
```

### Unpacked Build

```bash
npm run build:unpack
```

### Windows Build

```bash
npm run build:win
```

## 관련 문서

- [프로젝트 상세 문서](./file-manager.md)
- [Electron 참고 문서](./electron-reference.md)

## 한 줄 소개

File Manager는 로컬 실행 파일과 폴더를 이미지, 설명, 카테고리, Kind와 함께 관리하고 빠르게 검색·실행할 수 있도록 만든 Electron 기반 데스크톱 파일 관리 앱입니다.
