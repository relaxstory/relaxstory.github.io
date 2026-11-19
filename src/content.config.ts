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
    hosts: z.array(z.string()).default([]), // 對應 hosts 的檔名（id）
    order: z.number().default(99),
  }),
});

// 主持人：在 src/content/hosts/ 新增一個 .md 檔
const hosts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hosts' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),        // 稱號／定位
    style: z.array(z.string()),
    avatar: z.string().optional(), // 放在 public/ 的圖片路徑，例 /hosts/aki.jpg
    order: z.number().default(99),
  }),
});

export const collections = { scripts, hosts };
