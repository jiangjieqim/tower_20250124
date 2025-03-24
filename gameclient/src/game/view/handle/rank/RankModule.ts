import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { CommonRank_revc, WatchCommonRankDetail_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { RankModel } from "./model/RankModel";
import { RankRewView } from "./view/RankRewView";
import { RankView } from "./view/RankView";
import { RankView1 } from "./view/RankView1";
import { RankView2 } from "./view/RankView2";
import { MainModel } from "../main/model/MainModel";

export class RankModule extends BaseModel{
    private static _ins:RankModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new RankModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new RankView(EViewType.RankView));
        this.Reg(new RankView1(EViewType.RankView1));
        this.Reg(new RankRewView(EViewType.RankRewView));
        this.Reg(new RankView2(EViewType.RankView2));

        E.MsgMgr.AddMsg(SERVER_MSGID.CommonRank,this.CommonRank,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.WatchCommonRankDetail,this.WatchCommonRankDetail,this);
    }

    private CommonRank(value:CommonRank_revc){
        RankModel.Ins.rankList = value.datalist;
        RankModel.Ins.rankSelf = value.self[0];
        RankModel.Ins.rankFlag = value.flag;
        RankModel.Ins.event(RankModel.UPDATE_RANK);
    }

    private WatchCommonRankDetail(value:WatchCommonRankDetail_revc){
        if(MainModel.Ins.isDetailVer2){
            E.ViewMgr.Open(EViewType.PlayerInfoView,null,value);
            return;
        }

        E.ViewMgr.Open(EViewType.RankView1,null,value);
    }
}