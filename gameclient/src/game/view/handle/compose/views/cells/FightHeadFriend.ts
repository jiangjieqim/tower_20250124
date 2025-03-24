import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { stPlayerInRoom } from "../../../../../network/protocols/BaseProto";
import { MainModel } from "../../../main/model/MainModel";
import { FightUIFactory } from "../../FightUIFactory";
import { FightUtils } from "../../FightUtils";
import { IFightHead } from "./FightHead";

export interface IHeadSkin {
    headicon: Laya.Image;
    nameTf: Laya.Label;
    scroeTf: Laya.Label;
}
/**合作模式 */
export class FightHeadFriend extends IFightHead {
    onCenter() {
        // throw new Error("Method not implemented.");
    }

    private skin: ui.views.compose.fightcell.ui_fight_top_friendUI;
    // private get model() {
    //     return ComposeModel.Ins;
    // }
    init(container: Laya.Sprite): void {
        // throw new Error("Method not implemented.");
        this.skin = new ui.views.compose.fightcell.ui_fight_top_friendUI();
        container.addChildAt(this.skin,0);
        // this.model.on(ComposeEvent.RoomInfoUpdate,this,this.onUpdateRoom);
        // this.onUpdateRoom();
        this.onInit();
    }

    onShow(){
        
    }

    protected onUpdateRoom(){
        this.setPlayerHead(this.skin.leftplayer, this.model.ownerPlayer);
        this.setPlayerHead(this.skin.rightplayer, this.model.enemyPlayer);
    }

    updateMonsterCount(owner: number, pvp: number) {
        // throw new Error("Method not implemented.");

        let leftMax = this.model.ownerPlayer.maxMonster;
        let rightMax = this.model.enemyPlayer.maxMonster;

        let cur: number = owner;
        let other: number = pvp;

        let all = cur + other;
        let moneterMax: number = leftMax + rightMax;

        this.updateProgess(all, moneterMax);
    }

    private updateProgess(all: number, moneterMax: number) {
        this.model.showErrTips(all, moneterMax);
        this.skin.enemyTf.text = `${all}/${moneterMax}`;
        this.skin.progress.width = FightUtils.convertProgressVal(222,all, moneterMax);
    }
    dispose() {
        // throw new Error("Method not implemented.");
        super.dispose();
        this.skin.removeSelf();
    }

    private setPlayerHead(skin: IHeadSkin, vo: stPlayerInRoom) {
        if (vo) {
            let url = MainModel.Ins.convertHead(vo.headUrl);
            MainModel.Ins.setTTHead(skin.headicon, url);
            skin.scroeTf.text = vo.trophy + "";
            skin.nameTf.text = FightUIFactory.convertNickName(vo);
        }
    }

    set wave(_wave: number) {
        this.skin.scroeTf.text = E.getLang("waveCount", _wave);
    }

    set subTime(sub: number) {
        this.skin.timeTf.text = TimeUtil.subTimeHMS_EN(sub);
    }
}