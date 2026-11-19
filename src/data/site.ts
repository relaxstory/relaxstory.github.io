// 工作室基本資料：改這裡，全站（首頁、預約頁）會一起更新。
// 聯絡方式：要新增（例如 LINE、電話），照格式加一行即可；刪掉一行就不顯示。
export const site = {
  name: 'Re:LAX Story Lab',
  slogan: '每次相遇，都是一段值得記得的故事',
  // 劇本詳細頁下方的說明文字
  scriptNotes: [
    '「角色配置」係指劇本中角色之性別組成；標示「不限」者，表示角色無特定性別設定。',
    '「玩家性別建議」係依角色間之情感線或與 NPC 之互動需求，所建議之最低性別組成。',
    '本工作室劇本均秉持性別友善原則，不限制玩家性別組成，全女、全男或反串皆歡迎參與。',
  ],
  // 是否在網站上顯示劇本價格（true = 顯示）。價格填在各劇本檔的 price 欄位。
  showPrice: false,
  contacts: [
    { label: 'Instagram', text: '@kac_larpgm', url: 'https://www.instagram.com/kac_larpgm/' },
  ],
};
