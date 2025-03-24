import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { TreasureInit_revc, TreasureShow_revc, Treasure_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { TowertMainLinbaoModel } from "./model/TowertMainLinbaoModel";
import { TowertMainLinbaoTip } from "./view/TowertMainLinbaoTip";
import { LinBaoCQView } from "./view/linbaocq/LinBaoCQView";
import { LinBaoCQView1 } from "./view/linbaocq/LinBaoCQView1";
import { LinBaoCQView2 } from "./view/linbaocq/LinBaoCQView2";

export class TowertMainLinbaoModule extends BaseModel{
    private static _ins:TowertMainLinbaoModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new TowertMainLinbaoModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new TowertMainLinbaoTip(EViewType.TowertMainLinbaoTip));
        this.Reg(new LinBaoCQView(EViewType.LinBaoCQView));
        this.Reg(new LinBaoCQView1(EViewType.LinBaoCQView1));
        this.Reg(new LinBaoCQView2(EViewType.LinBaoCQView2));

        E.MsgMgr.AddMsg(SERVER_MSGID.TreasureInit, this.TreasureInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.Treasure, this.Treasure,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.TreasureShow, this.TreasureShow,this);
    }

    private TreasureInit(value:TreasureInit_revc){
        TowertMainLinbaoModel.Ins.guarante = value.guarante;
        TowertMainLinbaoModel.Ins.linbaoList = value.datalist;
        TowertMainLinbaoModel.Ins.newList = [];
    }

    private Treasure(value:Treasure_revc){
        if(value.flag == 1){
            TowertMainLinbaoModel.Ins.linbaoList = TowertMainLinbaoModel.Ins.linbaoList.concat(value.datalist);
            for(let i:number=0;i<value.datalist.length;i++){
                let obj: any = {};
                obj.id = value.datalist[i].id;
                obj.isSelect = false;
                TowertMainLinbaoModel.Ins.newList.push(obj);
            }
        }else{
            for(let i:number=0;i<value.datalist.length;i++){
                let index = TowertMainLinbaoModel.Ins.linbaoList.findIndex(ele=>ele.id == value.datalist[i].id);
                if(index != -1){
                    TowertMainLinbaoModel.Ins.linbaoList[index] = value.datalist[i];
                }
            }
            TowertMainLinbaoModel.Ins.event(TowertMainLinbaoModel.UPDATE_UP);
        }
        TowertMainLinbaoModel.Ins.event(TowertMainLinbaoModel.UPDATE_LINBAO);
    }

    private TreasureShow(value:TreasureShow_revc){
        TowertMainLinbaoModel.Ins.guarante = value.guarante;
        let arr = [];
        let array = [];
        for(let i:number=0;i<value.datalist.length;i++){
            let obj:any = {};
            obj.data = value.datalist[i];
            obj.flag = 0;
            let ii = TowertMainLinbaoModel.Ins.linbaoList.findIndex(ele=>ele.id == value.datalist[i].id);
            let iii = arr.indexOf(value.datalist[i].id);
            if(ii == -1 && iii == -1){
                arr.push(value.datalist[i].id);
                obj.flag = 1;
            }
            array.push(obj);
        }
        TowertMainLinbaoModel.Ins.event(TowertMainLinbaoModel.UPDATE_LINBAO_CQ,[array]);
    }
}