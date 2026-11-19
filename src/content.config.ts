import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 劇本：在 src/content/scripts/ 新增一個 .md 檔就會出現一個劇本
const scripts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/scripts' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    genre: z.array(z.string()),          // 例：['本格', '懸疑']
    players: z.string(),                  // 例：'6 人（3 男 3 女）'
    duration: z.string(),                 // 例：'約 4 小時'
    difficulty: z.number().min(1).max(5), // 推理難度 1–5
    price: z.string().optional(),
    status: z.enum(['上架中', '即將推出', '已下架']).default('上架中'),
    featured: z.boolean().default(false),  // true = 顯示在首頁「精選劇本」
    hosts: z.array(z.string()).default([]), // 對應 hosts 的檔名（id）
    order: z.number().default(99),
  }),
});

// 主持人：在 src/content/hosts/ 新增一個 .md 檔（檔名 = 代號，劇本的 hosts 欄位用這個代號）
const hosts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hosts' }),
  schema: z.object({
    name: z.string(),                       // 名字
    title: z.string(),                      // 稱號｜定位，例：館長｜GM / NPC
    quote: z.string().optional(),           // 代表語錄（不用加引號）
    styleLabel: z.string().default('主持風格'), // 風格標籤的標題，可改成「演繹風格」等
    style: z.array(z.string()).default([]),
    genres: z.array(z.string()).default([]),   // 擅長劇本類型
    remarkLabel: z.string().default('館長評語'),
    remark: z.string().optional(),          // 館長評語（不用加引號）
    avatar: z.string().optional(),          // 照片：放在 public/hosts/，填 /hosts/檔名.jpg
    order: z.number().default(99),          // 排序，數字小的在前
  }),
});

export const collections = { scripts, hosts };
