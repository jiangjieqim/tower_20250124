import { ui } from "../../../../../../ui/layaMaxUI";
import { SimpleEffect } from "../../../avatar/SimpleEffect";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { RoleInfoModel } from "../../../roleinfo/model/RoleInfoModel";
import { t_Medal } from "../../proxy/t_Medal";

export class TrophyNewItem extends ui.views.trophy.ui_trophyItem2UI{

    private _hzEff:SimpleEffect;
    
    constructor(){
        super();
        this.on(Laya.Event.UNDISPLAY, this, this.onUnDisplay);
    }

    private onUnDisplay(){
        if(this._hzEff){
            this._hzEff.dispose();
            this._hzEff = null;
        }
    }

    public setData(value:Configs.t_Medal_dat){
        if(!value)return;

        this.zOrder = value.f_layer;

        if(this._hzEff){
            this._hzEff.dispose();
            this._hzEff = null;
        }
        this.sp1.scaleX = this.sp1.scaleY = 0.65;
        this._hzEff = new SimpleEffect(this.sp1, `o/spine/succeed/${value.f_medal_id}/${value.f_medal_id}`,0,-25);
        this._hzEff.play(0,true);

        let trophy = RoleInfoModel.Ins.getMaxTrophy();
        let cfg = t_Medal.Ins.getCfgByTr(trophy);
        if(value.f_id == 1){
            this.img1.visible = this.pro.visible = false;
        }else{
            this.img1.visible = true;
            if(value.f_id <= cfg.f_id){
                this.pro.visible = true;
            }else{
                this.pro.visible = false;
            }
        }
        
        this.lab.text = value.f_rank_name;
        this.lab1.text = value.f_min_score + "";
        ItemViewFactory.renderItemSlots(this.sp,value.f_settlement_reward,true,10,0.8,"left");
        if(value.f_id == cfg.f_id){
            this.img.skin = "remote/trophy/btn_s_dwjl1.png";
            this.bg.skin = "remote/trophy/d_dwjl_s.png";
            this.lab.color = "#fffa6d";
            this.lab.strokeColor = "#953c00";
            this.lab1.color = "#fffa6d";
            this.bbb.visible = true;
        }else{
            this.img.skin = "remote/trophy/botton_rw_cczl.png";
            this.bg.skin = "remote/trophy/d_dwjl_n.png";
            this.lab.color = "#ffffff";
            this.lab.strokeColor = "#8b2b00";
            this.lab1.color = "#ffffff";
            this.bbb.visible = false;
        }
    }
}