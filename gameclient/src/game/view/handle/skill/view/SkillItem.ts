import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { SkillListProxy } from "../proxy/SkillProxy";

export class SkillItem extends ui.views.common.ui_skillItemUI{
    constructor() {
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
        this.icon.name = "skillIcon";
        // this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    // private onUnDisplay(){
    //     this.icon.clearTex();
    // }

    protected onClick(){
        if(this._isClick){
            E.ViewMgr.Open(EViewType.SkillTip,null,[this._id,this._lockLv]);
        }
    }

    protected _id:number;
    private _lv:number;
    private _lockLv:number;
    private _isClick:boolean;
    public setData(value,lv:number,isClick:boolean = true) {
        this.icon.clearTex();
        if (!value) return;
        this._lv = parseInt(value.split("-")[0]);
        this._id = parseInt(value.split("-")[1]);
        this._isClick = isClick;
        // let cfg = TowertMainHeroModel.Ins.getHeroById(heroId);
        // let lv = 1;
        // if(cfg){
        //     lv = cfg.level;
        // }
        this.icon.skin = SkillListProxy.Ins.getIconById(this._id);

        DebugUtil.drawTF(this,this._id.toString(),"#00ff00");

        if(lv >= this._lv){
            this.lock.visible = false;
            this._lockLv = 0;
        }else{
            this.lock.visible = true;
            this._lockLv = this._lv;
        }
    }
}