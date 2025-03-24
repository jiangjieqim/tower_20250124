// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { stHero } from "../../../../network/protocols/BaseProto";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { HeroWeight } from "../vos/HeroWeight";
import { FightTaskHeroCell } from "./cells/FightTaskHeroCell";
import { MythosCellView } from "./cells/MythosCellView";
import { HeroAvatarView } from "./HeroAvatarView";
/**神话 */
export class MythosView extends ViewBase {
    protected mMask: boolean = true;
    protected autoFree:boolean = true;
    private _ui: ui.views.compose.ui_mythos_viewUI;
    private _myThosList: stHero[];
    private summonBtnCtl:ButtonCtl;
    private _hero:HeroAvatarView;
    private model:ComposeModel;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }

    // protected get curPageType(){
    //     if(MainModel.Ins.isGuide) {
    //         return EPageType.None;
    //     }
    //     return this.PageType;
    // }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        // Laya.Loader.clearTextureRes(this._ui.bg.skin);
        this.summonBtnCtl.dispose();
        this.disposeHero();
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if (!this.UI) {
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.ui_mythos_viewUI();
            this.bindClose(this._ui.closeBtn);
            this._ui.heroList.itemRender = MythosCellView;
            this._ui.heroList.renderHandler = new Laya.Handler(this,this.onMythosCellRender);
            this._ui.heroList.selectEnable = true;
            this._ui.heroList.selectHandler = new Laya.Handler(this,this.onSelectHandelr);
            this.summonBtnCtl = ButtonCtl.CreateBtn(this._ui.summonBtn,this,this.onSummonHandler);
        }
    }
    private disposeHero(){
        if(this._hero){
            this._hero.dispose();
            this._hero = null;
        }
    }
    /**召唤 */
    private onSummonHandler() {
        let _heroVo: stHero = this._myThosList[this._ui.heroList.selectedIndex];
        this.model.curAdapter.summonHero(_heroVo.id);
        //为了检测引导组件获取Next逻辑 下一帧关闭
        Laya.timer.frameOnce(1,this,this.Close);
    }

    private onSelectHandelr(index: number) {
        let _heroVo:stHero = this._myThosList[index];
        let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(_heroVo.id);
        this._ui.lb0.text = _heroCfg.f_hero;
        this.disposeHero();
        // this._hero = FightFactory.createHero();
        // this._hero.once(Laya.Event.COMPLETE,this,this.onHeroComplete);
        // FightFactory.loadByHeroId(this._hero,_heroVo.id);
        this._hero = FightFactory.createHeroAvatar(_heroVo.id,this._ui,420,615);

        let per:number = HeroWeight.calPercent(_heroCfg.f_heroid);
        this._ui.lb1.text = `${E.getLang("succeedpercent")}${per}%`;

        let _needArr:string[] = [];
        if(!StringUtil.IsNullOrEmpty(_heroCfg.f_synthesis)){
            let arr1 = _heroCfg.f_synthesis.split("|");
            _needArr = _needArr.concat(arr1);
        }
        if(!StringUtil.IsNullOrEmpty(_heroCfg.f_synthesis_money)){
            _needArr = _needArr.concat(_heroCfg.f_synthesis_money.split("|"));
        }
        let _resultList = this.model.convertTaskHeros(_needArr);
        ItemViewFactory.renderItemSlots(this._ui.needCon,_resultList,false,20,1,"center",FightTaskHeroCell);
        if(per >= 100){
            this.summonBtnCtl.visible = true;
        }else{
            this.summonBtnCtl.visible = false;
        }
    }

    // private onHeroComplete(){
    //     this._ui.heroCon.addChild(this._hero.skeleton);
    // }

    private onMythosCellRender(item:MythosCellView,index:number){
        item.refresh();
        // console.log(index,item.dataSource);
        if(index == this._ui.heroList.selectedIndex){
            item.selIcon.skin = `remote/fight/bt_xz_sh.png`;
        }else{
            item.selIcon.skin = `remote/fight/bt_wxz_sh.png`;
        }
    }
    protected onInit(): void {
        let _myThosList: stHero[] = ComposeModel.Ins.mythos;
        this._myThosList = _myThosList;
        //==================================
        this.summonBtnCtl.visible = false;
        this._ui.heroList.array = _myThosList;
        if(_myThosList.length){
            this._ui.heroList.selectedIndex = 0;
        }
    }

}