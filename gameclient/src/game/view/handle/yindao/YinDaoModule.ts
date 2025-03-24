// import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
// import { E } from "../../../G";
// import { GuideInit_revc, Guide_revc } from "../../../network/protocols/BaseProto";
// import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
// import { YinDaoModel } from "./YinDaoModel";

// export class YinDaoModule extends BaseModel{
//     private static _ins:YinDaoModule;
//     public static get Ins(){
//         if(!this._ins){
//             this._ins = new YinDaoModule();
//         }
//         return this._ins;
//     }

//     public onInitCallBack():void{
        
//     }

//     public initMsg(){
//         // MainModel.Ins.on(TowerMainEvent.ButtonCtlClick,this,this.onButtonClick);
//         E.EventMgr.on(EventID.ButtonCtlClick,this,this.onButtonClick);

//         E.MsgMgr.AddMsg(SERVER_MSGID.GuideInit, this.GuideInit,this);
//         E.MsgMgr.AddMsg(SERVER_MSGID.Guide, this.Guide,this);
//     }

//     private onButtonClick(skin:Laya.Sprite){
//         if(YinDaoModel.Ins._gCfg && YinDaoModel.Ins._sp){
//             if(YinDaoModel.Ins._sp == skin){
//                 YinDaoModel.Ins.removeYD();
//                 YinDaoModel.Ins.sendCmd(YinDaoModel.Ins._gCfg.f_groupid,YinDaoModel.Ins._gCfg.f_orderid);
//             }
//         }
//     }

//     private GuideInit(value:GuideInit_revc){
//         YinDaoModel.Ins.yindaoList = value.datalist;
//     }

//     private Guide(value:Guide_revc){
//         for(let i:number=0;i<value.datalist.length;i++){
//             let index = YinDaoModel.Ins.yindaoList.findIndex(ele => ele.groupId === value.datalist[i].groupId);
//             if(index != -1){
//                 YinDaoModel.Ins.yindaoList[index] = value.datalist[i];
//             }
//         }
//         YinDaoModel.Ins.event(YinDaoModel.UPDATE_VIEW);
//     }
// }