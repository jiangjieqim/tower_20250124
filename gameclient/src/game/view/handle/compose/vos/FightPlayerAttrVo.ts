import { stBattleBuff } from "../../../../network/protocols/BaseProto";
import { EFightUIColor } from "./EFightEnum";
import { t_Attribute } from "./t_Attribute";
export enum EBufferValueType{
    Big = 1,
    Small = 2,
}
/**局内统计的属性数据 
 * 
 * <proto name="stBattleBuff" desc="局内全局buff">
    <protobuf type="uint16" name="attrId" desc="buff属性id" ></protobuf>
    <protobuf type="uint8" name="operator" desc="1是增加，2是减小" ></protobuf>
    <protobuf type="uint16" name="attrValue" desc="buff属性值" ></protobuf>
</proto>
 * 
 * 
*/
export class FightPlayerAttrVo {
    private _vo: stBattleBuff;
    private _cfg: Configs.t_Attribute_dat;
    constructor(vo: stBattleBuff) {
        this._vo = vo;
        this._cfg = t_Attribute.Ins.getByAttributeId(vo.attrId);
    }

    get cfg(): Configs.t_Attribute_dat {
        return this._cfg;
    }
    get icon() {
        return `o/attr/${this._cfg.f_attributeid}.png`;
    }

    get text() {
        let sign: number = -1;
        if (this._vo.operator == EBufferValueType.Big) {
            sign = 1;
        }
        if (this.cfg.f_buff_opposite_number) {
            sign = -sign;
        }

        let v = Math.ceil(this._vo.attrValue / 100);
        return `${(sign > 0 ? "+" : "-")}${v}%`;
    }

    get color(){
        return this._vo.operator == 1 ? EFightUIColor.Green : EFightUIColor.Red;
    }
}