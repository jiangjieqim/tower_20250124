import { EGameColor } from "../model/EGameColor";
import { IconUtils } from "../model/IconUtils";
import { MainModel } from "../model/MainModel";

export class ValLabelCtl {
    public static refresh(tf: Laya.Label, id: number, needCount: number, img: Laya.Image = null) {
        let have: number = MainModel.Ins.mRoleData.getVal(id);

        tf.text = StringUtil.val2m(have) + "/" + needCount;
        if (have < needCount) {
            tf.color = EGameColor.NotEnough;
        } else {
            tf.color = EGameColor.Normal;
        }

        if (img) {
            img.skin = IconUtils.getIconByCfgId(id);
        }
    }
}