import { stTitle } from "../../../../network/protocols/BaseProto";

export class ChengHaoModel extends Laya.EventDispatcher{
    private static _ins: ChengHaoModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new ChengHaoModel();
        }
        return this._ins;
    } 

    public static UPDATE_TITLE:string = "UPDATE_TITLE";
    public static UPDATE_DATA:string = "UPDATE_DATA";

    public titleList:stTitle[];
    public titleId:number;

    constructor(){
        super();
        this.titleList = [];
        this.titleId = 0;
    }

    public getDataById(id:number){
        return this.titleList.find(ele => ele.id == id);
    }

    public isRedTip(){
        if(this.isNewCHRedTip()){
            return true;
        }
        return false;
    }

    public isNewCHRedTip(){
        for(let i:number=0;i<this.titleList.length;i++){
            if(this.titleList[i].isNew){
                return true;
            }
        }
        return false;
    }
}