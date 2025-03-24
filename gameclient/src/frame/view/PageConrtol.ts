import { E } from "../../game/G";
import { LanguageDefine } from "../../game/systems/languages/LanguageManager";

/**
 * 翻页控制器
 */
export class PageControl{
    private nextBtn:Laya.Button;private preBtn:Laya.Button;
    private numBtn:Laya.Button[];
    private selectHandler:Laya.Handler;
    private curStartIndex:number = 0;
    /**
     * 单个数字按钮选择的特效回调
     */
    private itemSelectHandler:Laya.Handler;
    // this._ui.cancel.label = E.LangMgr.Common[LanguageDefine.Common.Cancel];
    private _curPageIndex:number = 0;
    private gap:number;
    /**
     * 最大可移动的索引值
     */
    private _maxIndex:number = 0;


    private get numBtnLen(){
        return this.numBtn.length;
    }

    // /**
    //  * 当前选择的数字按钮
    //  */
    // private get curPage():number{
        // return this._curPageIndex;
    // }

    constructor(){

    }

    public init(nextBtn:Laya.Button,preBtn:Laya.Button,numBtn:Laya.Button[],
        selectHandler:Laya.Handler,
        itemSelectHandler:Laya.Handler)
    {
        this.nextBtn = nextBtn;
        this.preBtn = preBtn;
        this.numBtn = numBtn;
        this.selectHandler = selectHandler;
        this.itemSelectHandler = itemSelectHandler;
    
        nextBtn.clickHandler = new Laya.Handler(this,this.onClickNect);
        preBtn.clickHandler = new Laya.Handler(this,this.onClickPre);
        for(let i = 0;i < numBtn.length;i++){
            numBtn[i].clickHandler = new Laya.Handler(this,this.onNumClick,[numBtn[i]]);
        }
        this.curStartIndex = 0;
    }

    private onNumClick(btn:Laya.Button):void{
        let data = btn.dataSource;
        this.selectIndex(data);
    }
    private getMin(){
        if(this.numBtn.length > 0){
            return this.numBtn[0].dataSource;
        }
        return 0;
    }

    private getMax(){
        if(this.gap == 0){
            return this.getMin();
        }
        return this.getMin() + this.gap - 1;
    }
    // public setLang():void{
    //     this.nextBtn.label = E.LangMgr.Common[LanguageDefine.Common.NextPage];
    //     this.preBtn.label = E.LangMgr.Common[LanguageDefine.Common.PrePage];
    // }
    //向后移动
    private onClickNect():void{
        // if(this._maxPage <=this.numBtnLen){
        //     return;
        // }
        let v = this._curPageIndex+1;
        if(v > this._maxIndex){
            return;
        }
        let min = this.getMin();
        let max = this.getMax();
        if(max > this._maxIndex){
            max = this._maxIndex;
        }
        if(v >= min && v < max){
            //不移动
            // this.selectNum(v);
        }else{
            
            if(v <= this._maxIndex){
                if( this.curStartIndex+this.gap > this._maxIndex){//this.getMax()

                }else{
                    //向后移动
                    this.curStartIndex++;
                }
            }else{
                //不移动
            }
        }
        this.renderNumsBtnList();
        this.selectIndex(v);
    }
    /**
     * 向前移动
     */
    private onClickPre():void{
        let v = this._curPageIndex - 1;
        if(v < 0){
            return;
        }
        let min = this.getMin();
        let max = this.getMax();
        if (v >= min && v <= max) {
            //不移动
            // this.selectNum(v);
        } else {
            if (v <= this.curStartIndex) {
                let n = this.curStartIndex-1;
                //向前移动
                if (this.curStartIndex == 0 && n <= 0) {

                } else {
                    this.curStartIndex--;
                }
            } else {
                //不移动
            }
        }
        this.selectIndex(v);
    }
    /**
     * 渲染按钮列表
     */
    private renderNumsBtnList(): void {
        for (let i = 0; i < this.numBtn.length; i++) {
            let btn:Laya.Button = this.numBtn[i];
            btn.dataSource = this.curStartIndex + i;
            btn.label = (this.curStartIndex + i + 1).toString();
        }
    }
    /**
     * 强制选择会回调 this.selectHandler
     * @param v 
     */
    public forceSelectIndex(v){
        if(v > this._maxIndex){
            v = this._maxIndex;
        }
        this._curPageIndex = -1;
        this.selectIndex(v);
    }
    /**
     * 选择数字
     */
    public selectIndex(v): void {
        if(this._curPageIndex!=v){
            this.selectHandler.runWith(v);
        }
        this.renderNumsBtnList();
        this._curPageIndex = v;
        
        for (let i = 0; i < this.numBtn.length; i++) {
            let btn = this.numBtn[i];
            // let n = parseInt(btn.label);
            this.itemSelectHandler.runWith([btn,v==btn.dataSource]);
        }
    }


    public dispose() {
        this.nextBtn.clickHandler = null;
        this.preBtn.clickHandler = null;
        this.nextBtn = null;
        this.preBtn = null;;
        this.numBtn = null;
        this.selectHandler = null;
        this.itemSelectHandler = null;
        this._curPageIndex = 0;
        for(let i = 0;i < this.numBtn.length;i++){
            this.numBtn[i].clickHandler = null;
        }
    }

    /**
     * 设置数字选项
     */
    public setMaxPage(v: number): void {
        this.gap = 0;
        for (let i = 0; i < this.numBtn.length; i++) {
            if (i < v) {
                this.gap++;
                this.numBtn[i].visible = true;
            }
            else {
                this.numBtn[i].visible = false;
            }
        }
        this._maxIndex = v - 1;
    }
}