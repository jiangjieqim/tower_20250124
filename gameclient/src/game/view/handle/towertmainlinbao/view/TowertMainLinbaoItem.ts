import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { MainModel } from "../../main/model/MainModel";
import { TowertMainLinbaoModel } from "../model/TowertMainLinbaoModel";
import { t_Treasure } from "../proxy/t_Treasure";
import { t_Treasure_Upgrade } from "../proxy/t_Treasure_Upgrade";

export class TowertMainLinbaoItem extends ui.views.linbao.ui_linbaoItemUI{
    private _wid:number;

    constructor() {
        super();
        this._wid = this.pro.width;
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        E.ViewMgr.Open(EViewType.TowertMainLinbaoTip,null,[this._data,true]);
        let ind = TowertMainLinbaoModel.Ins.newList.findIndex(ele => ele.id === this._data.f_treasureid);
        if (ind != -1 && TowertMainLinbaoModel.Ins.newList[ind].isSelect == false) {
            TowertMainLinbaoModel.Ins.newList[ind].isSelect = true;
            TowertMainLinbaoModel.Ins.event(TowertMainLinbaoModel.UPDATE_LINBAO);
        }
    }

    private _data:Configs.t_Treasure_dat;
    public setData(value:Configs.t_Treasure_dat){
        if(!value)return;
        this._data = value;
        this.img.skin = t_Treasure.Ins.getQuaSkin(value.f_qua);
        this.lab.text = value.f_treasure_name;
        this.icon.skin = t_Treasure.Ins.getIcon(value.f_icon);
        let data = TowertMainLinbaoModel.Ins.getLinBaoById(value.f_treasureid);
        this.lab1.text = "LV:" + data.level;
        this.sp.visible = false;
        let nextCfg = t_Treasure_Upgrade.Ins.getNextCfgByIdAndLv(value.f_treasureid,data.level);
        if(nextCfg){
            this.sp1.visible = true;
            this.mj.visible = false;
            let cfg = t_Treasure_Upgrade.Ins.getCfgByIdAndLv(value.f_treasureid,data.level);
            let arr = cfg.f_upgrade_consume.split("|");
            let id = parseInt(arr[0].split("-")[0]);
            let need = parseInt(arr[0].split("-")[1]);
            let count = MainModel.Ins.mRoleData.getVal(id);
            if(count >= need){
                this.pro.width = this._wid;
                this.sp.visible = true;
            }else{
                this.pro.width = count / need * this._wid;
            }
            this.lab2.text = count + "/" + need;
        }else{
            this.sp1.visible = false;
            this.mj.visible = true;
        }

        this.img_new.visible = false;
        let ind = TowertMainLinbaoModel.Ins.newList.findIndex(ele => ele.id === value.f_treasureid);
        if(ind != -1 && TowertMainLinbaoModel.Ins.newList[ind].isSelect == false){
            this.img_new.visible = true;
        }
    }
}