// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { EMsgBoxType, EViewType } from "../../../../common/defines/EnumDefine";
import { SocketMgr } from "../../../../network/SocketMgr";
import { HeroBuy_req, HeroCollect_req, HeroRaise_req, stCellValue, stHero } from "../../../../network/protocols/BaseProto";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { IconUtils } from "../../main/model/IconUtils";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { ItemVo } from "../../main/vos/ItemVo";
import { SkillItem } from "../../skill/view/SkillItem";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { showFix, TowertMainHeroModel } from "../model/TowertMainHeroModel";
import { ETowerAttr, HeroListLvProxy, HeroListProxy } from "../proxy/HeroProxy";
import { HeroItem2 } from "./item/HeroItem2";
import { HeroItem3 } from "./item/HeroItem3";

export class HeroTip1 extends ViewBase{
    private _ui:ui.views.hero.ui_heroTip1UI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    private _heroAnim:HeroAvatarView;
    private _collectBg:ButtonCtl;
    private _proW;

    protected onAddLoadRes() {
        this.addAtlas("hero.atlas");
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.hero.ui_heroTip1UI;
            this._proW = this._ui.pro.width;

            this.bindClose(this._ui.btn_close,true);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick)),
                ButtonCtl.Create(this._ui.btn_hs,new Laya.Handler(this,this.onBtnHSClick)),
                ButtonCtl.Create(this._ui.btn_js,new Laya.Handler(this,this.onBtnJSClick)),
                ButtonCtl.Create(this._ui.btn_hz,new Laya.Handler(this,this.onBtnHZClick)),
                ButtonCtl.Create(this._ui.btn_hq,new Laya.Handler(this,this.onBtnHQClick))
            );

            this._ui.list.itemRender = SkillItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list1.itemRender = HeroItem2;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onRenderHandler1);
            this._ui.list2.itemRender = HeroItem3;
            this._ui.list2.renderHandler = new Laya.Handler(this,this.onRenderHandler2);

            this._collectBg = ButtonCtl.CreateBtn(this._ui.collectBg,this,this.onColletHandler);
        }
    }

    /**收藏 */
    private onColletHandler(){
        let req = new HeroCollect_req();
        req.heroId = this._data.f_heroid;
        let _heroVo:stHero = TowertMainHeroModel.Ins.getHeroById(this._data.f_heroid);
        req.action = _heroVo.collect <= 0 ? 1 : 0;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private _data:Configs.t_Hero_dat;
    private _tempId:number;
    protected onInit(): void {
        TowertMainHeroModel.Ins.on(TowertMainHeroModel.UPDATE_HERO,this,this.updateView);
        TowertMainHeroModel.Ins.on(TowertMainHeroModel.UPDATE_UP,this,this.onUpView);
        this._data = this.Data;
        this._tempId = this._data.f_heroid;

        this.setUI();
        this.updateView();
        this.setHC();
        this.setHS();
        this._isSelect = false;
        this.updateLabel();
        let hCfg = HeroListProxy.Ins.getCfgById(this._data.f_heroid);
        if(hCfg.f_sound){
            E.AudioMgr.StopSound();
            E.AudioMgr.PlaySound1(hCfg.f_sound + ".mp3");
        }
    }

    protected onExit(): void {
        TowertMainHeroModel.Ins.off(TowertMainHeroModel.UPDATE_HERO,this,this.updateView);
        TowertMainHeroModel.Ins.off(TowertMainHeroModel.UPDATE_UP,this,this.onUpView);
        this.disposeHero();
        if(this._collectBg){
            this._collectBg.dispose();
            this._collectBg = null;
        }
    }

    private disposeHero() {
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
    }

    private onUpView(){
        E.AudioMgr.StopSound();
        E.AudioMgr.PlaySound1("1007.mp3");
        SpineEffectMgr.playOnce(`o/spine/scene/Hero_UP/Hero_UP`,this._ui.sp_se, 375,160);
        let data = TowertMainHeroModel.Ins.getHeroById(this._data.f_heroid);
        E.ViewMgr.Open(EViewType.AttrLevelView,null,data);
    }

    private onBtnClick(){
        if(this._uplist.length){
            let vo: ItemVo = new ItemVo();
            vo.cfgId = this._uplist[0];
            vo.count = this._uplist[1];
            let st = E.LangMgr.getLangArr("herolab",[vo.count,vo.getName(),this._data.f_hero]);
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OkOrCancel,st,new Laya.Handler(this, this.sendCmd));
        }else{
            let req:HeroRaise_req = new HeroRaise_req;
            req.heroId = this._data.f_heroid;
            SocketMgr.Ins.SendMessageBin(req);
        }
    }

    private sendCmd(){
        let ce = new stCellValue();
        ce.id = this._uplist[0];
        ce.count = this._uplist[1];
        let req: HeroRaise_req = new HeroRaise_req;
        req.universal = ce;
        req.heroId = this._data.f_heroid;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onBtnHSClick(){
        this._isSelect = !this._isSelect;
        this.updateLabel();
        if(this._isSelect){
            this._tempId = this._data.f_transform;
        }else{
            this._tempId = this._data.f_heroid;
        }
        this.updateView()
    }

    private onBtnJSClick(){
        if(!this._data)return;
        let vo:ItemVo = new ItemVo;
        vo.cfgId = this._data.f_heropiece_id;
        vo.count = 1;
        let vo1 = ItemViewFactory.convertItem(this._data.f_purchase_prize);
        E.ViewMgr.showMsgBoxView(vo,vo1,new Laya.Handler(this,()=>{
            let req = new HeroBuy_req;
            req.heroId = this._data.f_heroid;
            SocketMgr.Ins.SendMessageBin(req);
        }));
    }

    private onBtnHZClick(){
        if(!this._data)return;
        E.ViewMgr.Open(EViewType.HeroHuanZhuangView,null,this._tempId);
    }

    private onBtnHQClick(){
        if(!this._data)return;
        E.ViewMgr.ShowMidError(this._data.f_unlock_condition);
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

    private onRenderHandler2(item:HeroItem3,index:number){
        if(index == this._arrMax - 1){
            item.setData(item.dataSource,false);
        }else{
            item.setData(item.dataSource,true);
        }
    }

    private _cfg:Configs.t_Hero_upgrade_dat;
    private _uplist;
    private updateView(){
        this.disposeHero();
        this._ui.sp_jt.visible = false;
        this._heroAnim = FightFactory.createBigHeroAvatar(this._tempId, this._ui.sp_hero,375,160);
        let data = TowertMainHeroModel.Ins.getHeroById(this._data.f_heroid);
        if(data){
            //================================================================
            this._ui.collectImg.skin = IconUtils.getCollectSkin(data);
            if(StringUtil.IsNullOrEmpty(this._ui.collectImg.skin)){
                this._ui.collectBg.visible = false;
            }else{
                this._ui.collectBg.visible = true;
            }
            //================================================================
            this._ui.sp_js.visible = false;
            this._ui.btn_hq.visible = false;
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

                this._ui.img6.visible = true;

                let num = TowertMainHeroModel.Ins.convertGlobalAttribute(nextCfg);//parseInt(nextCfg.f_global_attribute.split(":")[1]);
                let num1 = 0;
                if(this._cfg.f_global_attribute != ""){
                    num1 = TowertMainHeroModel.Ins.convertGlobalAttribute(this._cfg);//parseInt(this._cfg.f_global_attribute.split(":")[1]);
                }
                num -= num1;
                num = num / 100;
                this._ui.lab6.text = E.getLang("heroattr1",num.toFixed(showFix));

                this._ui.lab_icon.width = this._ui.lab_icon.textField.textWidth;
                this._ui.bg_icon.width = this._ui.lab_icon.width + 77;
                this._ui.bg_icon.x = (250 - this._ui.bg_icon.width) * 0.5;

                this._uplist = [];
                if(TowertMainHeroModel.Ins.isHeroLv(this._tempId,data.level)){
                    this._ui.btn.disabled = false;
                }else{
                    if(this._data.f_universal_piece){
                        let cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(this._tempId,data.level);
                        let st = cfg.f_consumption.split("|")[1];
                        let bo = TowerMainModel.Ins.isItemEnoughSt(st);
                        if(bo){
                            let arr = cfg.f_consumption.split("|")[0].split("-");
                            let id1 = parseInt(arr[0]);
                            let val1 = parseInt(arr[1]);
                            let num = val1 - MainModel.Ins.mRoleData.getVal(id1);
                            let num1 = MainModel.Ins.mRoleData.getVal(this._data.f_universal_piece);
                            if(num1 >= num){
                                this._uplist = [this._data.f_universal_piece,num];
                                this._ui.btn.disabled = false;
                            }else{
                                this._ui.btn.disabled = true;
                            }
                        }else{
                            this._ui.btn.disabled = true;
                        }
                    }else{
                        this._ui.btn.disabled = true;
                    }
                }
            }else{
                this._ui.pro.width = this._proW;
                this._ui.lab_pro.text = "";
                this._ui.lab_mj.text = "已满级";
                this._ui.spp.visible = false;
                this._ui.sp1.visible = true;
                this._ui.img6.visible = false;
            }
        }else{
            this._ui.collectBg.visible = false;
            this._ui.collectImg.skin = "";
            //==============================================
            this._cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(this._tempId,1);
            this._ui.pro.width = 0;
            this._ui.lab_pro.text = "";
            this._ui.lab_mj.text = "未解锁";
            this._ui.spp.visible = false;
            this._ui.sp1.visible = false;
            if(this._data.f_purchase_prize != ""){
                this._ui.sp_js.visible = true;
                this._ui.btn_hq.visible = false;
                let arr = this._data.f_purchase_prize.split("-");
                let id = parseInt(arr[0]);
                let need = parseInt(arr[1]);
                this._ui.img_icon.skin = IconUtils.getIconByCfgId(id);
                this._ui.lab_icon1.text = need + "";
                let count = MainModel.Ins.mRoleData.getVal(id);
                if (count >= need) {
                    this._ui.lab_icon1.color = "#ffffff";
                } else {
                    this._ui.lab_icon1.color = "#ef130f";
                }
            }else{
                this._ui.sp_js.visible = false;
                this._ui.btn_hq.visible = true;
                this._ui.lab_hq.text = this._data.f_unlock_condition;
            }
            if(this._cfg.f_global_attribute != ""){
                this._ui.img6.visible = true;
                let num = TowertMainHeroModel.Ins.convertGlobalAttribute(this._cfg) /100;//parseInt(this._cfg.f_global_attribute.split(":")[1]) / 100;
                this._ui.lab6.text = E.getLang("heroattr2",num.toFixed(showFix));
            }else{
                this._ui.img6.visible = false;
            }
        }

        let heroCfg = HeroListProxy.Ins.getCfgById(this._tempId);
        this._ui.lab_name.text = heroCfg.f_hero;
        this._ui.lab_lv.text = "lv:" + this._cfg.f_herolevel;
        this._ui.img_qua.skin = HeroListProxy.Ins.getQuaSkin1(heroCfg.f_qua);
        if(heroCfg.f_range <= 5){
            this._ui.lab.text = "近战";
        }else if(heroCfg.f_range >= 6 && heroCfg.f_range <= 8){
            this._ui.lab.text = "中程";
        }else{
            this._ui.lab.text = "远程";
        }
        this._ui.lab1.text = E.LangMgr.getLang("f_occupation_" + heroCfg.f_occupation);
        let val = parseInt(this._cfg.f_10002.split(":")[1]);
        this._ui.lab_gj.text = StringUtil.val2m(val);
        let arrS = this._cfg.f_consumption.split("|");
        let id = parseInt(arrS[0].split("-")[0]);
        this._ui.img_i.skin = IconUtils.getIconByCfgId(id);

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

    private setUI(){
        if(this._data.f_qua <= 4){
            this._ui.height = 1174;
            this._ui.bg.height = 1165;
            this._ui.sp2.visible = false;
            this._ui.list.y = 487;
            this._ui.sp3.y = 394;
        }else{
            this._ui.height = 1268;
            this._ui.bg.height = 1261;
            this._ui.sp2.visible = true;
            this._ui.list.y = 597;
            this._ui.sp3.y = 501;
        }
    }

    private setHS(){
        if(this._data.f_transform){
            this._ui.btn_hs.visible = true;
        }else{
            this._ui.btn_hs.visible = false;
        }
    }

    private _isSelect:boolean;
    private updateLabel(){
        if(this._isSelect){
            this._ui.lab_hs.text = "化神前";
        }else{
            this._ui.lab_hs.text = "化神后";
        }
    }

    private _arrMax:number;
    private setHC(){
        if(this._data.f_qua == 5){
            let array = [];
            let arr = [];
            if(!StringUtil.IsNullOrEmpty(this._data.f_synthesis)){
                arr = this._data.f_synthesis.split("|");
            }
            let arr1 = [];
            if(!StringUtil.IsNullOrEmpty(this._data.f_synthesis_money)){
                arr1 = this._data.f_synthesis_money.split("|");
            }
            for(let i:number=0;i<arr.length;i++){
                let o:any = {};
                o.type = 1;
                o.data = arr[i];
                array.push(o);
            }
            for(let i:number=0;i<arr1.length;i++){
                let o:any = {};
                o.type = 2;
                o.data = arr1[i];
                array.push(o);
            }
            this._arrMax = array.length;
            this._ui.list2.array = array;

            let w = (array.length * 90) + (array.length - 1) * this._ui.list.spaceX;
            w = w - 24;
            this._ui.list2.x = (this._ui.sp2.width - w) * 0.5 + 8;
        }
    }
}