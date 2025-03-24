import { GameList } from "../../../../../frame/view/GameList";
import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { ISimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { IconUtils } from "../../main/model/IconUtils";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeMythosVo, EPVPRoundFightStatus } from "../adapter/FightAdapter";
import { ComposeModel } from "../ComposeModel";
import { HeroWeight } from "../vos/HeroWeight";
import { IPvpRoundHeroTipsVo } from "./PvpRoundTips";
import { PvpRoundView } from "./PvpRoundView";
/**
 * 神话英雄Cell
 */
export class PvpRoundHeroCell extends ui.views.compose.fightcell.ui_pvpround_itemUI {
    private _heroVo: ComposeMythosVo;
    private sommonBtn: ButtonCtl;
    private index:number;
    private statusCtl:PvpRoundStatus;
    private eff:ISimpleEffect;
    private get model() {
        return ComposeModel.Ins;
    }
    constructor() {
        super();
        this.statusCtl = new PvpRoundStatus();
        this.statusCtl.skin = this.heros;
        this.statusCtl.init();
        this.sommonBtn = ButtonCtl.CreateBtn(this.btn, this, this.onSommonHandler);
        // this.star.visible = false;
        this.bg.on(Laya.Event.CLICK,this,this.onBgClick);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onUnDisplay(){
       this.disposeEff();
    }
    private disposeEff(){
        if(this.eff){
            this.eff.dispose();
            this.eff = null;
        }
    }
    private onBgClick(){
        let view:PvpRoundView = (E.ViewMgr.Get(EViewType.PvpRoundView) as PvpRoundView);
        
        let _cellPos = (this.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.x,this.y));
        let list1:GameList = view._ui.list1;
        let list1Pos = (list1.parent as Laya.Sprite).localToGlobal(new Laya.Point(list1.x,list1.y));
        let cellWidth:number = list1.cells[0].width;
        if(_cellPos.x < list1Pos.x){
            //左
            list1.scrollTo(this.index);
        }
        else if(_cellPos.x - list1Pos.x + cellWidth > list1.width){
            //超右框
            let count: number = list1.width / (cellWidth + list1.spaceX);
            list1.scrollTo(this.index - Math.floor(count) + 1);
        }
        
        // let tips = view.pvpRoundTips;
        // if(tips){
        //     // ========================================================
        //     tips.y = -tips.height;
        //     this.addChild(tips);

        //     tips.data = this._heroVo;
        //     let tipsPos = (tips.parent as Laya.Sprite).localToGlobal(new Laya.Point(tips.x,tips.y));
        //     let ox = tipsPos.x - list1Pos.x + tips.curWidth - list1.width;
        //     tips.show(Math.max(0,ox));
        //     // ======================================================== 
        // }

        let vo:IPvpRoundHeroTipsVo = {
            list1:list1,
            item:this,
            heroVo:this._heroVo,
            list1Pos:list1Pos
        } as IPvpRoundHeroTipsVo;
        E.ViewMgr.Open(EViewType.PvpRoundTipsView,null,vo);

    }

    private onSommonHandler() {
        this.model.curAdapter.summonHero(this._heroVo.mythosHeroId);
    }
    refresh(index:number) {
        this.index = index;
        DebugUtil.drawTF(this,index+"","#00ff00");
        this._heroVo = this.dataSource;
        let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(this._heroVo.mythosHeroId);
        let per: number = HeroWeight.calPercent(_heroCfg.f_heroid);
        let needEff:boolean;
        if (per >= 100) {
            this.sommonBtn.visible = true;
            needEff = true;
        } else {
            this.sommonBtn.visible = false;
        }

        if(needEff){
            if(!this.eff){
                this.eff = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/yingxiong_kuang/yingxiong_kuang`,this,this.width/2,this.height/2);
            }
        }else{
            this.disposeEff();
        }

        let imageId = TowertMainHeroModel.Ins.getImageIdById(_heroCfg.f_heroid);
        this.icon.skin = HeroListProxy.Ins.getSmallIconSkin(imageId);
        // this.heros.refresh(this._heroVo);
        this.statusCtl.refresh(this._heroVo);

        switch(this.model.fightTypeAdaper.pvpRoundStatus){
            case EPVPRoundFightStatus.Ready:
                this.sommonBtn.grayMouseDisable = false;
                break;
            case EPVPRoundFightStatus.SelfReadyComplete:
            case EPVPRoundFightStatus.Fight:
                this.sommonBtn.grayMouseDisable = true;
                break;
        }

        let vo = TowertMainHeroModel.Ins.getHeroById(this._heroVo.mythosHeroId);
        if(vo){
            this.star.skin = IconUtils.getCollectSkin(vo,true);
        }
    }
}
interface IPvpRoundStatusSkin{
    s0:Laya.Image;
    s1:Laya.Image;
    s2:Laya.Image;
    s3:Laya.Image;
}
/** 英雄可合成状态 */
export class PvpRoundStatus{
    skin:IPvpRoundStatusSkin;
    private gap:number;
    init(){
        this.gap = this.skin.s1.x - this.skin.s0.x - this.skin.s0.width;
    }
    refresh(_vo: ComposeMythosVo) {
        let l = _vo.heros;
        let ox: number = 0;
        // const gap: number = 4;
        if (l.length <= 3) {
            ox = 10;
        }
        for (let i = 0; i < 4; i++) {
            let img: Laya.Image = this.skin[`s${i}`];
            let vo = l[i];
            if (vo) {
                img.x = ox + i * (img.width + this.gap);
                img.visible = true;
                this.showImg(img, vo.heroId, vo.have);
            } else {
                img.visible = false;
            }
        }
    }

    private showImg(statusImg:Laya.Image,heroId: number, show: boolean) {
        let cfg = HeroListProxy.Ins.getCfgById(heroId);
        statusImg.skin = `remote/pvpround/qua${cfg.f_qua}.png`;
        (statusImg.getChildAt(0) as Laya.Image).visible = show;
    }
}