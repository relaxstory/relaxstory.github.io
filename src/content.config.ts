import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 劇本：在 src/content/scripts/ 新增一個 .md 檔就會出現一個劇本（檔名 = 網址代號）
const scripts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/scripts' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),                        // 一句話簡介
    genre: z.array(z.string()),                 // 類型標籤，例：[推理, 還原]
    players: z.string(),                        // 人數，例：'5 人'
    roles: z.string().optional(),               // 角色配置，例：'4 女 1 男'、'不限'
    genderAdvice: z.string().optional(),        // 玩家性別建議，例：'1 女 1 男'、'不限'
    duration: z.string(),                       // 平均時長，例：'約 4.5 小時'
    difficulty: z.number().min(1).max(5).optional(), // 推理難度 1–5（可不填）
    price: z.string().optional(),               // 價格（可不填，不填就不顯示）
    series: z.string().optional(),              // 系列，例：'牛鬼蛇神系列'
    badge: z.enum(['新上架', '熱門']).optional(), // 標記
    adapted: z.boolean().default(false),        // true = 劇本繁化
    featured: z.boolean().default(false),       // true = 顯示在首頁「精選劇本」
    status: z.enum(['上架中', '即將推出', '已下架']).default('上架中'),
    hosts: z.array(z.string()).default([]),     // 主持人代號（hosts 資料夾的檔名）
    order: z.number().default(99),              // 排序，數字小的在前
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
