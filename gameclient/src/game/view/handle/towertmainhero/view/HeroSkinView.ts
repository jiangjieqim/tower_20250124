import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { ISimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { t_Hero_Skin } from "../proxy/t_Hero_Skin";

export class HeroSkinView extends ViewBase{
    private _ui:ui.views.hero.ui_heroTip2UI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    protected mMaskClick:boolean = false;
    
    private _sp:SimpleEffect;
    private _sp1:ISimpleEffect;
    private _heroAnim:HeroAvatarView;

    protected onAddLoadRes() {
        this.addAtlas("heroskin.atlas");
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.hero.ui_heroTip2UI;

            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                // ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            );
            this._ui.list.itemRender = ui.views.hero.ui_heroItem4UI;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onRenderHandler(item:ui.views.hero.ui_heroItem4UI){
        item.img.skin = `remote/heroskin/img_${item.dataSource}.png`;
    }

    protected onInit(): void {
        let data = t_Hero_Skin.Ins.getCfgById(parseInt(this.Data));
        this._ui.bg.skin = `o/illustrationbg/${data.f_illustration_bg}.jpg`;
        this._ui.lab.text = data.f_skin_name;
        this._ui.list.array = data.f_detail_label.split("|");
        this._ui.lab1.text = data.f_bufff_desc;
        this._ui.lab2.text = data.f_unlock_way;
        this.disposeHero();
        if (!this._heroAnim) {
            this._heroAnim = FightFactory.createByImageId(data.f_imageid,this._ui.sp1,0,10,1.2);
        }

        this._ui.img.visible = false;
        this._ui.img1.visible = false;
        this.disposeSe();
        if(data.f_illustration_type == 1){
            this._ui.img.visible = true;
            this._ui.img.skin = `o/bigshow/${data.f_illustration}.png`;
        }else if(data.f_illustration_type == 2){
            if(!this._sp){
                this._sp = new SimpleEffect(this._ui.sp, `o/spine/bigshow/${data.f_illustration}/${data.f_illustration}`,30,80);
                this._sp.play(0,true);
            }
        }

        if(data.f_qua_label != ""){
            let type = parseInt(data.f_qua_label.split("-")[0]);
            let url = data.f_qua_label.split("-")[1];
            if(type == 1){
                this._ui.img1.visible = true;
                this._ui.img1.skin = `o/illustrationqua/${url}.png`;
            }else if(type == 2){
                this._sp1 = SpineEffectMgr.createIllustration(data,this._ui.sp2);
            }
        }
    }

    protected onExit(): void {
        this.disposeSe();
        this.disposeHero();
    }

    private disposeSe(){
        if(this._sp){
            this._sp.dispose();
            this._sp = null;
        }
        if(this._sp1){
            this._sp1.dispose();
            this._sp1 = null;
        }
    }

    private disposeHero() {
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
    }
}