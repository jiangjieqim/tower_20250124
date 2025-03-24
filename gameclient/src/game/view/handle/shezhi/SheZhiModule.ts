import { PlatformConfig } from "../../../../InitConfig";
import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { ELayerType } from "../../../layer/LayerMgr";
import { CommunityInit_revc, CommunityReward_revc, DailyShare_revc, InviteBind_revc, InviteInit_revc, InviteReward_revc, InvitedCnt_revc, NoticeList_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { FunctionModel } from "../funs/FunctionModel";
import { EFuncDef } from "../main/model/EFuncDef";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../towertmain/model/TowerMainModel";
import { GameQuanView } from "./gamequan/GameQuanView";
import { SheZhiModel } from "./model/SheZhiModel";
import { SheZhiView } from "./shezhiset/SheZhiView";
import { GQTapTapView } from "./taptap/GQTapTapView";
import { KFTapTapView } from "./taptap/KFTapTapView";
import { YaoQingTapView } from "./taptap/YaoQingTapView";
import { YaoQingTapView1 } from "./taptap/YaoQingTapView1";
import { DHMView } from "./view/DHMView";
import { KeFuView } from "./view/KeFuView";
import { NoticePopView } from "./view/NoticePopView";
import { YaoQingView } from "./yaoqing/YaoQingView";

export class SheZhiModule extends BaseModel{
    private static _ins:SheZhiModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new SheZhiModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new DHMView(EViewType.DHMView));
        this.Reg(new YaoQingView(EViewType.YaoQingView));
        this.Reg(new GameQuanView(EViewType.GameQuanView));
        this.Reg(new SheZhiView(EViewType.SheZhiView));
        this.Reg(new KeFuView(EViewType.KeFuView));
        this.Reg(new NoticePopView(EViewType.NoticePop,ELayerType.subFrameLayer));
        this.Reg(new GQTapTapView(EViewType.GQTapTapView));
        this.Reg(new KFTapTapView(EViewType.KFTapTapView));
        this.Reg(new YaoQingTapView(EViewType.YaoQingTapView));
        this.Reg(new YaoQingTapView1(EViewType.YaoQingTapView1));

        TowerMainModel.Ins.on(TowerMainEvent.MainViewInit,this,this.onMainViewInit);

        E.MsgMgr.AddMsg(SERVER_MSGID.InviteInit, this.InviteInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.InviteReward, this.InviteReward,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.InvitedCnt, this.InvitedCnt,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.DailyShare, this.DailyShare,this);

        E.MsgMgr.AddMsg(SERVER_MSGID.CommunityInit, this.CommunityInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.CommunityReward, this.CommunityReward,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.NoticeList,this.NoticeList,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.InviteBind,this.InviteBind,this);
    }

    private onMainViewInit(){
        Laya.timer.callLater(this,this.setDot);
    }

    private setDot(){   
        if (SheZhiModel.Ins.isYQRedTip()) {
            FunctionModel.Ins.funcSetRed(EFuncDef.YaoQiang, true);
            FunctionModel.Ins.funcSetRed(EFuncDef.YaoQiangTap, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.YaoQiang, false);
            FunctionModel.Ins.funcSetRed(EFuncDef.YaoQiangTap, false);
        }
        if (SheZhiModel.Ins.isSQRedTip()) {
            FunctionModel.Ins.funcSetRed(EFuncDef.SheQu, true);
        }else {
            FunctionModel.Ins.funcSetRed(EFuncDef.SheQu, false);
        }
    }

    private InviteInit(value:InviteInit_revc){
        if(value.platId == initConfig.platform){
            SheZhiModel.Ins.yqList = value.datalist;
            SheZhiModel.Ins.yqCount = value.validCnt;
            SheZhiModel.Ins.yqInvitedCnt = value.invitedCnt;
            SheZhiModel.Ins.yqDay = value.dailyShare;
            SheZhiModel.Ins.binded = value.binded;
        }
    }

    private InviteReward(value:InviteReward_revc){
        if(SheZhiModel.Ins.yqList){
            for(let i:number=0;i<value.datalist.length;i++){
                let index = SheZhiModel.Ins.yqList.findIndex(ele => ele.flag === value.datalist[i].flag);
                if(index !=- 1){
                    SheZhiModel.Ins.yqList[index] = value.datalist[i];
                }
            }
            this.onMainViewInit();
            SheZhiModel.Ins.event(SheZhiModel.UPDATE_DATA_YAOQING);
        }
    }

    private InvitedCnt(value:InvitedCnt_revc){
        if(value.platId == initConfig.platform){
            if(value.flag == 0){
                SheZhiModel.Ins.yqInvitedCnt = value.cnt;
            }else{
                SheZhiModel.Ins.yqCount = value.cnt;
            }
            SheZhiModel.Ins.event(SheZhiModel.UPDATE_DATA_YAOQING);
        }
    }

    private DailyShare(value:DailyShare_revc){
        if(value.platId == initConfig.platform){
            SheZhiModel.Ins.yqDay = value.data;
            SheZhiModel.Ins.event(SheZhiModel.UPDATE_DATA_YAOQING);
        }
    }

    private CommunityInit(value:CommunityInit_revc){
        SheZhiModel.Ins.gameClubList = value.datalist;
    }

    private CommunityReward(value:CommunityReward_revc){
        for(let i:number=0;i<value.datalist.length;i++){
            let index = SheZhiModel.Ins.gameClubList.findIndex(ele => ele.flag === value.datalist[i].flag);
            if(index !=- 1){
                SheZhiModel.Ins.gameClubList[index] = value.datalist[i];
            }
        }
        this.onMainViewInit();
        SheZhiModel.Ins.event(SheZhiModel.GameClubUpdate);
    }

    public NoticeList(revc:NoticeList_revc){
        for(let i = 0;i < revc.datalist.length;i++){
            let cell = revc.datalist[i];
            if(cell.type == 1){
                SheZhiModel.Ins.localNoticeList.push(cell);
            }
        }
    }

    private InviteBind(value:InviteBind_revc){
        if(value.platId == initConfig.platform){
            SheZhiModel.Ins.binded = value.binded;
            SheZhiModel.Ins.event(SheZhiModel.UPDATE_DATA_YAOQINGTAP);
        }
    }
}