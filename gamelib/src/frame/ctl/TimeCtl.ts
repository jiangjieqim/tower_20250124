export class TimeCtl{
    protected destroyed:boolean = false;
    private tf:Laya.Label;
    protected end:Laya.Handler;
    protected ticket:number = 0;
    protected updateHandler:Laya.Handler;
    constructor(tf?:Laya.Label){
        this.tf = tf;
    }
    public setText(v:string){
        if(this.destroyed){
            
        }else{
            if(this.tf){
                this.tf.text = v;
            }
        }
    }
    /**
     * @param s 剩余的秒
     */
    public start(s:number,update:Laya.Handler = null,end:Laya.Handler = null){
        this.end = end;
        this.updateHandler = update
        this.ticket = s;
        this.timeTick();
    }
    public get tickVal():number{
        return this.ticket;
    }
    protected timeTick(){
        if(this.ticket > 0){
            if(this.updateHandler!=null){
                this.updateHandler.runWith(this.ticket);
            }else{
                this.setText(this.ticket.toString());
            }
            Laya.timer.once(1000,this,this.timeTick);
        }else{
            Laya.timer.clear(this,this.timeTick);
            if(this.end!=null){
                this.end.run();
            }
        }
        this.subTicket();
    }

    protected subTicket(){
        this.ticket--;
    }

    public stop(){
        this.ticket = -1;
        // if(this.end!=null){
        //     this.end.run();
        // }
        Laya.timer.clear(this,this.timeTick);
    }

    dispose(){
        this.stop();
        this.tf = null;
        this.destroyed = true;
    }
}