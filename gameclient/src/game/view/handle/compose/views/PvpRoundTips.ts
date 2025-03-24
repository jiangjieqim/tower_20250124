import { GameList } from "../../../../../frame/view/GameList";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeHero, ComposeMythosVo } from "../adapter/FightAdapter";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
/**查看英雄可合成状态tips */
// export class PvpRoundTips extends ViewBase{
//     private _ui:ui.views.compose.fightcell.ui_pvpround_tipsUI;
//     // protected mMaskClick:boolean = true;
//     protected autoFree:boolean = true;
//     PageType:EPageType = EPageType.None;
//     protected onAddLoadRes(): void {
//         // throw new Error("Method not implemented.");
//     }
//     protected onExit(): void {
//         // throw new Error("Method not implemented.");
//     }
//     protected onFirstInit(): void {
//         // throw new Error("Method not implemented.");
//         if(!this.UI){
//             this.UI = this._ui = new ui.views.compose.fightcell.ui_pvpround_tipsUI();
//         }
//     }
//     protected onInit(): void {
//         // throw new Error("Method not implemented.");
//     }
// }

/**查看英雄可合成状态tips */
export class PvpRoundTips extends ui.views.compose.fightcell.ui_pvpround_tipsUI{
    private heroList:HeroRoundTipCell[] = [];
    private _data:ComposeMythosVo;
    constructor(){
        super();
        this.heroList.push(this.t0,this.t1,this.t2,this.t3);
    }

    private get model(){
        return ComposeModel.Ins;
    }
    distory(){
        this.removeSelf();
    }

    hide(){
        this.model.off(ComposeEvent.HidePvpRoundTips,this,this.onHide);
        // this.model.off(ComposeEvent.UpdateSelfHero,this,this.onHide);
        if(this.parent){
            this.removeSelf();
        }
    }
    // get isShow(){
    //     return this.parent!=undefined;
    // }
    private onHide(){
        this.hide();
    }

    show(ox:number){
        this.model.on(ComposeEvent.HidePvpRoundTips,this,this.onHide);
        // this.model.on(ComposeEvent.UpdateSelfHero,this,this.onHide);
        this.bg0.x = -ox;
    }

    /**tips的宽度 */
    get curWidth(){
        return this.width;
    }
    /**设置神话英雄列表 */
    set data(_data:ComposeMythosVo){
        this._data = _data;
        let l = _data.heros;
        if(l.length == 4){
            this.width = 294;
        }else{
            this.width = 226;
        }
        this.bg0.width = this.width;

        for(let i = 0;i < this.heroList.length;i++){
            let cell = this.heroList[i];
            cell.data = l[i];
        }
    }
}

export class HeroRoundTipCell extends ui.views.compose.ui_pvpround_herotipcellUI{
    set data(vo:ComposeHero){
        if(!vo){
            this.visible = false;
        }else{
            this.visible = true;
            let _heroCfg = HeroListProxy.Ins.getCfgById(vo.heroId);
            this.qua.skin = HeroListProxy.Ins.getSmallQuaSkin(_heroCfg.f_qua);
            let imageId:number = TowertMainHeroModel.Ins.getImageIdById(vo.heroId);
            this.icon.skin = HeroListProxy.Ins.getSmallIconSkin(imageId);
            if(vo.have){
                this.gou.visible = true;
            }else{
                this.gou.visible = false;
            }
        }
    }
}

export interface IPvpRoundHeroTipsVo{
    list1:GameList;
    item:Laya.Sprite;
    heroVo:ComposeMythosVo;
    list1Pos:Laya.Point
}

/**查看神话英雄需要的英雄tips */
export class PvpRoundTipsView extends ViewBase{

    PageType:EPageType = EPageType.None;
    protected autoFree:boolean;
    protected mMask:boolean = true;
    protected mMaskClick:boolean = true;
    protected maskAlpha:number = 0.0;
    private _ui:PvpRoundTips;
    private _data: IPvpRoundHeroTipsVo;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new PvpRoundTips();
        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        let _data: IPvpRoundHeroTipsVo = this.Data;
        this._data = _data;
        this._ui.data = _data.heroVo;

        let time = parseInt(System_RefreshTimeProxy.Ins.getVal(104));
        Laya.timer.once(time,this,this.Close);
    }
 
    protected SetCenter(): void {
        let item = this._data.item;
        let tipsPos = (item.parent as Laya.Sprite).localToGlobal(new Laya.Point(item.x,item.y));
        this.UI.x = tipsPos.x;
        let ox = tipsPos.x - this._data.list1Pos.x + this._ui.curWidth - this._data.list1.width;
        this._ui.show(Math.max(0,ox));
        this.UI.y = tipsPos.y - this.UI.height;

        DebugUtil.draw(this.UI, "#ff00ff");
    }
}