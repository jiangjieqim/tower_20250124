import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { FunctionModel } from "../../../funs/FunctionModel";
import { EFuncDef } from "../../../main/model/EFuncDef";
import { TowerMainEvent } from "../../model/TowerMainEvent";
import { TowerMainModel } from "../../model/TowerMainModel";

export class TowerMainBBCtl{
    protected _ui:ui.views.main.ui_tower_main_bb_itemUI;
    private _fid:number;
    private _index:number;

    constructor(skin:ui.views.main.ui_tower_main_bb_itemUI,fid:number,index:number){
        this._ui = skin;
        this._fid = fid;
        this._index = index;
        this._ui.on(Laya.Event.CLICK,this,this.onClick);
        this._ui.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this._ui.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onClick(){
        if(this._fid == EFuncDef.JunTuan){
            E.ViewMgr.ShowMidError(E.getLang("NotYetOpen"));
            return;
        }
        if(FunctionModel.Ins.isOpenByFuncId(this._fid)){
            TowerMainModel.Ins.event(TowerMainEvent.UPDATE_BBTN_CLICK,[this._index]);
            E.EventMgr.emit(EventID.ButtonCtlClick,this._ui);
        }
    }

    private onDisplay(){
        
    }

    private onUnDisplay(){
        
    }

    public updateData(){
        if(!this._fid)return;
        if(!FunctionModel.Ins.isOpenByFuncId(this._fid,false)){
            this._ui.m.visible = true;
        }else{
            this._ui.m.visible = false;
        }
    }
    private get atlasKey(){
        return "base";//towerMain
    }
    public setStyle(){
        this._ui.icon.skin = `remote/${this.atlasKey}/tab${this._index}_${this._index}.png`;
        this._ui.img.skin = `remote/${this.atlasKey}/btn_main_n.png`;
        this._ui.img1.skin = `remote/${this.atlasKey}/tabtx${this._index}_${this._index}.png`;
        this._ui.icon.y = 85;
    }

    public setStyle1(){
        this._ui.icon.skin = `remote/${this.atlasKey}/tab${this._index}.png`;
        this._ui.img.skin = `remote/${this.atlasKey}/btn_main_s.png`;
        this._ui.img1.skin = `remote/${this.atlasKey}/tabtx${this._index}.png`;
        this._ui.icon.y = 75;
    }
}