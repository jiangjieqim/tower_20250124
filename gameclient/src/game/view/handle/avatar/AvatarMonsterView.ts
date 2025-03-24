import { stSkin } from "../../../network/protocols/BaseProto";
// import { uint64 } from "../../../network/protocols/uint64";
import { EEquipSkin } from "../main/vos/ECellType";
import { AvatarFactory } from "./AvatarFactory";
import { AvatarSubView } from "./AvatarSubView";
export class AvatarFightVo{
    // isDie:boolean;
    hp:number;
    uid:uint64;
}
/**怪物*/
export class AvatarMonsterView extends AvatarSubView{
    get fightVo():AvatarFightVo{
        return this.vo
    }
    set fightVo(v){
        this.vo = v;
    }
    /**
     * @param fight 是否需要战斗中的资源
     */
    constructor(fight:boolean = true){
        super();
        this.useFightSkin = fight;
    }
    curSkin:stSkin;

    public refreshSkin(){
        this.initFightSkin();
        // this.hasEquips = [];
        let _l:EEquipSkin[] = AvatarFactory.Skin2Equip(this.curSkin);
        for(let i = 0;i < _l.length;i++){
            let cell:EEquipSkin = _l[i];
            if(cell.equipStyle!=0){
                this.equipSkin(cell.type,cell.equipStyle);
                // this.hasEquips.push(cell.type);
            }
        }
        this.defaultSkin();
    }

    public set mSkin(v:stSkin){
        this.rideId = v ? v.f_MountID : 0;
        // this.imageID = v.f_WarSkinID;
        this.curSkin = v;
        this.refreshSkin();
    }

    /**皮肤是否相同 */
    public isSkinEqual(temp: stSkin) {
        if (this.curSkin && temp) {
            let skinVo = this.curSkin;
            if (skinVo.f_BodyID == temp.f_BodyID &&
                skinVo.f_HeadID == temp.f_HeadID &&
                skinVo.f_MountID == temp.f_MountID &&
                skinVo.f_ShieldID == temp.f_ShieldID &&
                skinVo.f_WeaponID == temp.f_WeaponID &&
                skinVo.f_WingID == temp.f_WingID) {
                return true;
            }
        }
    }
}