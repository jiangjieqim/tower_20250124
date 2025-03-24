
let mDrawTest:boolean = false;
interface IQuickBtn extends Laya.View{
    tf:Laya.Label;
    btn:Laya.Button;
}
export interface IListData{
    color:string;
    txt:string;
}

export enum ESelectListEvent{
    /**点击了标题 */
    CLICK_TITLE = "CLICK_TITLE"
}

export class QuickQua implements IListData{
    color:string;
    txt:string;
    f_id:number;
}

export class SelectListCtl extends Laya.EventDispatcher{

    private static _allList:SelectListCtl[] = [];

    public static closeAll(){
        for(let i = 0;i < this._allList.length;i++){
            let cell = this._allList[i];
            cell.close();
        }
    }

    constructor(){
        super();
        SelectListCtl._allList.push(this);
    }

    /**是否作为组件使用 */
    public mCompose:boolean = false;
    public curIndex:number = 0;
    public selectHandler:Laya.Handler;
    
    /**是否是在下方 */
    public dirBottom:boolean = false;
    public isDrawLine:boolean = false;
    public listcontainerOffX:number = 0;
    public listcontainerOffHeight:number = 0;

    private _maxColCount:number = 0;
    /**列最大数量 */
    public get maxColCount():number{
        return this._maxColCount;
    }
    public set maxColCount(v:number){
        this._maxColCount = v;
    }
    private listcontainer:Laya.Sprite;
    private btnlist:IQuickBtn[] = [];
    private showTf:Laya.Label;
    private dataList:any[];
    private sanjiao:Laya.Sprite;
    private listarea:Laya.Sprite;
    private selectImg:string;
    // private defaultRect:Laya.Rectangle;
    private startPosX:number;
    private cellWidth:number;
    public itemHandler:Laya.Handler;
    public checkHandler:Laya.Handler;
    public clickCallBack:Laya.Handler;
    public get selectVo(){
        let vo = this.dataList[this.curIndex]
        if(vo){
            return vo;
        }
        this.curIndex = 0;
        return this.dataList[this.curIndex];
        //return this.dataList[this.dataList.length-1];
    }

    public get curDataList(){
        return this.dataList;
    }
    private drawBotLine(_item:IQuickBtn,index:number){
        _item.graphics.clear();
        if(_item.y == 0){

        }else{
            _item.graphics.drawRect(0,0,_item.width,2,null,"#ffffff",1);
        }

        if((_item.y + _item.height) == _item.height * this.maxColCount){

        }else{
            _item.graphics.drawRect(0,_item.height,_item.width,2,null,"#ffffff",1);
        }
    }

    private drawtop(_item:IQuickBtn){
        _item.graphics.clear();
        _item.graphics.drawRect(0,0,_item.width,2,null,"#ffffff",1);
    }
    /**
     * @param sanjiao 
     * @param listarea 
     * @param listcontainer 
     * @param showTf 
     * @param cls 
     * @param dataList 数据
     * @param poolKey 对象池key
     */
    public init(sanjiao:Laya.Sprite,listarea:Laya.Sprite,listcontainer:Laya.Sprite,showTf:Laya.Label,cls,dataList:IListData[],selectImg:string="",poolKey?:string) {
        this.startPosX = listarea.x;
        while(this.btnlist.length > 0){
            let item = this.btnlist.pop();
            item.removeSelf();
            if(poolKey){
                Laya.Pool.recover(poolKey,item);
            }
        }

        this.selectImg = selectImg;
        this.sanjiao = sanjiao;
        this.listarea = listarea;
        listarea.on(Laya.Event.CLICK,this,this.onAreaHander);

        this.dataList = dataList;
        this.showTf = showTf;
        this.listcontainer = listcontainer;
        // let ox  = 0;//= 5;
        let cnt = dataList.length;
        let cellHeight = 0;
        
        let startIndex:number = -1;
        let colIndex:number = 0;
        let cellWidth:number = 0;
        //当前的y坐标
        // let oy:number = 0;
        for(let i = 0;i < cnt;i++){

            if (this.maxColCount > 0) {
                if (i % this.maxColCount == 0) {
                    startIndex = 0;
                    colIndex++;
                }else{
                    startIndex++;
                }
            }else{
                startIndex++;
            }

            let _item: IQuickBtn;
            if(poolKey){
                _item = Laya.Pool.getItemByClass(poolKey,cls);
            }else{
                _item = new cls();
            }
            cellWidth = _item.width;
            // size = (listarea.width - _item.width) >> 1;
            
            // let index_oy:number = startIndex;
            if(this.dirBottom){
                _item.y = startIndex * _item.height;
                // if (i > 0 /*&& startIndex % this.maxColCount != 0*/) {
                    // _item.graphics.drawRect(0,0,_item.width,2,null,"#9F540C",1);
                    // this.drawBotLine(_item,i);
                // }
                if(this.isDrawLine && i > 0 && i != cnt - 1){
                    this.drawBotLine(_item,i);
                }
            }else{
                _item.y = (cnt - startIndex - 1) * _item.height;
                if(this.isDrawLine && i < cnt-1){
                    // _item.graphics.drawRect(0,0,_item.width,2,null,"#9F540C",1);
                    this.drawtop(_item);
                }
            }
            if(this.maxColCount > 0){
                let offset = Math.ceil(this.dataList.length / this.maxColCount);
                _item.x = this.startPosX + cellWidth * (offset - colIndex);
            }else{
                _item.x = 0;
            }
            // this._ui.listcontainer.addChild(_item);
            listcontainer.addChild(_item);
            cellHeight = _item.height;
            // let cfg: Configs.t_EquipmentQuality_dat = EquipmentQualityProxy.Ins.GetDataById(i + 1);
            let cfg = dataList[i];
            _item.dataSource = cfg;
            if(this.itemHandler){
                this.itemHandler.runWith(_item);
            }else{
                this.updateCell(_item.tf, cfg);
            }
            // _item.btn.clickHandler = new Laya.Handler(this, this.onItemClickHandler, [i]);
            _item.btn.on(Laya.Event.MOUSE_DOWN,this,this.onItemClickHandler,[i]);

            if(mDrawTest){
                _item.graphics.drawRect(0,0, _item.width, _item.height,null,"#ff0000",1);
                // _item.tf.text+=+" "+i;
            }
            this.cellWidth = cellWidth;
            this.btnlist.push(_item);
            // this.cfglist.push(cfg);
        }
        if(colIndex == 0 || this.maxColCount == 0){
            this.listcontainer.height = cnt * cellHeight + this.listcontainerOffHeight;
            this.listcontainer.x = this.startPosX + this.listcontainerOffX;
            this.listcontainer.width = cellWidth;
        }else{
            this.listcontainer.width = cellWidth * colIndex;
            this.updateListcontainerBg(this.dataList.length,cellHeight);
            let offset = Math.ceil(this.dataList.length / this.maxColCount);
            this.listcontainer.x = this.startPosX - (offset - 1) * cellWidth + this.listcontainerOffX;
        }
        if(this.dirBottom){
            this.listcontainer.y = listarea.y + listarea.height;
        }else{
            this.listcontainer.y = listarea.y - this.listcontainer.height;
        }
        this.resetHit();
    }

    private updateListcontainerBg(dataMaxCount:number,cellHeight:number){
        if(dataMaxCount < this._maxColCount){
            this.listcontainer.height = cellHeight * dataMaxCount + this.listcontainerOffHeight;
        }
        else{
            this.listcontainer.height = cellHeight * this.maxColCount + this.listcontainerOffHeight;
        }
    }

    private hitSpr:Laya.Sprite = new Laya.Sprite();
    /**重置碰撞区域 */
    private resetHit() {
        if (this.mCompose) {
            let p:Laya.Sprite = this.listcontainer.parent as Laya.Sprite;
            if (this.isOpen) {
                let offset = Math.ceil(this.dataList.length / this.maxColCount);
                if(offset == Infinity){
                    offset = 1;
                }
                let ox:number = -(offset - 1) * this.cellWidth;
                if(this.dirBottom){
                    p.hitArea = new Laya.Rectangle(ox,0,this.listcontainer.width,this.listcontainer.height+this.listarea.height);
                }else{
                    p.hitArea = new Laya.Rectangle(ox,-this.listcontainer.height,this.listcontainer.width,this.listcontainer.height+this.listarea.height);
                }
            }else{
                p.hitArea = new Laya.Rectangle(0,0,this.listarea.width,this.listarea.height);
            }
            // p.on(Laya.Event.CLICK,this,this.onClickDo);
            let rect:Laya.Rectangle = p.hitArea;
            
            // if(E.Debug){
            //     this.hitSpr.graphics.clear();
            //     this.hitSpr.graphics.drawRect(rect.x,rect.y,rect.width,rect.height,null,"#ff0000",1);
            // }
            this.hitSpr.hitArea = rect;
            this.hitSpr.on(Laya.Event.CLICK,this,this.onClickDo);
            this.listarea.addChildAt(this.hitSpr,0);

            if(mDrawTest){
                p.graphics.clear();
                p.graphics.drawRect(rect.x,rect.y,rect.width,rect.height,null,"#00ff00",1);
            }
        }
    }

    private onClickDo(){
        // this.close();
        // console.log("========>");
        Laya.timer.callLater(this,this.onClickCalllater);
    }

    private onClickCalllater(){
        this.event(ESelectListEvent.CLICK_TITLE,[this.isOpen]);
    }

    private get isOpen() {
        return this.listcontainer.visible;
    }
    private onAreaHander(e:Laya.Event) {
        // e.stopPropagation();
        // Laya.timer.once(500,this,this.onLater);
        this.closeOtherList();
        this.onLater();
    }

    /**打开展示面板 */
    private onLater(){
        this.listcontainer.visible = !this.listcontainer.visible;

        this.isOpen = this.listcontainer.visible;
        if(this.listcontainer.visible){
            this.sanjiao.rotation = 180;
        }else{
            this.sanjiao.rotation = 0;
        }
        //console.log(">>>>",this.listcontainer.visible);
        this.refreshSelect();
        this.resetHit();
    }

    private refreshSelect(){
        for(let i = 0;i < this.btnlist.length;i++){
            let skin:any = this.btnlist[i].btn;
            let btn:Laya.Image = skin;
            if(i == this.curIndex){
                btn.skin = this.selectImg;
            }else{
                btn.skin = "";
            }

            if(this.itemHandler){
                this.itemHandler.runWith(this.btnlist[i]);
            }
        }
    }


    private set isOpen(v:boolean){
        if(v){
            // Laya.stage.once(Laya.Event.MOUSE_DOWN, this, this.removeList);
            Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, this._onStageMouseWheel);
        }else{
            // Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.removeList);
            Laya.stage.off(Laya.Event.MOUSE_WHEEL, this, this._onStageMouseWheel);
        }
    }

    // private removeList(e:Laya.Event) {
    //     // e.stopPropagation();
    //     // this.close();
    // }

    private _onStageMouseWheel(e:Laya.Event){
        // e.stopPropagation();
        this.close();
    }

    public close(){
        // console.log("close");
        if(!this.listcontainer){
            return;
        }
        if(!this.listcontainer.visible){
            return;
        }
        this.listcontainer.visible = false;
        this.sanjiao.rotation = 0;
        this.resetHit();
        // Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.removeList);
        Laya.stage.off(Laya.Event.MOUSE_WHEEL, this, this._onStageMouseWheel);
    }

    public selectIndex(index:number){
        let cfg;
        for(let i = 0;i < this.btnlist.length;i++){
            let cell = this.btnlist[i];
            if(index == i){
                cfg = cell.dataSource;
                break;
            }
        }
        if(cfg){
            this.curIndex = index;
            this.updateCell(this.showTf,cfg);
        }
        if(this.selectHandler){
            this.selectHandler.runWith(index);
        }
        this.close();
    }

    public refresh(){
        this.selectIndex(this.curIndex);
    }
    /**更新子item */
    private updateCell(label: Laya.Label, cfg: IListData) {
        label.text = cfg.txt;//cfg.f_EquipmentLevel+LE.angMgr.getLang("UpTips");
        label.color = `#${cfg.color}`;//`#${cfg.f_Color}`;

        // debug && (label.text += " " + (cfg["f_id"] || ""));
    }

    private closeOtherList() {
        let l1 = SelectListCtl._allList;
        for(let i = 0;i < l1.length;i++){
            let cell = l1[i];
            if(cell !=this){
                cell.close();
            }
        }
    }


    private onItemClickHandler(_index:number,e:Laya.Event){
        e.stopPropagation();
        this.closeOtherList();

        let b:boolean = true;
        if(this.checkHandler){
            b = this.checkHandler.runWith(_index);
        }
        if(b){
            this.selectIndex(_index);
        }

        if(this.clickCallBack){
            this.clickCallBack.runWith(_index);
        }
    }
}
