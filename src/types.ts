export const MOODS = [
  { id: "sun", name: "晴光", meaning: "开心 · 轻松", symbol: "☀" },
  { id: "mist", name: "月雾", meaning: "平静 · 疲惫", symbol: "☾" },
  { id: "tide", name: "暗潮", meaning: "难过 · 烦躁", symbol: "≋" },
  { id: "spark", name: "星火", meaning: "期待 · 兴奋", symbol: "✧" },
  { id: "rain", name: "夜雨", meaning: "迷茫 · 低落", symbol: "☂" },
] as const;
export type Mood = (typeof MOODS)[number]["id"];
export interface Entry {
  id: string;
  title: string;
  body: string;
  mood: Mood;
  tags: string[];
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}
export const moodOf = (id: Mood) => MOODS.find((m) => m.id === id)!;
