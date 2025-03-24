import { ResPath } from "../../../resouce/ResPath";
import { EEquipType } from "../main/vos/ECellType";
import { AvatarView } from "./AvatarView";
import { IMSpineRegions } from "./SpineSwitchSkin";

export class AvatarSubView extends AvatarView{
    private skinList:string[] = [ "daoguang","xinxin","ying"];
    /**用于增量扩展 */
    public addtionSkinList:string[] = [];
    // protected hasEquips: EEquipType[];//已经穿戴的中的装备
    constructor(){
        super();
    }

    protected initFightSkin(){
        // let skinlist = [
        //     "daoguang",
        //     // "hit1",
        //     // "hit2",
        //     "xinxin",
        //     "ying",
        // ];


        let skinlist = [];//this.skinList;

        skinlist = skinlist.concat(this.skinList);
        skinlist = skinlist.concat(this.addtionSkinList);

        for(let i = 0;i < skinlist.length;i++){
            let part:string = skinlist[i];
            this.setPartSkin(part);
        }
    }
    public dispose(){
        super.dispose();
    }
    // /*设置装备数据*/
    // public setEquipData(_l:EquipBaseVo[]){
    //     this.equipList = _l;
    //     this.refreshSkin();
    // }
    protected readonly allEquip:EEquipType[] = [
        EEquipType.Barde,
        EEquipType.Shoe,
        EEquipType.Casque,
        EEquipType.Weapon,
        EEquipType.Shield
    ];

    //初始化战斗中的皮肤
    protected setPartSkin(_part:string){
        this.setSkin(this.main, this.baseImg, _part);
    }
    protected getOtherStyle(type,equipStyle:number){
        return equipStyle;
    }
    //override
    public refreshSkin(){
        
        if(this.useFightSkin){
            this.initFightSkin();
        }
        /*
        // let hasEquips: EEquipType[] = [];
        let l: EquipBaseVo[] = this.equipList || [];
        // this.hasEquips = [];

        for (let i = 0; i < l.length; i++) {
            let cell: EquipBaseVo = l[i];
            let _st: stEquipItem = cell.equipVo;
            if (_st.wearable == EWearableType.Wearable) {
                let equipStyle: number = _st.equipStyle;
                let type: number = _st.type;
                equipStyle = this.getOtherStyle(type,equipStyle);
                this.equipSkin(type, equipStyle);
            }
        }
        */
        this.defaultSkin();        
    //    this.setWing();
    }

    /**设置翅膀 */
    protected setWing() {
        // this.coreSpine.setWingSkin(this.wingId);
    }

    protected defaultSkin(){
        this.setWing();
        this.refreshHorse();
        
        this.setEmpty();
    }

    protected refreshHorse(){
        if(!this.hasHorse()){   //没有马
            return;
        }
        this.baseImg = `o/horse_spine/horse_${this.rideId}.png`;        
        this.coreSpine.setHorseSkin(this.rideId);
    }
    // private resCount:number= 0;

    private setSkin(fileList: IMSpineRegions[], sourceUrl: string, part: string){
        // this.resCount++;
        /*
        if(this.spine.templet instanceof SpineTemplet_3_8_v1){
            this.spine.templet.setSkin(fileList,sourceUrl,part,new Laya.Handler(this,this.onResLoad));
        }
        */
    }

    // private onResLoad(){
    //     this.resCount--;
    //     console.log(this.resCount);
    //     if(this.resCount<=0){
    //         this.event(AvatarEvent.RES_COMPLETE);
    //     }
    // }

    /**更新坐骑 */
    protected updateRide(id:number){
        this.rideId = id;
        this.reload();
    }

    /**更新翅膀 */
    public updateWing(id:number){
        this.wingId = id;
        this.refreshSkin();
    }

    /**更新装备(坐骑,翅膀)的皮肤 */
    public updateSkin(type: EEquipType, equipStyle: number) {
        if(type == EEquipType.Wing){
            this.updateWing(equipStyle);
        }else if(type == EEquipType.ZuoQi){
            this.updateRide(equipStyle);
        }else{
            this.equipSkin(type, equipStyle);
        }
    }

    /**
     * 设置裸装 设置未穿戴的裸装皮肤
     */
    protected setEmpty(){
        for(let i = 0;i < this.allEquip.length;i++){
            let type:EEquipType = this.allEquip[i];
            // if(this.hasEquips.indexOf(type)==-1){
                this.equipEmptySkin(type);
            // }
        }
    }
 
    private equipEmptySkin(type: EEquipType) {
        // let curTemplet: SpineTemplet_3_8_v1 = this.spine.templet as SpineTemplet_3_8_v1;
        // let equipStyle = 1;
        switch (type) {
            case EEquipType.Barde:
            case EEquipType.Shoe:
            case EEquipType.Casque:
            case EEquipType.Weapon:
            case EEquipType.Shield:
            //     if(this.fashion){
            //         //使用基础套装组件
            //         let _part1: string = this.fashion.getPartEquipKey(type);
            //         // curTemplet.setSkin(this.main, this.baseImg, _part1);
            //         this.setSkin(this.fashion.main, ResPath.Avatar.baseImg, _part1);
            //     }
                break;
                
        }
    }

    /**更新spine插槽上的部位 */
    protected equipSkin(type:EEquipType,equipStyle:number){
        if(this.imageID){
            return;
        }
        // if(Laya.Utils.getQueryString("debug_fight_war3")){
        //     return;
        // }
        // hasEquips:EEquipType[]=null

        //let curTemplet:SpineTemplet_3_8_v1 = this.spine.templet;
        if(type != EEquipType.Wing){
            // if(this.coreSpine){
            this.coreSpine.setSlot(type,equipStyle);
            // }
        }
    }

    public set currentTime(v:number){
        // this.spine.currentTime = v;
        this.coreSpine.currentTime = v;
    }

}