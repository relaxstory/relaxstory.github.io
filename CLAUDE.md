# CLAUDE.md — 官網（relaxstory/relaxstory.github.io）

Re:LAX Story Lab（雷凱斯故事實驗室）劇本殺工作室官網。Astro 靜態網站，push 到 `main` 後由 GitHub Actions 部署到 https://relaxstory.github.io/ 。

## 兩個 repo 的關係

| | 官網（本 repo） | 預約系統 |
|---|---|---|
| repo | `relaxstory/relaxstory.github.io` | `relaxstory/booking` |
| 網址 | https://relaxstory.github.io/ | https://relaxstory.github.io/booking/ |
| 技術 | Astro 5、Node 22 | Vite + TypeScript；Apps Script 後端；Google Sheets |

- 根網址屬於官網，`/booking/` 屬於預約系統：**官網不可建立 `/booking/` 路徑的頁面**。
- 全站預約按鈕讀 `src/data/site.ts` 的 `bookingUrl`（目前 `'/booking/'`；預約系統暫停時可改回 `'/reservation/'`，該頁只有 IG 聯絡方式）。
- **劇本資料不在本 repo**：唯一主資料是預約系統 Google Sheet 的 `scripts` 分頁。建置時由 `src/lib/catalogLoader.ts` 讀取 `GET ?action=catalog`；讀不到時改用 `src/data/catalog.snapshot.json`（GitHub Actions 會顯示 warning）。劇本 id 即網址代號（例：`/scripts/chutao-lianticun/`）。
- 外觀兩邊一致；調整配色、字型、Logo 時一併考慮預約系統（其樣式在 `relaxstory/booking` 的 `frontend/src/style.css`）。

## 內容放哪裡（使用者會自己在 GitHub 網頁上編輯，保持這些檔案好讀）

| 內容 | 檔案 |
|---|---|
| 店名、標語、聯絡方式、預約連結、劇本頁說明、價格顯示開關（`showPrice`，目前 false） | `src/data/site.ts` |
| 劇本 | **預約系統試算表 `scripts` 分頁**（改完按試算表選單「Re:LAX → 🔄 更新官網」，或等每日 04:13 自動更新）；網站欄位對應在 `src/lib/catalogLoader.ts` |
| 主持人 | `src/content/hosts/*.md`（`kaike` 凱克、`daidai` 玳玳、`zhizhi` 芝芝） |
| 關於我們 | `src/content/about.md`（簡易符號標記，規則寫在檔案開頭；解析器 `src/lib/parseAbout.ts`） |
| 首頁工作室理念 | `src/pages/index.astro` |
| Logo、favicon | `public/brand/`、`public/favicon.png` |

- 劇本內容由店主在試算表填寫；試算表沒有的資訊（價格、難度、介紹）不要自己編，先問使用者。
- `catalog.snapshot.json` 只是備援：試算表欄位有變動時，可在 relaxstory/booking 用後端測試環境重新產生（見該 repo 的 CLAUDE.md）。
- 試算表 `featured` 勾選 TRUE 的劇本顯示在首頁精選（最多 6 部）。

## 不要動／注意

- 不要放入私人 Email 或電話：官方聯絡窗口只有 Instagram @kac_larpgm。repo 是公開的，修改紀錄也看得到。
- 不要新增 `/booking/` 路徑。
- 手機版面優先：改版面後檢查 390px 與 320px（iPhone SE）寬度，不可左右捲動。
- 中文換行：標語、引言、強調框用「依標點切段 + `display: inline-block`」避免把詞切開（見 `about.astro`、`hosts.astro` 的 `phrases()`）；不要只靠 `text-wrap: balance`，它會在詞中間斷行。
- 標題字型 Cormorant Garamond 預設是舊式數字，標題已設定 `font-variant-numeric: lining-nums`，新增標題樣式時保留。

## 驗證

```bash
npm ci
npm run build      # 應產生 12 頁左右；雲端環境連不到 Apps Script，會出現「改用 snapshot」的 warning，屬正常
npm run preview    # http://localhost:4321/
```

修改後用 Playwright 在手機尺寸截圖檢查。雲端環境連不到 `github.io`，部署結果用 `gh run list -R relaxstory/relaxstory.github.io` 確認，畫面請使用者用手機確認。

## 協作規則

- 開始前 `git pull`，完成後立刻 commit + push（push 即部署）。
- 使用者介面與文件用繁體中文（台灣用語）；commit 訊息用英文。
