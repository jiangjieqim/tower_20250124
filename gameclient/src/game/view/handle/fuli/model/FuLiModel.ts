export class FuLiModel extends Laya.EventDispatcher{
    private static _ins: FuLiModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new FuLiModel();
        }
        return this._ins;
    } 

    public static UPDATE_OnlineSec:string = "UPDATE_OnlineSec";

    public onlineSec:number;
}