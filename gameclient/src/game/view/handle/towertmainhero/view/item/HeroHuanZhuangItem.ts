// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E } from "../../../../../G";
import { HeroBuySkin_req } from "../../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { FightFactory } from "../../../compose/FightFactory";
import { HeroAvatarView } from "../../../compose/views/HeroAvatarView";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { ItemVo } from "../../../main/vos/ItemVo";
import { TowertMainHeroModel } from "../../model/TowertMainHeroModel";
import { HeroListProxy } from "../../proxy/HeroProxy";
import { t_Hero_Skin } from "../../proxy/t_Hero_Skin";

export class HeroHuanZhuangItem extends ui.views.hero.ui_huanzhuangItemUI{
    private _heroAnim:HeroAvatarView;

    constructor(){
        super();
        ButtonCtl.Create(this.btn1, new Laya.Handler(this, this.onBtnClick));
        ButtonCtl.Create(this.btn_l, new Laya.Handler(this, this.onBtnLClick));
        this.on(Laya.Event.UNDISPLAY,this,this.disposeHero);
    }

    private onBtnLClick(){
        if(!this._data)return;
        E.ViewMgr.Open(EViewType.HeroSkinView,null,this._data.f_skinid);
    }

    private onBtnClick(){
        if(!this._data)return;
        let vo:ItemVo = new ItemVo;
        vo.cfgId = this._data.f_itemid;
        vo.count = 1;
        let vo1 = ItemViewFactory.convertItem(this._data.f_unlock_price);
        E.ViewMgr.showMsgBoxView(vo,vo1,new Laya.Handler(this,()=>{
            let req = new HeroBuySkin_req;
            req.skinItemId = this._data.f_itemid;
            SocketMgr.Ins.SendMessageBin(req);
        }));
    }

    private disposeHero() {
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
    }

    private _data:Configs.t_Hero_Skin_dat;
    public setData(value:string,id:number){
        this._data = t_Hero_Skin.Ins.getCfgById(parseInt(value));
        this.lab.text = this._data.f_skin_name;
        let _curScale:number = HeroListProxy.Ins.getScaleById(id);
        let arr = this._data.f_pos.split("|");
        if (!this._heroAnim) {
            this._heroAnim = FightFactory.createByImageId(this._data.f_imageid,this.sp,parseInt(arr[0]),parseInt(arr[1]),_curScale);
        }

        let status = 0;
        let data = TowertMainHeroModel.Ins.getHeroById(id);
        if(data){
            if(data.skinId == this._data.f_skinid){
                status = 1;
            }else if(data.skins.indexOf(this._data.f_skinid) != -1){
                status = 2;
            }
        }

        this.img.visible = this.img1.visible = this.img2.visible = this.btn1.visible = false;
        if(status == 0){
            this.sp1.visible = true;
            if(this._data.f_unlock_price != ""){
                this.btn1.visible = true;
                let vo = ItemViewFactory.convertItem(this._data.f_unlock_price);
                this.icon.skin = vo.getIcon();
                this.lab_icon.text = vo.count + "";
            }else if(this._data.f_unlock_way != ""){
                this.img.visible = true;
                this.lab1.text = this._data.f_unlock_way;
            }else{
                this.img2.visible = true;
                this.lab3.text = "未拥有";
            }
        }else{
            this.sp1.visible = false;
            if(status == 1){
                this.img1.visible = true;
            }else if(status == 2){
                this.img2.visible = true;
                this.lab3.text = "已拥有";
            }
        }

        if(this._data.f_illustration_type){
            this.btn_l.visible = true;
        }else{
            this.btn_l.visible = false;
        }
        this.btn.visible = this.sp2.visible = false;
    }
}