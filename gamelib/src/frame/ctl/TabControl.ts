// import { StringUtil } from "../util/StringUtil";
// import { ButtonCtl } from "./ButtonCtl";

import { LogSys } from "../util/LogSys";
import { StringUtil } from "../util/StringUtil";
import { ButtonCtl } from "./ButtonCtl";

interface ITabControlSkin{
    tf:Laya.Label;
    img:Laya.Image;
}
export interface ITabControl{
    selectIndex:number;
    dispose();
}
/**
 * 页签控制器
 */
export class TabControl implements ITabControl{
    checkHandler:Laya.Handler;
    private btnCtlList:ButtonCtl[] = [];
    private f_defaultItemHandler(curSkin:ITabControlSkin,index:number,sel: boolean){
        let skin: ITabControlSkin = curSkin;
        skin.tf.text = this.dataArr[index];
        if (sel) {
            skin.img.skin = "remote/main/main/anniu_2.png";
        } else {
            skin.img.skin = "remote/main/main/anniu_1.png";
        }
    }
    public itemHandler: Laya.Handler;
    public items: Laya.Sprite[];

    private dataArr:[];

    private selHandler: Laya.Handler;

    private _selectIndex: number = -1;
    constructor() {

    }

    public static Create(target,selHandler: Function, itemHandler: Function) {
        let _tab: TabControl = new TabControl();
        _tab.selHandler = new Laya.Handler(target,selHandler);
        _tab.itemHandler = new Laya.Handler(target,itemHandler);
        return _tab;
    }

    public set visible(v:boolean){
        for(let i = 0;i < this.items.length;i++){
            this.items[i].visible = v;
        }
    }

    public init(items: Laya.Sprite[], selHandler: Laya.Handler, itemHandler?: Laya.Handler) {
        this.items = items;
        if(itemHandler){
            this.itemHandler = itemHandler;
        }else{
            this.itemHandler = new Laya.Handler(this,this.f_defaultItemHandler);
        }
        this.selHandler = selHandler;
        let _dataList = [];
        this.btnCtlList = [];
        for(let i = 0;i < items.length;i++){
            let cell = items[i];
            // cell.on(Laya.Event.CLICK,this,this.onItemClick,[i,cell]);
            let _btnCtl = ButtonCtl.CreateBtn(cell,this,this.onItemClick,false,[i]);
            this.btnCtlList.push(_btnCtl);
            // DebugUtil.draw(cell);
            _dataList.push(i);
        }
        this.setData(_dataList);
    }
    public get curDataArr(){
        return this.dataArr;
    }

    public get selectItemData(){
        return this.dataArr[this.selectIndex];
    }

    public onItemClick(i:number){
        // ,cell:Laya.Sprite
        // MainModel.Ins.event(TowerMainEvent.ButtonCtlClick,cell);
        this.selectIndex = i;
    }

    public dispose() {
        // while (this.items.length > 0) {
        //    let item:Laya.Sprite = this.items.pop();
        //    item.off(Laya.Event.CLICK,this,this.onItemClick);
        // }
        while(this.btnCtlList.length){
            let btn = this.btnCtlList.shift();
            btn.dispose();
        }

        this.items = null;
        this.itemHandler = null;
        this.selHandler = null;
    }

    public setData(data){
        this.dataArr = data;
        let len = data.length;
        if(len > this.items.length ){
            LogSys.Warn('TabControl ,please add much more items');
        }
        for(let i = 0;i < this.items.length;i++){
            let cell = this.items[i];
            if(i < len){
                cell.visible = true;
            }else{
                cell.visible = false;
            }
            this.itemHandler.runWith([cell,i,this._selectIndex == i,this.dataArr[i]]);
        }
    }
    public get selectIndex(){
        return this._selectIndex;
    }
    public set selectIndex(v: number) {
        if(this.checkHandler && !this.checkHandler.runWith(v)){
            return;
        }
        if(this._selectIndex == v){
            return;
        }
        if(v + 1 > this.items.length){
            return;
        }
        for(let i = 0;i < this.dataArr.length;i++){
            let item = this.items[i];            
            this.itemHandler.runWith([item,i,v==i,this.dataArr[i]]);
        }
        this._selectIndex = v;
        this.selHandler.runWith(v);
    }

    public refreshTabsView(){
        let v = this._selectIndex;
        for(let i = 0;i < this.dataArr.length;i++){
            let item = this.items[i];
            this.itemHandler.runWith([item,i,v==i,this.dataArr[i]]);
        }
    }

    // /**
    //  * 选择当前tabIndex 并强制选择
    //  */
    // public refresh(){
    //     if(this.selectIndex == -1){
    //         this.selectIndex = 0;
    //     }else{
    //         this.forceSelectIndex(this.selectIndex);
    //     }
    // }

    /**
     * 强制选择
     */
    public forceSelectIndex(v:number){
        this._selectIndex = -1;
        this.selectIndex = v;
    }
    //===================================================================
    static createTabCtl(skins:Laya.Sprite[],styles:ITabSelectStyle[],
        selectHandler:Laya.Handler,labs:string):ITabControl
    {
        let tab = new TabControlDecorator(skins,styles,selectHandler,labs);
        return tab;
    }

}

export interface ITabSelectStyle{
    color:string;
    strokeColor:string;
    skin:string;
}
// interface ITabBtnSkin{
//     img:Laya.Image;
//     tf:Laya.Label;
// }
export class TabControlDecorator implements ITabControl{
    private _tab:TabControl;
    private _styles:ITabSelectStyle[];
    private _lbArr:string[];

    // labs:string
    // styles:ITabSelectStyle[],
    /**
     * @param styles 0 索引选择状态
     */
    constructor(skins:Laya.Sprite[],_styles:ITabSelectStyle[],_selectHandler:Laya.Handler,_labs?:string){
        this._tab = new TabControl();
        if(!StringUtil.IsNullOrEmpty(_labs)){
            this._lbArr = _labs.split("|");
        }
        this._styles = _styles;
        this._tab.init(skins, _selectHandler, new Laya.Handler(this, this.itemTabHandler));
    }

    dispose(){
        this._tab.dispose();
    }
    private itemTabHandler(tabSkin:ITabControlSkin,index: number, sel: boolean, data){
        let style:ITabSelectStyle;
        if(sel){
            style = this._styles[0];
        }else{
            style = this._styles[1];
        }
        tabSkin.img.skin = style.skin;
        tabSkin.tf.color = style.color;
        tabSkin.tf.strokeColor = style.strokeColor;
        if(this._lbArr){
            tabSkin.tf.text = this._lbArr[index]||"";
        }
    }

    set selectIndex(v:number){
        this._tab.selectIndex = v;
    }
}