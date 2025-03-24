import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { HeroListProxy } from "../../proxy/HeroProxy";
import { FightFactory } from "../../../compose/FightFactory";
import { HeroAvatarView } from "../../../compose/views/HeroAvatarView";
import { IconUtils } from "../../../main/model/IconUtils";
import { MainModel } from "../../../main/model/MainModel";
// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { HeroBuy_req } from "../../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ItemVo } from "../../../main/vos/ItemVo";
import { TowertMainHeroModel } from "../../model/TowertMainHeroModel";
import { t_Hero_Skin } from "../../proxy/t_Hero_Skin";

export class HeroItem1 extends ui.views.hero.ui_heroItem1UI{
    private _heroAnim:HeroAvatarView;

    constructor() {
        super();
        this.sp_click.on(Laya.Event.CLICK,this,this.onClick);
        this.on(Laya.Event.UNDISPLAY,this,this.disposeHero);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
        ButtonCtl.Create(this.btn1,new Laya.Handler(this,this.onBtn1Click));
    }

    private disposeHero() {
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
    }

    private onBtnClick(){
        if(!this._data)return;
        E.ViewMgr.ShowMidError(this._data.f_unlock_condition);
    }

    private onBtn1Click(){
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

    private onClick(){
        if(!this._data)return;
        // if(this._data.f_qua <= 3){
        //     E.ViewMgr.Open(EViewType.HeroTip,null,this._data);
        // }else{
        //     E.ViewMgr.Open(EViewType.HeroTip1,null,this._data);
        // }
        E.ViewMgr.Open(EViewType.HeroTip1,null,this._data);
    }

    private _data:Configs.t_Hero_dat;
    public setData(value:Configs.t_Hero_dat){
        if(!value)return;
        this.disposeHero();
        let skinId = TowertMainHeroModel.Ins.getSkinIdById(value.f_heroid);
        let cfg = t_Hero_Skin.Ins.getCfgById(skinId);
        let arr = cfg.f_pos_herolist.split("|");
        this._heroAnim = FightFactory.createBigHeroAvatar(value.f_heroid, this.sp,parseInt(arr[0]),parseInt(arr[1]));
        this._data = value;
        this.img.skin = HeroListProxy.Ins.getQuaSkin(value.f_qua);
        this.lab.text = value.f_hero;
        if(value.f_purchase_prize != ""){
            this.btn.visible = false;
            this.btn1.visible = true;
            let arr = value.f_purchase_prize.split("-");
            let id = parseInt(arr[0]);
            let need = parseInt(arr[1]);
            this.icon.skin = IconUtils.getIconByCfgId(id);
            this.lab_icon.text = need + "";
            let count = MainModel.Ins.mRoleData.getVal(id);
            if(count >= need){
                this.lab_icon.color = "#ffffff";
            }else{
                this.lab_icon.color = "#ef130f";
            }
        }else{
            this.btn.visible = true;
            this.lab1.text = this._data.f_unlock_condition;
            this.btn1.visible = false;
        }
    }
}