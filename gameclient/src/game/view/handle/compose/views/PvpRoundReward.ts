import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { WaveSettleReward_revc } from "../../../../network/protocols/BaseProto";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ECellType } from "../../main/vos/ECellType";
import { ItemVo } from "../../main/vos/ItemVo";
import { ComposeModel } from "../ComposeModel";
import { t_Battle_Config } from "../t_Battle_Config";
import { EFightMode } from "../vos/EFightEnum";
import { t_Wave } from "./t_Wave";
/**PVP回合制奖励 */
export class PvpRoundReward extends ViewBase {
    private _data: WaveSettleReward_revc;
    private _ui: ui.views.compose.ui_pvpround_rewardUI;
    protected autoFree: boolean = true;
    PageType: EPageType.None;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
        this.addAtlas("pvproundresult.atlas")
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.UI = this._ui = new ui.views.compose.ui_pvpround_rewardUI();
        }
    }
    private get model(){
        return ComposeModel.Ins;
    }
    protected SetCenter(){
        super.SetCenter(this.model.fightView);
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        let time = parseInt(System_RefreshTimeProxy.Ins.getVal(107));
        Laya.timer.once(time, this, this.Close);

        this._data = this.Data;
        if (this._data) {
            // LogSys.Log(`reward:`+JSON.stringify(this._data));
            let _WaveTb:t_Wave = E.tableMgr.getTable(t_Wave.NAME);
            let mode = EFightMode.PVP_Round;
            // let s1 = _WaveTb.getTotalWave(mode,this._data.wave);
            // let itemList = ItemViewFactory.convertItemList(s1);
            let cfg = _WaveTb.getCurWave(mode,this._data.wave);
            let curList = ItemViewFactory.convertItemList(cfg.f_base_currency);
            //=======================================================================
            
            this.updateCell(curList,ECellType.FIGHT_MONEY);
            this.updateCell(curList,ECellType.FIGHT_STONE);
            if(this._data.win){
                this._ui.failImg.visible = false;
            }else{
                this._ui.failImg.visible = true;
            }
        }
    }

    private updateCell(curList:ItemVo[],type:number){
        // let oldItem = oldList.find(o=>o.cfgId == type);
        let total = this._data.itemlist.find(o=>o.id == type);
        let moneyLb:Laya.Label = this._ui[`money${type}`];
        
        let cur = curList.find(o=>o.cfgId == type);

        if(total){
            moneyLb.text = cur.count + "";
        }
        let lb:Laya.Label = this._ui[`moneyadd${type}`];
        /*
        if(oldItem && total.count > oldItem.count){
            lb.text = `+${total.count - oldItem.count}`;
        }else{
            lb.text = "";
        }
        */

        //==============================================================
        let arr = t_Battle_Config.Ins.getValueById(59).split("|");
        let itemvo = ItemViewFactory.convertItem(arr[0]);
        if(this._data.win == 0 && itemvo && itemvo.cfgId == type){
            lb.text = `+${itemvo.count}`;
        }else{
            lb.text = "";
        }
        //==============================================================

        lb.x = moneyLb.x + moneyLb.textField.textWidth;
    }
}