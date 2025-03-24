
export class ReelAnimCtl{
    /**动画移动的方向 1 向左移动 -1向右移动*/
    private readonly dir:number = -1;
    private con:Laya.Sprite;
    private tween:Laya.Tween;
    private useTime:number;
    private offsetX:number = 0;//-261;
    private isPlaying:boolean = false;
    private callBack:Laya.Handler;

    // private dclist:DrawCallNode[] = [];
    constructor(){
        
    }

    public init(con:Laya.Sprite){
        this.con = con;
        this.offsetX = this.dir * -1 * con.width;
        this.tween = new Laya.Tween();
        // con.on(Laya.Event.DISPLAY,this,this.onDisplay);
        // con.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);

        // for(let i = 0;i < labels.length;i++){
        //     let lb:Laya.Label = labels[i];
        //     let d1 = MainModel.Ins.getDcNode(lb,MainModel.Ins.mainView.labelLayer);
        //     d1.visible = true;
        //     this.dclist.push(d1);
        // }

        this.visible = true;
    }

    public set visible(v:boolean){
        if(this.con){
            this.lbvis = v;
            this.con.visible = v;
        }
    }

    public play(_callBack?:Laya.Handler,_useTime:number = 250){
        if(this.con){
            this.useTime = _useTime;
            this.callBack = _callBack;
            if(this.isPlaying){
                return;
            }
            this.isPlaying = true;
            this.con.x = 0;
            this.tween.clear();
            this.lbParent = false;
            this.tween.to(this.con,{x:this.offsetX},this.useTime,null,new Laya.Handler(this,this.end));
        }
    }

    private set lbParent(v:boolean){
        // for(let i = 0;i < this.dclist.length;i++){
        //     let dc = this.dclist[i];
        //     if(v){
        //         dc.reset();
        //     }else{
        //         dc.resetOldParent();
        //     }
        // }
    }

    private set lbvis(v:boolean){
        // for(let i = 0;i < this.dclist.length;i++){
        //     let dc = this.dclist[i];
        //     dc.visible = v;
        // }
    }


    private end(){
        if(this.callBack){
            this.callBack.runWith(0);
        }
        this.tween.to(this.con,{x:0},this.useTime,null,new Laya.Handler(this,this.end1));
    }

    private end1(){
        this.isPlaying = false;
        this.lbParent = true;
        if(this.callBack){
            this.callBack.runWith(1);
        }
    }

    public refresh() {
        // if (this.con) {
        //     for (let i = 0; i < this.dclist.length; i++) {
        //         let dc = this.dclist[i];
        //         if (MainModel.Ins.mainView.isMaskBgVisible) {
        //             dc.resetOldParent();
        //         } else {
        //             dc.refresh();
        //         }
        //     }
        // }
    }
}