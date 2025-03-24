import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { HomepageInit_revc, CareerStatsChange_revc, HeadChange_revc, NickNameChange_revc, HeadNew_revc, PVEModes_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { MainModel } from "../main/model/MainModel";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { TowerMainFightModel } from "../towertmain/model/TowerMainFightModel";
import { TowerMainModel } from "../towertmain/model/TowerMainModel";
import { RoleInfoModel } from "./model/RoleInfoModel";
import { RoleInfoView } from "./view/RoleInfoView";
import { RoleInfoView1 } from "./view/RoleInfoView1";
import { RoleInfoView2 } from "./view/RoleInfoView2";
import { PlayerInfoView } from "./view/PlayerInfoView";

export class RoleInfoModule extends BaseModel{
    private static _ins:RoleInfoModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new RoleInfoModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        this.Reg(new RoleInfoView(EViewType.RoleInfoView));
        this.Reg(new RoleInfoView1(EViewType.RoleInfoView1));
        this.Reg(new RoleInfoView2(EViewType.RoleInfoView2));
        this.Reg(new PlayerInfoView(EViewType.PlayerInfoView));

        E.MsgMgr.AddMsg(SERVER_MSGID.HomepageInit,this.HomepageInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.CareerStatsChange,this.CareerStatsChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.HeadChange,this.HeadChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.NickNameChange,this.NickNameChange,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.HeadNew,this.HeadNew,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.PVEModes,this.PVEModes,this);
    }

    private HomepageInit(value:HomepageInit_revc){
        RoleInfoModel.Ins.careerList = value.datalist;
        TowerMainFightModel.Ins.setDWNum(value.datalist);
        RoleInfoModel.Ins.pveList = value.pve;
        RoleInfoModel.Ins.pveHardList = value.pveHard;
        RoleInfoModel.Ins.nameCellValue = value.nickNameCost[0];
        RoleInfoModel.Ins.headList = value.heads;
        RoleInfoModel.Ins.headKList = value.HeadFrames;
        RoleInfoModel.Ins.pveModeExist = value.pveModeExist;
        RoleInfoModel.Ins.zan = value.zan;
        TowerMainFightModel.Ins.firstPassRewardCoop = value.firstPassReward;
    }

    private CareerStatsChange(value:CareerStatsChange_revc){
        if(value.mode == 1){
            RoleInfoModel.Ins.careerList = value.datalist;
            TowerMainFightModel.Ins.showDWTS();
        }else if(value.mode == 2){
            RoleInfoModel.Ins.pveList = value.datalist;
        }else if(value.mode == 4){
            RoleInfoModel.Ins.pveHardList = value.datalist;
        }
    }

    private HeadChange(value:HeadChange_revc){
        if(value.flag == 1){
            MainModel.Ins.mRoleData.mPlayer.HeadUrl = value.val;
        }else if(value.flag == 2){
            MainModel.Ins.mRoleData.HeadFrame = parseInt(value.val);
        }
        TowerMainModel.Ins.event(TowerMainEvent.UpdateRoleData);
        TowerMainModel.Ins.event(TowerMainEvent.HeadUpdate);        
    }

    private NickNameChange(value:NickNameChange_revc){
        MainModel.Ins.mRoleData.NickName = value.nickName;
        RoleInfoModel.Ins.nameCellValue = value.nextCost[0];
        TowerMainModel.Ins.event(TowerMainEvent.UpdateRoleData);
        TowerMainModel.Ins.event(TowerMainEvent.NickNameChange,value.nickName);
        E.ViewMgr.ShowMidOk("修改成功");
        E.ViewMgr.Close(EViewType.RoleInfoView1);
    }

    private HeadNew(value:HeadNew_revc){
        if(value.flag == 1){
            RoleInfoModel.Ins.headList = RoleInfoModel.Ins.headList.concat(value.datalist);
        }else if(value.flag == 2){
            RoleInfoModel.Ins.headKList = RoleInfoModel.Ins.headKList.concat(value.datalist);
        }
    }

    private PVEModes(value:PVEModes_revc){
        RoleInfoModel.Ins.pveModeExist = value.modechange;
    }
}