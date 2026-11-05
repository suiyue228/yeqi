import { PaperProscenium, TheatreImage } from "../components/PaperTheatreArt";
import { RoomHeader } from "../components/RoomHeader";
import { TheatrePassage } from "../components/TheatrePassage";
import { usePaperTilt } from "../hooks/usePaperTilt";

export function Astrologer({ navigate }: { navigate: (path: string) => void }) {
  const { stage, tilt, resetTilt } = usePaperTilt();
  const approach = () => navigate("/theatre/astrologer/table");
  return (
    <div className="page module-page theatre-page">
      <RoomHeader
        chapter="ACT IV · THE MOTH ORACLE"
        title="栖星占星小店"
        intro="邮差把没有地址的星光送到这里。占星师岑会为你留一张椅子。"
        navigate={navigate}
      />
      <section className="theatre-shell" aria-label="栖星占星小店纸艺舞台">
        <div className="theatre-titleplate">
          <span>栖 星 占 星 小 店</span>
          <small>THE MOTH ORACLE · IV</small>
        </div>
        <div
          ref={stage}
          className="paper-stage paper-act oracle-shop"
          onPointerMove={tilt}
          onPointerLeave={resetTilt}
          onPointerCancel={resetTilt}
        >
          <div className="stage-volume">
            <div className="paper-layer act-back">
              <TheatreImage name="astrologer-room" />
            </div>
            <div className="shop-suspended" aria-hidden="true">
              <TheatreImage name="keeper-moths" />
            </div>
            <div className="shop-witch" aria-hidden="true">
              <TheatreImage name="astrologer-witch" />
            </div>
            <button
              className="stage-mechanism shop-counter"
              onClick={approach}
              aria-label="触碰水晶球，坐到占卜桌前"
            >
              <TheatreImage name="astrologer-counter" />
              <small>触 碰 水 晶 球 ↗</small>
            </button>
            <TheatrePassage
              kind="door"
              destination="星图邮局"
              onEnter={() => navigate("/theatre/post")}
            />
            <div className="shop-candles" aria-hidden="true">
              <TheatreImage name="keeper-candles" />
            </div>
            <div className="paper-layer paper-front">
              <PaperProscenium />
            </div>
          </div>
        </div>
        <div className="theatre-footlights" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <TheatreImage key={i} name="star-gold" />
          ))}
        </div>
      </section>
      <div className="theatre-script">
        <section className="keeper-lines">
          <span className="eyebrow">岑 / THE MOTH ORACLE</span>
          <blockquote>「有些问题要先放到桌上，才看得见它的形状。」</blockquote>
          <p>岑把斗篷拢好，在水晶球旁为你摊开一方星纹桌布。</p>
        </section>
        <section className="prop-notes">
          <span className="eyebrow">夜栖秘仪 · 三张牌</span>
          <p>默想一件在意的事，选三张牌，从眼前、暗处和下一步分别看它。</p>
          <button className="text-button" onClick={approach}>
            坐到占卜桌前 ⟶
          </button>
        </section>
      </div>
    </div>
  );
}
