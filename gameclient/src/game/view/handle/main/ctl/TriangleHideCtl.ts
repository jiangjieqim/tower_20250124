/**滑动到底部的时候隐藏img控件 */
export class TriangleHideCtl {
    protected _list: Laya.List;
    protected _img: Laya.Image;
    /**多少行节点数据 */
    public oneRow:number = 1;
    /**是否是横向 */
    private hScrollBar:boolean  = false;
    public bind(_list: Laya.List, img: Laya.Image,hScrollBar:boolean = false) {
        this._list = _list;
        this._img = img;
        this.hScrollBar = hScrollBar;
        _list.scrollBar.elasticBackTime = 0;
        _list.elasticEnabled = false;
        _list.scrollBar.on(Laya.Event.CHANGE, this, this.onChangeEvt);
    }
    public dispose() {
        this._list.scrollBar.off(Laya.Event.CHANGE, this, this.onChangeEvt);
    }
    public onChangeEvt() {
        let gap = 0;//= this._list.spaceY;
        // let h: number = this.cellSize * this._list.array.length - gap;
        if(this._list.array){
            let cVal:number;
            if(this.hScrollBar){
                cVal = this._list.width;
                gap = this._list.spaceX;
            }else{
                cVal = this._list.height;
                gap = this._list.spaceY;
            }
            let h: number = this.cellSize * Math.ceil(this._list.array.length / this.oneRow) - gap;
            if (this._list.scrollBar && h - this._list.scrollBar.value <= cVal) {
                this._img.visible = false;
            } else {
                this._img.visible = true;
            }
        }
        else{
            this._img.visible = false;
        }
    }
    
    protected get cellSize(){
        return this._list['_cellSize'] || 0;
    }
}