import { E } from "../../../G";
import { BaseCfg } from "../../../static/json/data/BaseCfg";

export class t_Inner_Sound extends BaseCfg {
    public GetTabelName(): string {
        return "t_Inner_Sound";
    }

    private static _ins: t_Inner_Sound;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new t_Inner_Sound();
        }
        return this._ins;
    }
    play(type:EInnerSoundType){
        let l:Configs.t_Inner_Sound_dat[] = this.List;
        let cell = l.find(o=>o.f_id == type);
        if(cell){
            E.AudioMgr.PlaySound1(cell.f_name);
        }
    }
}
export enum EInnerSoundType {
    /**
     * 召唤英雄
     */
    SommonHero = 1,
    /**
     * 祈愿成功
     */
    GambleSucceed = 2,
    /**
     * 祈愿失败
     */
    GambleFail = 3,

    /**游戏胜利 */
    GameOverSucceed = 4,

    /**游戏失败 */
    GameOverFail = 5,

    /**BOSS来袭 */
    BossComing = 6,

    /**怪物上限提醒 */
    MonsterMuchMoreTips = 7,

    /**己方合成音效 */
    ComposeHero = 8,
}