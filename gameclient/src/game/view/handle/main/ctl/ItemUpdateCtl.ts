import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { MainModel } from "../model/MainModel";
export class ItemUpdateCtl{
    private tf:Laya.Label;
    private itemId:number;
    constructor(tf:Laya.Label,itemId:number){
        this.itemId = itemId;
        this.tf = tf;
        this.tf.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.tf.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        this.onUpdateView();
    }
    private onDisplay(){
        MainModel.Ins.on(TowerMainEvent.ValChange,this,this.onUpdateView);
        this.onUpdateView();
    }
    private onUnDisplay(){
        this.exit();
    }
    private onUpdateView(){
        let v = StringUtil.val2m(MainModel.Ins.mRoleData.getVal(this.itemId));
        this.tf.text = v;
    }

    private exit(){
        MainModel.Ins.off(TowerMainEvent.ValChange,this,this.onUpdateView);
    }

    public static Create(tf:Laya.Label,itemId:number){
        return new ItemUpdateCtl(tf,itemId);
    }
}