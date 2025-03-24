import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { MainModel } from "../../../main/model/MainModel";
import { TowertMainLinbaoModel } from "../../model/TowertMainLinbaoModel";
import { t_Treasure } from "../../proxy/t_Treasure";
import { t_Treasure_Upgrade } from "../../proxy/t_Treasure_Upgrade";

export class LinBaoCQCtl {
    protected _ui:ui.views.linbaocq.ui_linbaoCQItemUI;
    private _wid:number;

    constructor(skin:ui.views.linbaocq.ui_linbaoCQItemUI) {
        this._ui = skin;
        this._wid = this._ui.pro.width;
        this._ui.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        E.ViewMgr.Open(EViewType.TowertMainLinbaoTip,null,[this._data,false]);
    }

    private _data:Configs.t_Treasure_dat;
    public setData(value:any){
        if(!value)return;
        this._data = t_Treasure.Ins.getCfgById(value.data.id);
        this._ui.img.skin = "remote/linbaocq/icon" + this._data.f_qua + ".png";
        this._ui.lab.text = this._data.f_treasure_name;
        this._ui.icon.skin = t_Treasure.Ins.getIcon(this._data.f_icon);
        let data = TowertMainLinbaoModel.Ins.getLinBaoById(this._data.f_treasureid);
        this._ui.lab1.text = "LV:" + data.level;
        this._ui.sp.visible = false;
        let nextCfg = t_Treasure_Upgrade.Ins.getNextCfgByIdAndLv(this._data.f_treasureid,data.level);
        if(nextCfg){
            this._ui.sp1.visible = true;
            this._ui.mj.visible = false;
            let cfg = t_Treasure_Upgrade.Ins.getCfgByIdAndLv(this._data.f_treasureid,data.level);
            let arr = cfg.f_upgrade_consume.split("|");
            let id = parseInt(arr[0].split("-")[0]);
            let need = parseInt(arr[0].split("-")[1]);
            let count = MainModel.Ins.mRoleData.getVal(id);
            if(count >= need){
                this._ui.pro.width = this._wid;
                this._ui.sp.visible = true;
            }else{
                this._ui.pro.width = count / need * this._wid;
            }
            this._ui.lab2.text = count + "/" + need;
        }else{
            this._ui.sp1.visible = false;
            this._ui.mj.visible = true;
        }
        if(value.flag){
            this._ui.img_new.visible = true;
        }else{
            this._ui.img_new.visible = false;
        }
    }
}