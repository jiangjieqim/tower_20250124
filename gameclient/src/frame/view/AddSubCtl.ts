// import { ButtonCtl } from "./ButtonCtl";
/** 加减控制器 */
export class AddSubCtl
{
    private _addSkin:Laya.Image;
    private _subSkin:Laya.Image;
    private _showTf:Laya.Label;
    private _curVal:number = 0;
    private _maxVal:number = 0;
    private _oneOffset:number = 1;
    public callBack:Laya.Handler;
    
    constructor(_addSkin:Laya.Image,_subSkin:Laya.Image,_showTf:Laya.Label){
        this._addSkin = _addSkin;
        this._subSkin = _subSkin;
        this._showTf = _showTf;
        ButtonCtl.CreateBtn(this._addSkin,this,this.onAddHandler);
        ButtonCtl.CreateBtn(this._subSkin,this,this.onSubHandler);
    }

    private onAddHandler(){
        if(this._curVal + this._oneOffset>this._maxVal){
            return;
        }
        this._curVal+=this._oneOffset;
        this.refreshSkin();
    }

    public setValue(v:number){
        if(v > this._maxVal){
            return;
        }
        this._curVal = v;
        this.refreshSkin();
    }

    private onSubHandler(){
        if (this._curVal - this._oneOffset <= 0) {
            return;
        }
        this._curVal -= this._oneOffset;
        this.refreshSkin();
    }

    public refreshSkin() {
        this._showTf.text = this._curVal.toString();
        this.callBack.run();
    }

    public reset() {
        this._curVal = 1;
        this.refreshSkin();
    }
    public set maxVal(v:number){
        this._maxVal = v;
    }
    public get curVal(){
        return this._curVal;
    }
}