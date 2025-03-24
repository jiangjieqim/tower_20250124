// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
import { ui } from "../../../../../../ui/layaMaxUI";
import { stHero, SuperHero_req } from "../../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { NoContainerSimpleEffect } from "../../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../../avatar/SpineEffectMgr";
import { TowertMainHeroModel } from "../../../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../../../towertmainhero/proxy/HeroProxy";

export class RedHeroHeadCell extends ui.views.compose.fightcell.ui_redhero_head_cellUI{
    static CellWidth:number = 121;
    static CLS_KEY:string = "RedHeroHeadCell";
    private vo:stHero;
    private effect:NoContainerSimpleEffect;
    mShow:boolean;
    constructor(){
        super();
        this.on(Laya.Event.CLICK,this,this.onClickHandler);
        DebugUtil.draw(this,DebugUtil.COLOR_PURPLE);
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onDisplay(){
        
    }
    private onUnDisplay(){
        this.disposEffect();
    }
    private disposEffect(){
        if(this.effect){
            this.effect.dispose();
            this.effect = null;
        }
    }
    private onClickHandler(){
        let req:SuperHero_req = new SuperHero_req();
        req.heroId = this.vo.id;
        SocketMgr.Ins.SendMessageBin(req);
    }
    dispose(){
        this.removeSelf();
        this.disposEffect();
        Laya.Pool.recover(RedHeroHeadCell.CLS_KEY,this);
    }
    set visible(v:boolean){
        super.visible = v;
        if(v){
            if(!this.effect){
                this.effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/shenhuazhaohuan/shenhuazhaohuan`,this,this.width/2,this.height/2,undefined,2);
            }
        }else{
            this.disposEffect();
        }
    }
    updateView(vo:stHero){
        this.vo = vo;
        let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(vo.id);
        // let imageId = TowertMainHeroModel.Ins.getDefImageIdById(vo.id)
        let imageId = TowertMainHeroModel.Ins.getImageIdById(vo.id);
        this.icon.skin = HeroListProxy.Ins.getHeroBigIconSkin(imageId);
        this.qua.skin = HeroListProxy.Ins.getSmallQuaSkin(_heroCfg.f_qua);
        DebugUtil.drawTF(this,vo.id+"");
    }

    updateVis(){
        this.visible = this.mShow;
    }
}