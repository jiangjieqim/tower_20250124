// import { EMsgBoxType } from "../../../common/defines/EnumDefine";
// import { E } from "../../../G";
// import { ResPath } from "../../../resouce/ResPath";
// import { EEquipType } from "../main/vos/ECellType";
// import { AtlasParser, IMSpineRegions } from "./SpineSwitchSkin";
// import { SpineTemplet_3_8_v1 } from "./SpineTemplet_3_8_v1";

// //时装模块
// export class FashionModel{
//     private static _ins: FashionModel;
//     public static get Ins() {
//         if (!this._ins) {
//             this._ins = new FashionModel();
//         }
//         return this._ins;
//     }
//     public equips:IMSpineRegions[];//套装骨骼
//     public main:IMSpineRegions[];//主骨骼
//     private spineTemplateMap:SpineTemplet_3_8_v1[] = [];//骨架模板对象
    
//     private templateList:string[] = [];
//     private tempLateCallBack:Laya.Handler;
//     constructor(){
//         this.equips = AtlasParser.Start(Laya.Loader.getRes(ResPath.Avatar.equipAtlas));
//         // console.log(this.fileList);
//         //              body foot   head
//         //t_EquipmengID 5    11     2
//         this.main  = AtlasParser.Start(Laya.Loader.getRes(ResPath.Avatar.baseAtlas));//weapon shield
//         // console.log(this.main);
//     }

//     /**获取套装的部位标识名*/
//     public getPartEquipKey(type: EEquipType) {
//         switch (type) {
//             case EEquipType.Barde:
//                 return "body";
//             case EEquipType.Shoe:
//                 return "foot";
//             case EEquipType.Casque:
//                 return "head";
//             case EEquipType.Weapon:
//                 return "weapon";
//             case EEquipType.Shield:
//                 return "shield";
//             case EEquipType.Wing:
//                 return "wing";
//         }
//     }

//     public loadSpineTemp(arr:string[],end:Laya.Handler){
//         this.templateList = arr;
//         this.tempLateCallBack = end;
//         this.startLoadTemplate();
//     }

//     public getTemplatePool(url:string){
//         for(let i = 0;i < this.spineTemplateMap.length;i++){
//             let templet: SpineTemplet_3_8_v1 = this.spineTemplateMap[i];
//             if(!templet.used && templet.mUrl == url){
//                 templet.used = true;
//                 return templet;
//             }
//         }
//         //console.log(1);
//         // E.ViewMgr.AL("getTemplatePool:"+url);
//         E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,'getTemplatePool'+","+url);
//     }

//     public recoverTemplate(_template:SpineTemplet_3_8_v1,url:string){
//         for(let i = 0;i < this.spineTemplateMap.length;i++){
//             let templet: SpineTemplet_3_8_v1 = this.spineTemplateMap[i];
//             if(templet==_template && templet.mUrl == url){
//                 templet.used = false;
//                 break;
//             }
//         }
//     }

//     private startLoadTemplate(){
//         if(this.templateList.length > 0){
//             let url = this.templateList.shift();
//             let templet: SpineTemplet_3_8_v1 = new SpineTemplet_3_8_v1();
//             templet.loadAni(url);
//             templet.once(Laya.Event.COMPLETE, this, this.parseComplete);
//             templet.once(Laya.Event.ERROR, this, this.onError);
//             this.spineTemplateMap.push(templet);
//         }else{
//             this.tempLateCallBack.run();
//         }
//     }

//     private onError(){
//         console.log("SpineTemplet_3_8_v1 parse error");
//     }

//     private parseComplete(): void {
//         this.startLoadTemplate();
//     }
// }