// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { stStrengthenItem } from "../../../../network/protocols/BaseProto";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { IconUtils } from "../../main/model/IconUtils";
import { ComposeModel } from "../ComposeModel";
import { EBattle_Config, t_Battle_Config } from "../t_Battle_Config";
import { t_Herosummon_Rate } from "../t_Herosummon_Rate";

export class StrengthenItem extends ui.views.compose.ui_strengthenItemUI{
    // private _succeed:SimpleEffect;
    private con1:Laya.Sprite;
    constructor() {
        super();
        this.con1 = new Laya.Sprite();
        this.addChildAt(this.con1,1);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
    }

    private onBtnClick(){
        if(!this._data)return;
        // let req:StrengthenUpdate_req = new StrengthenUpdate_req;
        // req.pos = this._data.pos;
        // SocketMgr.Ins.SendMessageBin(req);
        ComposeModel.Ins.curAdapter.streng(this._data.pos);
    }

    playSucceed(){
        let res:string = `strong_${(this._data.pos + 1)}`;
        SpineEffectMgr.playOnce(`o/spine/succeed/${res}/${res}`,this.con1,this.width/2-3,this.height/2 - 12);
    }

    private _data:stStrengthenItem;
    public setData(value:stStrengthenItem,index:number){
        if(!value)return;
        this._data = value;
        this.lab.text = E.LangMgr.getLang("StrengthenItem_" + index);
        this.img.skin = "static/icon_st" + index + ".png";

        let limit:number = EBattle_Config.STRNG_MAX_LIMT + index * 3;
        let cost:number =  EBattle_Config.STRNG_COST + index * 3;
        let price:number = EBattle_Config.STRNG_PRICE + index * 3;
        switch(index){
            case 0:
            case 1:
            case 2:
                this.updateView(price,cost,limit);
                break;
            case 3:
                let nextCfg = t_Herosummon_Rate.Ins.getCfgByLv(value.level + 1);
                if (nextCfg) {
                    let cfg = t_Herosummon_Rate.Ins.getCfgByLv(value.level);
                    let arr = cfg.f_consume.split("-");
                    let id = parseInt(arr[0]);
                    let num = parseInt(arr[1]);
                    this.icon.skin = IconUtils.getIconByCfgId(id);
                    this.lab2.text = num + "";
                    this.lab1.text = "lv:" + this._data.level;
                    this.btn.mouseEnabled = true;
                    this.icon.visible = this.lab2.visible = true;
                    this.lab_max.visible = this.sp.visible = false;
                } else {
                    this.lab1.text = "lv:Max";
                    this.btn.mouseEnabled = false;
                    this.icon.visible = this.lab2.visible = false;
                    this.lab_max.visible = this.sp.visible = true;
                }
                break;
        }
    }

    private updateView(v1: number, v2: number, v3: number) {
        let max = parseInt(t_Battle_Config.Ins.getValueById(v3));
        if (this._data.level >= max) {
            this.lab1.text = "lv:Max";
            this.btn.mouseEnabled = false;
            this.icon.visible = this.lab2.visible = false;
            this.lab_max.visible = this.sp.visible = true;
        } else {
            let arr = t_Battle_Config.Ins.getValueById(v1).split("-");
            let id = parseInt(arr[0]);
            let num = parseInt(arr[1]);
            let addNum = parseInt(t_Battle_Config.Ins.getValueById(v2).split("-")[1]);
            this.icon.skin = IconUtils.getIconByCfgId(id);
            this.lab2.text = num + (this._data.level - 1) * addNum + "";
            this.lab1.text = "lv:" + this._data.level;
            this.btn.mouseEnabled = true;
            this.icon.visible = this.lab2.visible = true;
            this.lab_max.visible = this.sp.visible = false;
        }
    }
}