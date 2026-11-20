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
- **劇本 id 兩邊共用**：`src/content/scripts/<id>.md` 的檔名 = 預約系統 Sheet `scripts` 的 `id`。新增劇本時用同一個 id。
- 外觀兩邊一致；調整配色、字型、Logo 時一併考慮預約系統（其樣式在 `relaxstory/booking` 的 `frontend/src/style.css`）。

## 內容放哪裡（使用者會自己在 GitHub 網頁上編輯，保持這些檔案好讀）

| 內容 | 檔案 |
|---|---|
| 店名、標語、聯絡方式、預約連結、劇本頁說明、價格顯示開關（`showPrice`，目前 false） | `src/data/site.ts` |
| 劇本 | `src/content/scripts/*.md`（欄位定義在 `src/content.config.ts`） |
| 主持人 | `src/content/hosts/*.md`（`kaike` 凱克、`daidai` 玳玳、`zhizhi` 芝芝） |
| 關於我們 | `src/content/about.md`（簡易符號標記，規則寫在檔案開頭；解析器 `src/lib/parseAbout.ts`） |
| 首頁工作室理念 | `src/pages/index.astro` |
| Logo、favicon | `public/brand/`、`public/favicon.png` |

- 劇本資料來源是店主的公開 Google Sheet「劇本列表」分頁；試算表沒有的資訊（價格、難度、介紹）不要自己編，先問使用者。
- `featured: true` 的劇本顯示在首頁精選（最多 6 部）。

## 不要動／注意

- 不要放入私人 Email 或電話：官方聯絡窗口只有 Instagram @kac_larpgm。repo 是公開的，修改紀錄也看得到。
- 不要新增 `/booking/` 路徑。
- 手機版面優先：改版面後檢查 390px 與 320px（iPhone SE）寬度，不可左右捲動。
- 中文換行：標語、引言、強調框用「依標點切段 + `display: inline-block`」避免把詞切開（見 `about.astro`、`hosts.astro` 的 `phrases()`）；不要只靠 `text-wrap: balance`，它會在詞中間斷行。
- 標題字型 Cormorant Garamond 預設是舊式數字，標題已設定 `font-variant-numeric: lining-nums`，新增標題樣式時保留。

## 驗證

```bash
npm ci
npm run build      # 應產生 12 頁左右，無錯誤或警告
npm run preview    # http://localhost:4321/
```

修改後用 Playwright 在手機尺寸截圖檢查。雲端環境連不到 `github.io`，部署結果用 `gh run list -R relaxstory/relaxstory.github.io` 確認，畫面請使用者用手機確認。

## 協作規則

- 開始前 `git pull`，完成後立刻 commit + push（push 即部署）。
- 使用者介面與文件用繁體中文（台灣用語）；commit 訊息用英文。
