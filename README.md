# Re:LAX Story Lab — 劇本殺工作室網站

- 官網：https://relaxstory.github.io/
- 預約系統：https://relaxstory.github.io/booking/（另一個 repo：`relaxstory/booking`）

使用 [Astro](https://astro.build) 建立的靜態網站。

## 開發指令

```bash
npm install      # 安裝套件
npm run dev      # 開發模式 http://localhost:4321
npm run build    # 產生正式網站到 dist/
```

## 網站結構

| 頁面 | 路徑 | 檔案 |
|---|---|---|
| 首頁（理念／精選劇本／預約／聯絡） | `/` | `src/pages/index.astro` |
| 關於我們 | `/about/` | 文字：`src/content/about.md`；排版：`src/pages/about.astro` |
| 劇本總覽 | `/scripts/` | `src/pages/scripts/index.astro` |
| 劇本詳細 | `/scripts/<id>/` | `src/pages/scripts/[id].astro` |
| 主持人 | `/hosts/` | `src/pages/hosts.astro` |
| 預約（目前為聯絡方式） | `/booking/` | `src/pages/booking.astro` |

## 新增／修改內容（不用碰程式碼）

- **關於我們**：改 `src/content/about.md`（純文字＋簡單符號，用法寫在檔案開頭）。
- **聯絡資訊、標語**：改 `src/data/site.ts`，全站一起更新。
- **Logo**：放在 `public/brand/`（原始檔 `logo-original.webp`）。網站配色取自 Logo，定義在 `src/styles/global.css` 開頭。

- **劇本**：在預約系統的 Google 試算表（`scripts` 分頁）編輯，改完按試算表選單「Re:LAX → 🔄 更新官網」，或等每天 04:13 自動更新。
  `featured` 為 TRUE 的劇本會顯示在首頁精選（最多 6 部）。劇本詳細頁底部的說明在 `src/data/site.ts` 的 `scriptNotes`。
- **主持人**：在 `src/content/hosts/` 新增 `.md` 檔（可複製 `kaike.md` 修改）。欄位：名字、稱號、語錄、風格、擅長類型、館長評語；`---` 下方是介紹文字。
  照片放到 `public/hosts/`，並在 `avatar` 填 `/hosts/檔名.jpg`；沒有照片時顯示名字第一個字。
- 試算表的 `hosts` 欄填主持人的檔名（不含 `.md`，例：`kaike`），兩邊會自動互相連結。

## 待辦

- [x] Logo 與配色
- [ ] 替換所有「範例內容」與「（待填寫）」的聯絡資訊
- [ ] 劇本封面（放 `src/assets/covers/<劇本 id>.jpg`）、主持人照片
- [ ] 設定 `astro.config.mjs` 的 `site` 為正式網域
- [x] 部署：GitHub Pages（`.github/workflows/deploy.yml`，push 到 main 自動部署）
  - 網址：https://relaxstory.github.io/ ；預約系統在 https://relaxstory.github.io/booking/
  - 需要：repo 名稱為 `relaxstory.github.io`、公開、Settings → Pages → Source 選 GitHub Actions
- [ ] **預約系統（第二階段）**：場次時段、線上預約表單、後台管理、資料庫
  - 建議方向：Astro SSR + Supabase（資料庫＋登入權限），或 Next.js
  - 後台帳號、資料庫金鑰一律放在部署平台的環境變數，不進 repo
