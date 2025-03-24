import { ui } from "../../../../../../ui/layaMaxUI";
import { stPlayerInRoom } from "../../../../../network/protocols/BaseProto";
import { ISimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { ChengHaoCtl } from "../../../common/ChengHaoCtl";
import { t_Medal } from "../../../towertmain/proxy/t_Medal";
import { t_Trophy_Reward } from "../../../towertmain/proxy/t_Trophy_Reward";
import { FightUIFactory } from "../../FightUIFactory";
interface IPveVsSkin{
    ch:ui.views.common.ui_chenghaoUI;
    eff:Laya.Sprite;
}
export class FightVsItem {
    private _tw: Laya.Tween = new Laya.Tween();
    private readonly moveTime: number = 500;
    private startX: number;
    private endX: number;
    private _hzEff:ISimpleEffect;
    // private offsetY: number = 0;
    private _ctl: ChengHaoCtl;
    // private btn:ButtonCtl;
    private _skin: ui.views.compose.ui_fightVsPlayerUI;
    get skin():Laya.View{
        return this._skin;
    }
    // private onEmpty(){

    // }
    constructor(skin: ui.views.compose.ui_fightVsPlayerUI, startX: number, endX: number) {
        this._skin = skin;
        // this.btn = ButtonCtl.CreateBtn(skin,this,this.onEmpty,false);
        // this.offsetY = offsetY;
        this.startX = startX;
        this.endX = endX;
    }
    updateItem(vo: stPlayerInRoom) {
        this._tw.clear();
        if (vo) {
            let item: ui.views.compose.ui_fightVsPlayerUI = this._skin;
            FightUIFactory.setPlayer(item, vo);
            // item.score.y = this.offsetY;
            let cfg = t_Trophy_Reward.Ins.getCfgByTrophyFront(vo.trophy);

            //============================================
            let sorce = item.score;
            if(sorce){
                this.refreshSorce(sorce,cfg);
            }

            item.lab_lv.text = `${vo.playerLevel}`;
            this._skin.x = this.startX;
            this._tw.to(this._skin, { x: this.endX }, this.moveTime);

            this.pveRefresh(item as any,vo);
        }
    }
    private pveRefresh(item:IPveVsSkin,vo: stPlayerInRoom){
        if(item.ch){
            this._ctl = new ChengHaoCtl(item.ch);
            this._ctl.setData(vo.titleId);
        }
        let cfgTr = t_Medal.Ins.getCfgByTr(vo.trophy);
        if(item.eff){
            //勋章特效
            this._hzEff = SpineEffectMgr.createMedalEffect(item.eff,cfgTr);
        }
    }

    /**设置段位 */
    private refreshSorce(sorce, cfg: Configs.t_Trophy_Reward_dat) {
        let arr = cfg.f_stage.split("-");
        sorce.img.skin = "remote/base/t_jl_d" + parseInt(arr[3]) + ".png";
        sorce.img1.skin = "remote/base/t_jl_d_" + parseInt(arr[2]) + ".png";
        sorce.img2.skin = "remote/base/t_jl_" + parseInt(arr[1]) + ".png";
        sorce.img3.skin = `o/trophyicon/${parseInt(arr[0])}.png`;
    }

    set visible(v: boolean) {
        this._skin.visible = v;
    }

    dispose(){
        if(this._hzEff){
            this._hzEff.dispose();
            this._hzEff = null;
        }
        this._skin.destroy(true);
        // if(this.btn){
        //     this.btn.dispose();
        //     this.btn = null;
        // }
    }
}