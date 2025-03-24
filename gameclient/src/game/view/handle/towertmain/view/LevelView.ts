import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EAvatarDir } from "../../avatar/AvatarView";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { FightFactory } from "../../compose/FightFactory";
import { ITowerMonster } from "../../compose/views/ITowerMonster";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { PlayerVoFactory } from "../../main/vos/PlayerVoFactory";
import { t_Player_Exp } from "../proxy/t_Player_Exp";

export class LevelView extends ViewBase{
    private _ui:ui.views.main.ui_levelViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _sp:SimpleEffect;
    private monster:ITowerMonster;

    protected onAddLoadRes(): void {
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.main.ui_levelViewUI();
        }
    }

    protected onInit(): void {
        if(!this.Data){
            return;
        }
        this._sp = new SimpleEffect(this._ui.sp, `o/spine/succeed/LV_UP/LV_UP`,this._ui.sp.width*0.5,this._ui.sp.height*0.5);
        this._sp.play(0,true);
        this.monster = FightFactory.createFrameMonster(0,this,this.onLoadComplete,2,15);
        this.monster.dir = EAvatarDir.Right;

        let lv = this.Data[0];
        let lv1 = this.Data[1];
        this._ui.lab.text = lv + "";
        this._ui.lab1.text = lv1 + "";

        let arr = [];
        for(let i:number = lv + 1;i <= lv1;i++){
            arr.push(t_Player_Exp.Ins.getCfgByLv(i).f_reward);
        }
        arr = PlayerVoFactory.mergeAttr(arr,"-");
        let st = ItemViewFactory.convertItemList(arr.join("|"));
        ItemViewFactory.renderItemSlots(this._ui.spp,st,true,20);
    }

    protected onExit(): void {
        if(this._sp){
            this._sp.dispose();
            this._sp = null;
        }
        if(this.monster){
            this.monster.dispose();
            this.monster = null;
        }
    }

    private onLoadComplete(){
        let monsterSkel:Laya.Sprite = this.monster.skeleton;
        this._ui.sppp.addChild(monsterSkel);
    }
}