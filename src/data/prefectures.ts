export interface Prefecture {
  name: string;
  code: string;
  region: string;
}

export const prefectures: Prefecture[] = [
  // 北海道
  { name: "宗谷地方", code: "011000", region: "北海道" },
  { name: "上川・留萌地方", code: "012000", region: "北海道" },
  { name: "石狩・空知・後志地方", code: "016000", region: "北海道" },
  { name: "網走・北見・紋別地方", code: "013000", region: "北海道" },
  { name: "釧路・根室地方", code: "014100", region: "北海道" },
  { name: "胆振・日高地方", code: "015000", region: "北海道" },
  { name: "渡島・檜山地方", code: "017000", region: "北海道" },
  // 東北
  { name: "青森県", code: "020000", region: "東北" },
  { name: "岩手県", code: "030000", region: "東北" },
  { name: "宮城県", code: "040000", region: "東北" },
  { name: "秋田県", code: "050000", region: "東北" },
  { name: "山形県", code: "060000", region: "東北" },
  { name: "福島県", code: "070000", region: "東北" },
  // 関東甲信
  { name: "茨城県", code: "080000", region: "関東甲信" },
  { name: "栃木県", code: "090000", region: "関東甲信" },
  { name: "群馬県", code: "100000", region: "関東甲信" },
  { name: "埼玉県", code: "110000", region: "関東甲信" },
  { name: "千葉県", code: "120000", region: "関東甲信" },
  { name: "東京都", code: "130000", region: "関東甲信" },
  { name: "神奈川県", code: "140000", region: "関東甲信" },
  { name: "山梨県", code: "190000", region: "関東甲信" },
  { name: "長野県", code: "200000", region: "関東甲信" },
  // 北陸
  { name: "新潟県", code: "150000", region: "北陸" },
  { name: "富山県", code: "160000", region: "北陸" },
  { name: "石川県", code: "170000", region: "北陸" },
  { name: "福井県", code: "180000", region: "北陸" },
  // 東海
  { name: "岐阜県", code: "210000", region: "東海" },
  { name: "静岡県", code: "220000", region: "東海" },
  { name: "愛知県", code: "230000", region: "東海" },
  { name: "三重県", code: "240000", region: "東海" },
  // 近畿
  { name: "滋賀県", code: "250000", region: "近畿" },
  { name: "京都府", code: "260000", region: "近畿" },
  { name: "大阪府", code: "270000", region: "近畿" },
  { name: "兵庫県", code: "280000", region: "近畿" },
  { name: "奈良県", code: "290000", region: "近畿" },
  { name: "和歌山県", code: "300000", region: "近畿" },
  // 中国
  { name: "鳥取県", code: "310000", region: "中国" },
  { name: "島根県", code: "320000", region: "中国" },
  { name: "岡山県", code: "330000", region: "中国" },
  { name: "広島県", code: "340000", region: "中国" },
  // 四国
  { name: "徳島県", code: "360000", region: "四国" },
  { name: "香川県", code: "370000", region: "四国" },
  { name: "愛媛県", code: "380000", region: "四国" },
  { name: "高知県", code: "390000", region: "四国" },
  // 九州
  { name: "山口県", code: "350000", region: "九州" },
  { name: "福岡県", code: "400000", region: "九州" },
  { name: "佐賀県", code: "410000", region: "九州" },
  { name: "長崎県", code: "420000", region: "九州" },
  { name: "熊本県", code: "430000", region: "九州" },
  { name: "大分県", code: "440000", region: "九州" },
  { name: "宮崎県", code: "450000", region: "九州" },
  { name: "鹿児島県", code: "460100", region: "九州" },
  // 沖縄
  { name: "沖縄本島地方", code: "471000", region: "沖縄" },
  { name: "大東島地方", code: "472000", region: "沖縄" },
  { name: "宮古島地方", code: "473000", region: "沖縄" },
  { name: "八重山地方", code: "474000", region: "沖縄" },
];

export const regions = [
  "北海道",
  "東北",
  "関東甲信",
  "北陸",
  "東海",
  "近畿",
  "中国",
  "四国",
  "九州",
  "沖縄",
];
