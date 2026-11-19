import { defineConfig } from 'astro/config';

// 目前是純靜態網站；未來加入預約系統時，再加上 SSR adapter（例如 @astrojs/node 或 Vercel）。
export default defineConfig({
  site: 'https://example.com', // 上線後改成正式網域
});
