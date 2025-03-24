import { E } from "../../../../G";
import { ITowerMonster } from "../../compose/views/ITowerMonster";
import { EEquipType } from "../../main/vos/ECellType";
import { BaseSpineCoreSkel } from "./BaseSpineCoreSkel";
import { ESpineSlotId } from "./SpineManager";
/**获取插槽id */
function getSlotID(type:EEquipType){
    switch(type){
        case EEquipType.Barde:
            return ESpineSlotId.BODY;
        case EEquipType.Casque:
            return ESpineSlotId.HEAD;
        case EEquipType.Weapon:
            return ESpineSlotId.WEAPON;
        case EEquipType.Shield:
            return ESpineSlotId.SHIELD;
        case EEquipType.Shoe:
            return ESpineSlotId.FOOT1;
        // case EEquipType.Wing:
            // return ESpineSlotId.WING1;
    }
    // console.warn("getSlotID:"+type);
}

/**spine 内核控制类 */
export class SpineCoreSkel extends BaseSpineCoreSkel implements ITowerMonster {
    /**设置部位皮肤 */
    public setSlot(type:EEquipType,val:number){
        let slot = getSlotID(type);
        if(!slot){
            // LogSys.Warn("type " + type + " is null!");
            // if(E.Debug){
            // console.error("type " + type + " is null!");
            // }
            // return;
        }else{
            let url = "";
            if (slot == ESpineSlotId.SHIELD || slot == ESpineSlotId.WEAPON) {
                url = `o/item/${type}_${val}.png`;
            } else {
                url = `o/equip/hero_${val}.png`;
            }
            this.loadProxy.pushSkin(slot, url);
            this.loadProxy.load();
        }
    }

    /**设置坐骑皮肤 */
    public setHorseSkin(rideId: number) {
        if(this.mLoadWingHorse){
            let slotList: string[] = [
                ESpineSlotId.HTAIL,
                ESpineSlotId.HBODY,
                ESpineSlotId.HNECK,
                ESpineSlotId.HFOOT2,
                ESpineSlotId.HFOOT1,
                ESpineSlotId.HHEAD,
                ESpineSlotId.HFOOT2_2,
                ESpineSlotId.HFOOT1_2,
            ];
            let url: string = `o/horse_spine/horse_${rideId}.png`;
            for (let i = 0; i < slotList.length; i++) {
                this.loadProxy.pushSkin(slotList[i], url);
            }
            this.loadProxy.load();
        }
    }

    /**设置翅膀皮肤,wing = 0的时候为透明的翅膀,即没有翅膀 */
    // public setWingSkin(wing: number) {
    //     if(this.mLoadWingHorse){
    //         this.loadProxy.pushSkin(ESpineSlotId.WING1, `o/item/13_${wing}.png`);
    //         this.loadProxy.pushSkin(ESpineSlotId.WING2, `o/item/13_${wing}.png`);
    //         this.loadProxy.load();
    //     }
    // }

    private get mLoadWingHorse(){
        // return !E.isWar3Skin;
        return E.gameAdapter.mLoadWingHorse;
    }

}