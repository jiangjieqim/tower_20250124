import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SkillItem } from "../../skill/view/SkillItem";
import { IconUtils } from "../../main/model/IconUtils";
import { MainModel } from "../../main/model/MainModel";
import { TowertMainHeroModel } from "../model/TowertMainHeroModel";
import { ETowerAttr, HeroListLvProxy, HeroListProxy } from "../proxy/HeroProxy";
import { HeroItem2 } from "./item/HeroItem2";
// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { HeroRaise_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { FightFactory } from "../../compose/FightFactory";

export class HeroTip extends ViewBase{
    private _ui:ui.views.hero.ui_heroTipUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    private _heroAnim:HeroAvatarView;

    private _proW;

    protected onAddLoadRes() {
        this.addAtlas("hero.atlas");
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.hero.ui_heroTipUI;
            this._proW = this._ui.pro.width;

            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            );

            this._ui.list.itemRender = SkillItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list1.itemRender = HeroItem2;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
        }
    }

    private _data:Configs.t_Hero_dat;
    private _tempId:number;
    protected onInit(): void {
        TowertMainHeroModel.Ins.on(TowertMainHeroModel.UPDATE_HERO,this,this.updateView);
        this._data = this.Data;
        this._tempId = this._data.f_heroid;
        this.updateView();
    }

    protected onExit(): void {
        TowertMainHeroModel.Ins.off(TowertMainHeroModel.UPDATE_HERO,this,this.updateView);
        this.disposeHero();
    }

    private disposeHero() {
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
    }

    private onBtnClick(){
        let req:HeroRaise_req = new HeroRaise_req;
        req.heroId = this._cfg.f_heroid;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onRenderHandler(item:SkillItem){
        let _hero = TowertMainHeroModel.Ins.getHeroById(this._cfg.f_heroid);
        let lv = 1;
        if(_hero){
            lv = _hero.level;
        }
        item.setData(item.dataSource,lv);
    }

    private onRenderHandler1(item:HeroItem2){
        item.setData(item.dataSource,this._cfg.f_herolevel);
    }

    private _cfg:Configs.t_Hero_upgrade_dat;
    private updateView(){
        this.disposeHero();
        this._ui.sp_jt.visible = false;
        this._heroAnim = FightFactory.createBigHeroAvatar(this._tempId, this._ui,363,220);
        let data = TowertMainHeroModel.Ins.getHeroById(this._data.f_heroid);
        if(data){
            this._cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(this._tempId,data.level);
            let nextCfg:Configs.t_Hero_upgrade_dat = HeroListLvProxy.Ins.getNextCfgByIdAndLv(this._tempId,data.level);
            if(nextCfg){
                let arr = this._cfg.f_consumption.split("|");
                let id = parseInt(arr[0].split("-")[0]);
                let need = parseInt(arr[0].split("-")[1]);
                let count = MainModel.Ins.mRoleData.getVal(id);
                if(count >= need){
                    this._ui.pro.width = this._proW;
                    this._ui.sp_jt.visible = true;
                }else{
                    this._ui.pro.width = count / need * this._proW;
                }
                this._ui.lab_pro.text = count + "/" + need;
                this._ui.lab_mj.text = "";

                this._ui.spp.visible = true;
                this._ui.sp1.visible = false;
                id = parseInt(arr[1].split("-")[0]);
                need = parseInt(arr[1].split("-")[1]);
                this._ui.icon.skin = IconUtils.getIconByCfgId(id);
                this._ui.lab_icon.text = "x" + need;
                count = MainModel.Ins.mRoleData.getVal(id);
                if(count >= need){
                    this._ui.lab_icon.color = "#ffffff";
                }else{
                    this._ui.lab_icon.color = "#f63431";
                }

                this._ui.lab_icon.width = this._ui.lab_icon.textField.textWidth;
                this._ui.bg_icon.width = this._ui.lab_icon.width + 77;
                this._ui.bg_icon.x = (250 - this._ui.bg_icon.width) * 0.5;

                if(TowertMainHeroModel.Ins.isHeroLv(this._tempId,data.level)){
                    this._ui.btn.disabled = false;
                }else{
                    this._ui.btn.disabled = true;
                }
            }else{
                this._ui.pro.width = this._proW;
                this._ui.lab_pro.text = "";
                this._ui.lab_mj.text = "已满级";
                this._ui.spp.visible = false;
                this._ui.sp1.visible = true;
                this._ui.lab2.text = "已满级";
            }
        }else{
            this._cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(this._tempId,1);
            this._ui.pro.width = 0;
            this._ui.lab_pro.text = "";
            this._ui.lab_mj.text = "未解锁";
            this._ui.spp.visible = false;
            this._ui.sp1.visible = true;
            this._ui.lab2.text = "未解锁";
        }

        let heroCfg = HeroListProxy.Ins.getCfgById(this._tempId);
        this._ui.lab_name.text = heroCfg.f_hero;
        this._ui.lab_lv.text = "lv:" + this._cfg.f_herolevel;
        this._ui.img_qua.skin = HeroListProxy.Ins.getQuaSkin1(heroCfg.f_qua);
        if(heroCfg.f_range == 5){
            this._ui.lab.text = "近战";
        }else{
            this._ui.lab.text = "远程";
        }
        this._ui.lab1.text = E.LangMgr.getLang("f_occupation_" + heroCfg.f_occupation);
        let val = parseInt(this._cfg.f_10002.split(":")[1]);
        this._ui.lab_gj.text = StringUtil.val2m(val);

        if(TowertMainHeroModel.Ins.isHeroLv(this._cfg.f_heroid,this._cfg.f_herolevel)){
            this._ui.sp_gj.visible = true;
            let nCfg:Configs.t_Hero_upgrade_dat = HeroListLvProxy.Ins.getNextCfgByIdAndLv(this._cfg.f_heroid,this._cfg.f_herolevel);
            let num = parseInt(nCfg.f_10002.split(":")[1]) - parseInt(this._cfg.f_10002.split(":")[1]);
            this._ui.lab_gj1.text = "+" + StringUtil.val2m(num);
            this._ui.lab_gj1.x = this._ui.lab_gj.x + this._ui.lab_gj.textField.textWidth;
        }else{
            this._ui.sp_gj.visible = false;
            this._ui.lab_gj1.text = "";
        }
        
        let nn = HeroListLvProxy.Ins.getSpeedNum(this._cfg.f_heroid,this._cfg.f_herolevel);
        let n = (1000/HeroListProxy.Ins.getAttrVal(heroCfg,ETowerAttr.AtkGapMs)) * (1 + nn/10000);
        this._ui.lab_sd.text = n.toFixed(1);

        let arr = this._cfg.f_client_skill_des.split("|");
        this._ui.list.array = arr;
        this._ui.list.width = (arr.length * 96) + (arr.length - 1) * this._ui.list.spaceX;

        let array = HeroListLvProxy.Ins.getListById(this._cfg.f_heroid);
        let arr1 = [];
        for(let i:number=0; i<array.length;i++){
            if(array[i].f_client_skill != ""){
                arr1.push(array[i]);
            }
        }
        this._ui.list1.array = arr1;
    }
}