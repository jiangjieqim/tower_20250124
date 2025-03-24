import { ViewBase } from "../../../../../frame/view/ViewBase";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { SpineCoreSkel } from "../../avatar/spine/SpineCoreSkel";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeModel } from "../ComposeModel";
import { EHeroQua } from "../t_Battle_Config";
/**英雄召唤横幅 */
export class EpicView extends ViewBase {
    private _ui: Laya.View;
    private skel: SpineCoreSkel;
    public PageType: EPageType = EPageType.None;
    private model:ComposeModel;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.clearSkel();
        Laya.timer.callLater(this,this.onLater);       
    }

    private onLater(){
        if(this.model.epicHeroList.length > 0){
            let id = this.model.epicHeroList.shift();
            E.ViewMgr.Open(this.ViewType,null,id);
        }
    }

    private clearSkel(){
        if(this.skel){
            this.skel.dispose();
            this.skel = null;
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new Laya.View();
            this._ui.width = this._ui.height = 100;
            // this._ui.width = Laya.stage.width/2;
            // this._ui.height = Laya.stage.height;
        }
    }

    protected onInit(): void {
        this.clearSkel();
        // throw new Error("Method not implemented.");
        let heroId: number = this.Data;
        let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(heroId);
        this.skel = new SpineCoreSkel();
        // this.skel.setSlotSkin("hou", HeroListProxy.Ins.getSmallIconSkin(_heroCfg.f_imageid));
        this.skel.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
        this.skel.play(EAvatarAnim.TowerIdle, this, this.onPlayEnd, undefined, true);

        let _url:string;
        switch(_heroCfg.f_qua){
            case EHeroQua.Orange:
                _url = `o/spine/succeed/legend/legend.skel`;
                break;
            case EHeroQua.Purple:
                _url = `o/spine/succeed/Epic/Epic.skel`;
                break;
        }
        this.skel.load(_url);
    }

    protected onCompleteHander() {
        // LayerMgr.Ins.screenEffectLayer.addChild(this.skel.skeleton);
        if(this.skel.skeleton){
            this._ui.addChild(this.skel.skeleton);
            this.skel.skeleton.pos(this._ui.width / 2, this._ui.height / 2);
        }else{
            LogSys.Error("EpicView this.skel.skeleton is null");
        }
    }
    private onPlayEnd() {
        // this.dispose();
        this.Close();
    }
}