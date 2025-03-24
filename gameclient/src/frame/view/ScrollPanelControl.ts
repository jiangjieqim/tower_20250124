import { GamePanel } from "./GameList";

export interface IScrollNodeView {
    clsKey:string;
}
export interface IRowNodeSkin extends Laya.View{
    refresh();
}
export abstract class RowMoveBaseNode {
    public y:number;
    protected panel:Laya.Panel;
    protected abstract clsKey;
    private _jList = [];
    private isInRect: boolean = false;
    private check: boolean = false;
    private showStatus: boolean = false;
    private height:number;
    public list:any[];
    /**单个子节点的高度 */
    private _rowSkinHeight:number;
    public get rowSkinHeight():number{
        if(!this._rowSkinHeight){
            let skin = this.createSkin();
            Laya.Pool.recover(this.clsKey,skin);
            this._rowSkinHeight = skin.height;
        }
        return this._rowSkinHeight;
    } 
    protected createSkin(){
        return null; 
    }
    constructor() {
        this.check = false;
        this._jList = [];
        this.isInRect = false;
        this.showStatus = false;
    }
    /**
    * @param cur_y
    * @param h Panel的高度
    */
    public isCanDraw(cur_y, h) {
        let _canAdd = false;
        if (this.y + this.height >= cur_y && this.y < cur_y + h) {
            this.isInRect = true;
        }
        else {
            this.isInRect = false;
        }
        if (this.isInRect) {
            if (!this.showStatus) {
                this.clear();
                _canAdd = true;
                this.showStatus = true;
            }
        }
        else {
            this.clear();
            this.showStatus = false;
        }
        return _canAdd;
    }
    public free() {
        this.showStatus = false;
        this.clear();
    }
    /**
     * 清理接口
     */
    protected clear() {
        while (this._jList.length) {
            let _gridItem = this._jList.pop();
            _gridItem.removeSelf();
            if(StringUtil.IsNullOrEmpty(this.clsKey)){
                LogSys.Error(`clsKey is null...`);
            }
            Laya.Pool.recover(this.clsKey, _gridItem);
        }
        this.panel = null;
    }
    /**
     * 绘制接口
     */
    public draw(_panel:Laya.Panel) {
        if(_panel.destroyed){
            return;
        }
        this.panel = _panel;
        for (let i = 0; i < this.list.length; i++) {
            let itemView = this.createNode(i);
            _panel.addChild(itemView);
            this._jList.push(itemView);
        }
    }

    /**
     * 单节点创建
    */
    protected abstract createNode (index);
}
export class ItemSkinNode extends RowMoveBaseNode{
    protected clsKey:string = this.cls.NAME;
    get cls(){
        return null;
    }
    protected createSkin() {
        return Laya.Pool.getItemByClass(this.clsKey, this.cls);
    }
    protected createNode(index: any) {
        let vo = this.list[index];
        let _skin:IRowNodeSkin = this.createSkin() as IRowNodeSkin;
        _skin.dataSource = vo;
        _skin.refresh();
        _skin.x = index * _skin.width;
        _skin.y = this.y;
        return _skin;
    }
}
export class ScrollPanelControl extends Laya.EventDispatcher{
    public static EVENT_END:string = "EVENT_END";
    private panel: GamePanel;
    private rwlist = [];
    private isComplete = false;
    private _panelBG:Laya.Sprite;
    private _allHeight:number;
    public get renderList():RowMoveBaseNode[]{
        return this.rwlist;
    }
    constructor() {
        super();
        this.rwlist = [];
        this.isComplete = false;
        this._panelBG = new Laya.Sprite();
    }

    public getAllHeight() {
        return this._allHeight;
    }

    public getPanel(){
        return this.panel;
    }

    private isLastDraw() {
        if (this.rwlist.length > 0) {
            let _rn = this.rwlist[this.rwlist.length - 1];
            if (_rn.isInRect) {
                return true;
            }
            else {
                return false;
            }
        }
        return true;
    };

     /**
         * 偏移当前高度值,做间隔
         */
        private offsetHeight (y) {
            this._allHeight += y;
        };
        public init (panel) {
            if (!this.panel) {
                this.panel = panel;
                this.panel.dataSource = this;

                this.panel.on(Laya.Event.DISPLAY,this,this.onDisplay);
                this.panel.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
                // if(!this.panel.vScrollBar){
                    // LogSys.Error("this.panel.vScrollBar must be has value!");
                // }
                if(!this.panel.vScrollBar){
                    this.panel.vScrollBarSkin = "";
                }
                this.panel.vScrollBar.elasticBackTime = 0;
                this.panel.vScrollBar.on(Laya.Event.CHANGE, this, this.onScrollBarChange);
                this.panel.elasticEnabled = false;
                // this.panel.vScrollBar.on(Laya.Event.END,this,this.onScrollBarEnd);
            }
            // this.panel.disableScroll = false;
        };
        // private onScrollBarEnd():void{
        //     // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>!!!!onScrollBarEnd");
        //     this.refresh();
        // }
        /**
         *
         * @param handler 返回一个itemView节点
         */
        private getItemView(handler) {
            if (this.isComplete) {
                for (let i = 0; i < this.rwlist.length; i++) {
                    let item = this.rwlist[i];
                    if (item.list && item.check) {
                        for (let n = 0; n < item.list.length; n++) {
                            let status_1 = handler.runWith(item.list[n]);
                            if (status_1) {
                                this.scrollToNode(item);
                                return item._jList[n];
                            }
                        }
                    }
                }
            }
            return null;
        };
        /**
         *
         * @param row 行
         * @param col 列
         */
        public getRowCol  (row, col) {
            if (this.isComplete) {
                for (let i = 0; i < this.rwlist.length; i++) {
                    let item = this.rwlist[i];
                    if (i == row && item._jList[col]) {
                        return item._jList[col];
                    }
                }
            }
            return null;
        }

        public getSkinIndex(index:number){
            if (this.isComplete) {
                let u:number = 0;
                for (let i = 0; i < this.rwlist.length; i++) {
                    let item = this.rwlist[i];
                    for(let n = 0;n < item._jList.length;n++){
                        if(u == index){
                            return item._jList[n];
                        }
                        u++;
                    }
                }
            }
            return null;
        }

        public onScrollBarChange () {
            if(this.panel){
                if(this.panel.disableScroll){
                    // LogSys.Log("禁用了滑动功能!");
                    this.panel.vScrollBar && (this.panel.vScrollBar.value = 0);
                }else{
                    this.refresh();
                }
            }
        };
        /**
         * 数据填充完开始开始绘制
         * @param y  滚动到的坐标, 为横向的row对象的坐标
         */
        public end (y:number = undefined) {
            if (y == undefined) { y = 0; }

            this.rebuildScrollHeight(this._allHeight);

            this.refresh(true);
            this.once(ScrollPanelControl.EVENT_END,this,this.endEvt,[y]);
        };

        /**
         * 重置滚动的高度区间
         */
        public rebuildScrollHeight(_newHeight: number) {
            if (this.panel) {
                let _allHeight = this._allHeight = _newHeight;
                this._panelBG.graphics.drawRect(0, 0, this.panel.width, _allHeight, null, "#ff0000");
                this._panelBG.alpha = debug ? 1 : 0.0;
                this._panelBG.width = this.panel.width;
                this._panelBG.height = _allHeight;
                this.panel.addChild(this._panelBG);
                this.panel.scrollRect = new Laya.Rectangle(0, 0, this.panel.width, _allHeight);
                if (this.panel.vScrollBar['cancelDragOp']) {
                    this.panel.vScrollBar['cancelDragOp']();
                }
            }
        }

        private onDisplay(){
            /*
                panel滑动的时候需要,不能让stage缺少mouseup事件
                
                laya.core.js line 1087 this._events["mouseup"] 为 undefined 报错
                if (listeners.length === 0 && this._events && !this._events[type].run)
                delete this._events[type];
            */
            Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onStageUp);
        }
        private onUnDisplay(){
            // this.panel.disableScroll = false;
            Laya.stage.off(Laya.Event.MOUSE_UP,this,this.onStageUp);
        }
        private onStageUp(){

        }
        /**跳转到最后项 */
        public endLast(){
            let targetY: number = 0;
            if (this.rwlist.length > 0) {
                targetY = this.last.y;
            }
            this.end(targetY);
        }

        public endIndex(index){
            let targetY: number = 0;
            if (this.rwlist.length > 0) {
                targetY = this.rwlist[index].y;
            }
            this.end(targetY);
        }

        private endEvt(y:number){
            // Laya.timer.callLater(this, this.endLater,[y]);
            this.panel.scrollTo(0, y);
        }
        /**
         * 可作为end(y:number)接口的参数
        */
        public getScrollValue() {
            return this.panel.vScrollBar.value;
        };
        
        /**
         * 跳转到指定的节点
         */
        public scrollToNode  (node) {
            this.panel.scrollTo(0, node.y);
        };
        private onCallLayer (drawlist) {
            let len = drawlist.length;
            while (drawlist.length > 0) {
                let vo:RowMoveBaseNode = drawlist.shift();
                vo.draw(this.panel);
            }
            // if (list.JListCustom.SHOW_LOG) {
                // console.log("numChildren:" + this.panel.numChildren, "len:", len, "isLastDraw:", this.isLastDraw());
            // }
            this.isComplete = true;
            Laya.timer.callLater(this,this.dispathEnd);
        };

        private dispathEnd(){
            this.event(ScrollPanelControl.EVENT_END);
        }

        /**
         * 开始渲染
         */
        public refresh(isLater = false) {
            if (this.panel) {
                if (isLater == undefined) { isLater = false; }
                this.isComplete = false;
                let drawlist = [];
                let y = this.panel.vScrollBar.value;
                for (let i = 0; i < this.rwlist.length; i++) {
                    let _rn = this.rwlist[i];
                    if (_rn.isCanDraw(y, this.panel.height)) {
                        drawlist.push(_rn);
                    }
                }
                if (isLater) {
                    Laya.timer.callLater(this, this.onCallLayer, [drawlist]);
                }
                else {
                    this.onCallLayer(drawlist);
                }
            }
        };

        //单节点视图
        public setData(data,cls, itemHeight){
            this.split([data],cls,itemHeight);
        }

        /**
         * @param listData 数据列表
         * @param cls 数据类的模板
         * @param itemHeight 渲染对象的高度
         * @param gap 每个横向对象的高度间隔
         * @param maxRow 每行最大的数量 一行需要的的数据节点数 默认是1
         */
        public split(listData, cls, 

            itemHeight:number = undefined, 
            gap:number = undefined, 
            maxRow:number = undefined,
            gapX:number = undefined) {
            if (gap == undefined) { gap = 0; }
            if (maxRow == undefined) { maxRow = 1; }
            if (gapX == undefined) { gapX = 0; }


            let cur = 0;
            for (let i = 0; i < listData.length; i++) {
                if (cur == 0) {
                    let row = new cls();
                    if(itemHeight == undefined){
                        itemHeight = row.rowSkinHeight;
                    }
                    row.height = itemHeight + gap; //220
                    row.list = [];
                    row.y = this._allHeight + (this.last ? gap : 0);
                    this._allHeight += row.height;
                    this.add(row);
                }
                let last = this.last;
                last.list.push(listData[i]);
                cur++;
                if (cur >= maxRow) {
                    cur = 0;
                }
            }
        };
        /**
         * 清空数据
         */
        public clear () {
            this._allHeight = 0;
            Laya.timer.clear(this, this.onCallLayer);
            if (this._panelBG) {
                this._panelBG.graphics.clear();
                this._panelBG.removeSelf();
            }
            // for(let i = 0;i < this.rwlist.length;i++){

            if (this.rwlist) {
                while (this.rwlist.length) {
                    let _rn:RowMoveBaseNode = this.rwlist.pop();
                    _rn.free();
                }
            }
            while(this.panel && this.panel.numChildren){
                let node:Laya.View = this.panel.getChildAt(0) as Laya.View;
                if(typeof node['clsKey'] == "string"){
                    Laya.Pool.recover(node['clsKey'],node);
                }
                node.removeSelf();
            }

        };
        public add (node) {
            this.rwlist.push(node);
        };

        public get last():RowMoveBaseNode{
            if (this.rwlist.length > 0) {
                return this.rwlist[this.rwlist.length - 1];
            }
        }

        // Object.defineProperty(JListCustom.prototype, "last", {
        //     get: function () {
        //         if (this.rwlist.length > 0) {
        //             return this.rwlist[this.rwlist.length - 1];
        //         }
        //     },
        //     enumerable: true,
        //     configurable: true
        // });
}