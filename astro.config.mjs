import { defineConfig } from 'astro/config';

// 官網部署在 GitHub Pages 根網址；預約系統在同網域的 /booking/（另一個 repo）。
export default defineConfig({
  site: 'https://relaxstory.github.io',
});
