import { describe, expect, it } from "vitest";
import {
  cutNightDeck,
  dealNightCards,
  meaningOf,
  NIGHT_ARCANA,
  summarizeReading,
} from "./tarot";
describe("完整大阿卡纳与牌局", () => {
  it("牌库包含22张编号唯一、带正逆位内容的牌", () => {
    expect(NIGHT_ARCANA).toHaveLength(22);
    expect(new Set(NIGHT_ARCANA.map((card) => card.id)).size).toBe(22);
    expect(new Set(NIGHT_ARCANA.map((card) => card.number)).size).toBe(22);
    for (const card of NIGHT_ARCANA) {
      expect(card.upright.message).not.toBe(card.reversed.message);
      expect(card.upright.practice.length).toBeGreaterThan(8);
    }
  });
  it("洗牌不重复，正逆位选项生效，切牌保持牌与方向对应", () => {
    const deck = dealNightCards(true, () => 0.25);
    expect(deck).toHaveLength(22);
    expect(new Set(deck.map((draw) => draw.card.id)).size).toBe(22);
    expect(deck.every((draw) => draw.reversed)).toBe(true);
    const cut = cutNightDeck(deck, 7);
    expect(cut[0]).toBe(deck[7]);
    expect(cut.map((draw) => draw.card.id)).toEqual(
      [...deck.slice(7), ...deck.slice(0, 7)].map((draw) => draw.card.id),
    );
    expect(deck[0]).not.toBe(cut[0]);
    expect(
      dealNightCards(false, () => 0.25).every((draw) => !draw.reversed),
    ).toBe(true);
  });
  it("综合解读随牌阵和方向改变", () => {
    const deck = dealNightCards(false, () => 0.4);
    const normal = deck.slice(0, 3);
    const reversed = normal.map((draw) => ({ ...draw, reversed: true }));
    expect(meaningOf(normal[0])).not.toEqual(meaningOf(reversed[0]));
    expect(summarizeReading(reversed, "moon")).toContain("3 张逆位");
    expect(summarizeReading(normal, "river")).toContain("来处");
    expect(summarizeReading(deck.slice(0, 5), "paths")).toContain("道路 B");
    expect(summarizeReading(normal, "moon")).not.toBe(
      summarizeReading(reversed, "moon"),
    );
  });
});
