import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { catalogLoader } from './lib/catalogLoader';

// 劇本：資料來自預約系統的 Google 試算表（scripts 分頁），不在這個 repo 裡編輯。
// 改劇本 → 改試算表 → 試算表選單「Re:LAX → 🔄 更新官網」（或等每日自動更新）。
const scripts = defineCollection({
  loader: catalogLoader(),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    genre: z.array(z.string()),
    players: z.string(),                         // '5 人'
    roles: z.string().optional(),                // 角色配置：'4 女 1 男'、'不限'
    genderAdvice: z.string().optional(),         // 玩家性別建議
    duration: z.string(),                        // '約 4.5 小時'
    difficulty: z.number().min(1).max(5).optional(),
    price: z.string().optional(),                // 是否顯示由 site.ts 的 showPrice 控制
    series: z.string().optional(),
    badge: z.enum(['新上架', '熱門']).optional(),
    adapted: z.boolean().default(false),
    featured: z.boolean().default(false),        // 首頁精選
    status: z.enum(['上架中', '即將推出', '已下架']).default('上架中'),
    bookable: z.boolean().default(true),         // 預約系統是否開放預約此劇本
    hosts: z.array(z.string()).default([]),
    order: z.number().default(999),
    description: z.string().default(''),         // 故事簡介（空一行 = 分段）
    author: z.string().optional(),               // 作者
    features: z.array(z.string()).default([]),   // 特色
    suits: z.array(z.string()).default([]),      // 適合哪些玩家
    experience: z.string().optional(),           // 經驗需求
    readingLoad: z.string().optional(),          // 閱讀量
    curatorNote: z.string().optional(),          // 館長筆記
    crossplay: z.boolean().default(false),       // 可反串
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
