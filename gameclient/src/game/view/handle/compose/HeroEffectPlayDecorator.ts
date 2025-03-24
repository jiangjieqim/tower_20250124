import { ComposeEvent } from "./ComposeEvent";
import { BaseDecorator } from "./views/avatar/BaseDecorator";
import { EEffectTarget } from "./vos/EFightEnum";
// 43：被破坏的英雄播放特效23 剩下的播放1
// 45：BOSS播放特效9
export class HeroEffectPlayDecorator extends BaseDecorator{
    private onUpdateSurplusHeros(cardId: number, f_surplus_heros: number, playerId: number) {
        if (cardId > 0 && f_surplus_heros) {
            for (let i = 0; i < this.model.refreshList.length; i++) {
                let o = this.model.refreshList[i];
                if (o.playerId == playerId) {
                    this.model.playCardOnce(o.uid, cardId, EEffectTarget.Grid, playerId, 0, f_surplus_heros);
                }
            }
        }
    }

    onExit() {
        this.model.off(ComposeEvent.UpdateSurplusHeros, this, this.onUpdateSurplusHeros);
    }

    onInit() {
        this.model.on(ComposeEvent.UpdateSurplusHeros, this, this.onUpdateSurplusHeros);
    }
}