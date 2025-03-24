// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { HeroSwitchSkin_req } from "../../../../network/protocols/BaseProto";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { TowertMainHeroModel } from "../model/TowertMainHeroModel";
import { HeroListProxy } from "../proxy/HeroProxy";
import { t_Hero_Skin } from "../proxy/t_Hero_Skin";
import { HeroHuanZhuangItem } from "./item/HeroHuanZhuangItem";

export class HeroHuanZhuangView extends ViewBase{
    private _ui:ui.views.hero.ui_huanzhuangViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
        this.addAtlas('hero.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.hero.ui_huanzhuangViewUI();
            this.bindClose(this._ui.btn_close);

            this.btnList.push(
                ButtonCtl.Create(this._ui.btn_js, new Laya.Handler(this, this.onBtnClick))
            )

            this._ui.list.itemRender = HeroHuanZhuangItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list.selectEnable = true;
        }
    }

    private onBtnClick(){
        let req = new HeroSwitchSkin_req;
        req.heroId = this._data.f_heroid;
        req.skinId = parseInt(this._ui.list.selectedItem);
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onRenderHandler(item:HeroHuanZhuangItem,index:number){
        if(index == this._ui.list.selectedIndex){
            item.sel.visible = true;
            this.updateView1();
        }else{
            item.sel.visible = false;
        }
        item.setData(item.dataSource,this._data.f_heroid);
    }

    private _data:Configs.t_Hero_dat;
    protected onInit(): void {
        TowertMainHeroModel.Ins.on(TowertMainHeroModel.UPDATE_HERO,this,this.updateView);
        this._data = HeroListProxy.Ins.getCfgById(this.Data);
        this.updateView();
    }

    protected onExit(): void {
        TowertMainHeroModel.Ins.off(TowertMainHeroModel.UPDATE_HERO,this,this.updateView);
        this.disposeHero();
    }

    private updateView(){
        let arr = this._data.f_skin.split("-");
        this._ui.list.array = arr;

        let index = 0;
        let data = TowertMainHeroModel.Ins.getHeroById(this._data.f_heroid);
        for(let i:number=0;i<arr.length;i++){
            if(data && data.skinId == parseInt(arr[i])){
                index = i;
                break;
            }
        }
        this._ui.list.selectedIndex = index;
    }

    private _heroAnim:HeroAvatarView;
    private updateView1(){
        this.disposeHero();
        let cfg = t_Hero_Skin.Ins.getCfgById(parseInt(this._ui.list.selectedItem));
        let _curScale:number = HeroListProxy.Ins.getScaleById(this._data.f_heroid);
        this._heroAnim = FightFactory.createByImageId(cfg.f_imageid,this._ui.sp,0,0,_curScale);
        if(cfg.f_bufff_desc != ""){
            this._ui.lab.text = cfg.f_bufff_desc;
            this._ui.sp2.visible = true;
        }else{
            this._ui.lab.text = "";
            this._ui.sp2.visible = false;
        }
        
        let status = 0;
        let data = TowertMainHeroModel.Ins.getHeroById(this._data.f_heroid);
        if(data){
            if(data.skinId == cfg.f_skinid){
                status = 1;
            }else if(data.skins.indexOf(cfg.f_skinid) != -1){
                status = 2;
            }
        }

        if(status == 0){
            this._ui.img1.visible = false;
            this._ui.btn_js.visible = true;
            this._ui.btn_js.disabled = true;
            this._ui.lab1.text = "未拥有";
        }else if(status == 1){
            this._ui.img1.visible = true;
            this._ui.btn_js.visible = false;
        }else if(status == 2){
            this._ui.img1.visible = false;
            this._ui.btn_js.visible = true;
            this._ui.btn_js.disabled = false;
            this._ui.lab1.text = "穿戴";
        }
    }

    private disposeHero() {
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
    }
}