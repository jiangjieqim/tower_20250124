import { AvatarSubView } from "./AvatarSubView";
export class AvatarBaseView extends AvatarSubView{
    constructor(){
        super();
    }
}
/**主角用的基础皮肤 */
export class AvatarMainSkinView extends AvatarSubView{
    constructor(){
        super();
    }
    /*
    protected getOtherStyle(type,equipStyle:number){
        // let val:number = HuanZhuangModel.Ins.getEquipStyle(type);
        // if(val){
        //     return val;
        // }
        // return equipStyle;
        return MainModel.Ins.getIdByStyle(type);
    }
    */
}
// /**翅膀 */
// export class AavatrWingView extends AvatarBaseView{

//     constructor(){
//         super();
//     }

//     public initWing(wingId){
//         this.rideId = 0;
//         this.wingId = wingId;
//         this.equipList = null;
//         this.dir = EAvatarDir.Left;
        
//         this.initRes();
//         this.play(EAvatarAnim.OnlyWing);
//         this.start();
//         this.refreshSkin();
//     }

//     public refreshSkin(){
//        this.setWing();
//     }

// }