import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { E } from "../../../G";
import { EPageType } from "../../../common/defines/EnumDefine";
import { stCellValue } from "../../../network/protocols/BaseProto";
import { SpineCoreSkel } from "../avatar/spine/SpineCoreSkel";
import { SoltItemView } from "../main/views/icon/SoltItemView";
import { ItemVo } from "../main/vos/ItemVo";
import { TowerMainFightModel } from "../towertmain/model/TowerMainFightModel";
/**奖励结算 */
export class RewardView extends ViewBase{
    public PageType: EPageType = EPageType.None;
    protected _ui:ui.views.common.ui_rewardViewUI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private skel:SpineCoreSkel;
    private _tw:Laya.Tween;
    private _w:number;
    private _h:number;
    private _offX:number;
    protected arr:stCellValue[];
    protected onAddLoadRes() {
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.common.ui_rewardViewUI();
            this.initUI();
            this._w = 120;
            this._h = 120;
            this._offX = 18;

            this._tw = new Laya.Tween;
        }
    }

    protected initUI(){
        this._ui.goonBtn.visible = false;
    }

    protected onInit(): void {
        this.arr = this.Data;
        this._ui.lab.visible = false;
        this.updateView();
    }

    protected onExit(): void {
        if(this._tw){
            this._tw.clear();
            this._tw = null;
        }
        if(this.skel){
            this.skel.dispose();
            this.skel = null;
        }
    }

    private _arr;
    private _num; 

    protected updateView(){
        while(this._ui.panel.numChildren){
            this._ui.panel.removeChildAt(0);
        }
        this._num = 0;
        this._arr = [];
        let arr = this.arr;
        TowerMainFightModel.Ins.rewardList = [];
        for(let i:number=0;i<arr.length;i++){
            let vo: ItemVo = new ItemVo();
            vo.cfgId = arr[i].id;
            vo.count = arr[i].count;
            this._arr.push(vo);
        }
        if(this._arr.length >= 4){
            this._ui.panel.width = 534;
        }else{
            this._ui.panel.width = this._arr.length * this._w + this._offX * (this._arr.length - 1);
        }
        this._ui.panel.x = (this._ui.width - this._ui.panel.width) * 0.5;

        this.playTween();
        this.playEff();
    }

    private playTween() {
        if(!this.UI){return};
        if (this._arr.length == 0) {
            this._ui.lab.visible = true;
            this._ui.lab.text = E.getLang("RewardView1",this.Data.length);
            return;
        }

        let sp:Laya.Sprite = new Laya.Sprite;
        sp.width = this._w;
        sp.height = this._h;
        sp.x = this._num * this._w + this._offX * this._num;
        
        let data = this._arr.shift();
        let view: SoltItemView = new SoltItemView;
        view.anchorX = view.anchorY = 0.5;
        view.scaleX = view.scaleY = 0.5;
        view.x = this._w * 0.5;
        view.y = this._h * 0.5;
        view.setData(data);
        
        sp.addChild(view);
        this._ui.panel.addChild(sp);
        
        if (this._num >= 4) {
            Laya.timer.callLater(this,()=>{
                let i = this._num - 3;
                this._ui.panel.scrollTo(i * (this._w + this._offX));
                if(this._tw){
                    this._tw.to(view, { scaleX: 1, scaleY: 1 }, 200, null, new Laya.Handler(this, this.playTween));
                }
            })
        }else{
            if(this._tw){
                this._tw.to(view, { scaleX: 1, scaleY: 1 }, 200, null, new Laya.Handler(this, this.playTween));
            }
        }
        this._num++;
    }

    private playEff(){
        if(!this.skel){
            this.skel = new SpineCoreSkel();
        }
        this.skel.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
        this.skel.play(0, this, this.onPlayEnd, undefined, true);
        this.skel.load(`o/spine/succeed/obtain/obtain.skel`);
    }

    private onPlayEnd(){
        this.skel.play(1);
    }

    private onCompleteHander(){
        if(this.skel && this.skel.skeleton){
            this.skel.skeleton.pos( 322, 80);
            this._ui.sp.addChild(this.skel.skeleton);
        }else{
            LogSys.Error(`yonr this.skel.skeleton is null`)
        }
    }
}