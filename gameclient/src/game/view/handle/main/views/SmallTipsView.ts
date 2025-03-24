import { ViewBase } from "../../../../../frame/view/ViewBase";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { ISmallTips } from "../interface/Interface";

export interface ISmallTipsSkin extends Laya.Sprite{
    img:Laya.Image;
    container:Laya.Box;
}

/**小tip基类 */
export abstract class SmallTipsView extends ViewBase {
    public PageType: EPageType = EPageType.None;
    protected _data: ISmallTips;
    protected _ui: ISmallTipsSkin;
    // protected mMask:boolean = true;
    protected maskAlpha = 0.0;
    protected _tempPos:Laya.Point;
    /**默认的img的宽度 */
    // protected initImgWidth:number;
    protected onFirstInit() {
        if (!this.UI) {
            this.initUI();
            // this.initImgWidth = this._ui.width;
            this._ui.on(Laya.Event.CLICK,this,this.onImgClick);//添加阻挡
        }
    }

    protected abstract initUI();

    private onImgClick(){

    }

    protected onExit() {
        Laya.stage.off(Laya.Event.CLICK,this,this.onStageClick);
    }

    protected onAddLoadRes() {
    }

    protected onAddEventListener() {

    }

    protected onEnter() {

    }

    /**更新内容 */
    protected updateContent(){
        
    }

    public setData(_data: ISmallTips){
        this._data = _data;
        // let _data: ISmallTips = this.Data;

        this.updateContent();
        this._ui.img.x = this._ui.img.width;

        this._ui.height = this._ui.img.height;
        this._ui.width = this._ui.img.width;
        let t:Laya.Sprite = _data.target;
        let pos = (t.parent as Laya.Sprite).localToGlobal(new Laya.Point((t as Laya.Sprite).x,(t as Laya.Sprite).y));
        this._tempPos = pos;
        this.SetCenter();
    }

    protected onInit() {
        this.UpdateView();
        this.setData(this.Data);
        Laya.stage.on(Laya.Event.CLICK,this,this.onStageClick);
    }

    private onStageClick(e:Laya.Event){
        if(this.IsShow()){
            this.Close();
        }
    }
    private spr:Laya.Sprite;
    protected SetCenter(): void {
        if(!this._tempPos){
            return;
        }
        let offsetY:number = 20;

        if(this._tempPos.x + this._ui.width > Laya.stage.width){
            this._tempPos.x = Laya.stage.width - this._ui.width;
        }

        if(this._data.algin == "rightbottom"){
            //右下方
            this._ui.container.x = -this._ui.width + this._tempPos.x + this._data.target.width;
            this._ui.container.y = this._tempPos.y + this._ui.height + offsetY;
        }else if(this._data.algin == "rightbottom1"){
            this._ui.container.x = -this._ui.width + this._tempPos.x + this._data.target.width;
            this._ui.container.y = this._tempPos.y + this._ui.height - 70;
        }else{
            this._ui.container.x = this._tempPos.x;
            let yy = this._tempPos.y - this._ui.height - offsetY;
            if( yy < 0){
                this._ui.container.y = 0;
            }else{
                this._ui.container.y = yy;
            }
        }

        let rect = new Laya.Rectangle(this._ui.container.x,this._ui.container.y,this._ui.width,this._ui.height);
        this._ui.hitArea = rect;

        //============================================================
        if(debug){
            if(!this.spr){
                let spr = new Laya.Sprite();
                this.spr = spr;
            }
            let spr = this.spr;
            // spr.alpha = 0.35;
            this._ui.addChildAt(spr,0);
            spr.graphics.clear();
            spr.graphics.drawRect(rect.x,rect.y,rect.width,rect.height,null,"#00ff00",1);
        }
        //============================================================
    }
}