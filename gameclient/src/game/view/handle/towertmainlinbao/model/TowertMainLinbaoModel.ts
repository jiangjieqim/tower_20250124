import { SocketMgr } from "../../../../network/SocketMgr";
import { Treasure_req, stTreasure } from "../../../../network/protocols/BaseProto";
import { FunctionModel } from "../../funs/FunctionModel";
import { EFuncDef } from "../../main/model/EFuncDef";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { t_Treasure_Upgrade } from "../proxy/t_Treasure_Upgrade";

export class TowertMainLinbaoModel extends Laya.EventDispatcher{
    private static _ins: TowertMainLinbaoModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new TowertMainLinbaoModel();
        }
        return this._ins;
    } 

    public static UPDATE_LINBAO:string = "UPDATE_LINBAO";
    public static UPDATE_LINBAO_CQ:string = "UPDATE_LINBAO_CQ";
    public static UPDATE_UP:string = "UPDATE_UP";

    public linbaoList:stTreasure[];
    public newList:any;
    public guarante:number;

    constructor(){
        super();
        this.linbaoList = [];
        this.newList = [];
    }

    public getLinBaoById(id:number){
        return this.linbaoList.find(ele => ele.id === id);
    }

    public isLinBaoRedTip(){
        if(!FunctionModel.Ins.isOpenByFuncId(EFuncDef.LinBao,false)){
            return false;
        }
        if(this.isAllLinBaoLv() || this.isNewRedTip()){
            return true;
        }
        return false;
    }

    public isAllLinBaoLv(){
        for(let i:number=0;i<this.linbaoList.length;i++){
            if(this.isLinBaoLv(this.linbaoList[i].id,this.linbaoList[i].level)){
                return true;
            }
        }
        return false;
    }

    public isNewRedTip(){
        for(let i:number=0;i<this.newList.length;i++){
            if(this.newList[i].isSelect == false){
                return true;
            }
        }
        return false;
    }

    public isLinBaoLv(id:number,lv:number){
        let nextCfg = t_Treasure_Upgrade.Ins.getNextCfgByIdAndLv(id,lv);
        if(!nextCfg){
            return false;
        }
        let cfg = t_Treasure_Upgrade.Ins.getCfgByIdAndLv(id,lv);
        return TowerMainModel.Ins.isItemEnoughStArr(cfg.f_upgrade_consume);
    }

    public sendCmd(flag:number){
        let req = new Treasure_req;
        req.flag = flag;
        SocketMgr.Ins.SendMessageBin(req);
    }
}