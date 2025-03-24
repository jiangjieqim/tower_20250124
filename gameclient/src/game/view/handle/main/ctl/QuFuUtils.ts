// import { StringUtil } from "../../../../../frame/util/StringUtil";
// import { stServerItem } from "../../../../network/protocols/BaseProto";
// import { EFuncDef } from "../../main/model/EFuncDef";
// import { FuncProxy } from "../../funs/proxy/FunctionProxy";
// export interface IQuFuItemSkin{
//     img_new:Laya.Sprite;
//     img_sel:Laya.Image;
//     img:Laya.Image;
//     lab_sname: Laya.Label;
//     lab_name: Laya.Label;
//     lab_lv: Laya.Label;
// }
// export class QuFuUtils{
//     static updateLabe(item:IQuFuItemSkin,data:stServerItem){
//         let isNamingCharge = !FuncProxy.Ins.isClose(EFuncDef.NamingCharge);//冠名权功能是否开启
       
//         if(isNamingCharge){

//             let lastName = "";
//             if(!StringUtil.IsNullOrEmpty(data.naming)){
//                 lastName += "-" + data.naming;
//             }
//             item.lab_name.text = ""

//             item.lab_sname.text = data.serverName + lastName;
//             if(data.roleLevel){
//                 // item.lab_name.text = data.roleName;
//                 item.lab_lv.text = "lv:" + data.roleLevel;
//             }else{
//                 // item.lab_name.text = "";
//                 item.lab_lv.text = "";
//             }
//         }else{

//             item.lab_sname.text = data.serverName;
//             if(data.roleLevel){
//                 item.lab_name.text = data.roleName;
//                 item.lab_lv.text = "lv:" + data.roleLevel;
//             }else{
//                 item.lab_name.text = "";
//                 item.lab_lv.text = "";
//             }
//         }

//         if(data.isNew){
//             item.img_new.visible = true;
//         }else{
//             item.img_new.visible = false;
//         }

//         switch(data.serverState){//区服状态 1爆满 2畅通 3维护
//             case 1:
//                 item.img.skin = "remote/loginnew1/bm.png";
//                 break;
//             case 2:
//                 item.img.skin = "remote/loginnew1/ct.png";
//                 break;
//             case 3:
//                 item.img.skin = "remote/loginnew1/wh.png";
//                 break;
//         }
//     }    
// }