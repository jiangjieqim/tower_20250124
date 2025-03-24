// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { E } from "../../../../../G";
import { MainIconProxy } from "../../../funs/proxy/FunctionProxy";

export class BaseMainIcon{
    public skin:Laya.Sprite;
    // public itemKey:string =  "BaseMainIcon";
    public pos:number;
    public ctl:ButtonCtl;
    public cfg:Configs.t_MainIcon_dat;
    protected _mainIconProxy:MainIconProxy;
    protected _mainCfg:Configs.t_MainIcon_dat;
    public get funcId(){
        return this._mainCfg.f_funid
    }
    constructor(){
        this._mainIconProxy = MainIconProxy.Ins;
    }
    public setpos(x:number,y:number){
        this.ctl.setpos(x,y);
    }
    public initCfg(cfg:Configs.t_MainIcon_dat){
        this.cfg = cfg;
        this.initPos(cfg.f_pos);
    }
    public initPos(pos:number){
        if(!this.ctl){
            this.ctl = new ButtonCtl(this.skin,new Laya.Handler(this,this.onClickHandler));
        }
        this.pos = pos;
        this._mainCfg = this._mainIconProxy.getCfgByPosition(pos);
        
        this.icon.centerX = this.icon.centerY = 0;

        if(this._mainCfg){
            this.icon.skin = `remote/main/main/${this._mainCfg.f_icon}`;
        }else{
            this.icon.skin = "";
        }
        // this.skin['red'].visible = false;
        // this.redVisible = false;
    }

    // protected set redVisible(v){
    //     let redImg:Laya.Image = this.skin["redicon"] || this.skin["red"];
    //     if(redImg){
    //         redImg.visible = v;
    //     }
    // }

    protected onClickHandler(){
        if (!this._mainCfg) return;
        E.ViewMgr.OpenByFuncid(this._mainCfg.f_funid);
    }

    public dispose(){
        this.ctl.dispose();
        this.skin.removeSelf();
    }

    public update(){

    }
    /**
     * override
     */
    public get icon():Laya.Image{
        return null;
    }

    public set visible(v:boolean){
        this.skin.visible = v;
    }
}