import { ui } from "../../../../../../ui/layaMaxUI";
import { ItemSlotCtl } from "../../../main/views/icon/SoltItemView";
import { ItemVo } from "../../../main/vos/ItemVo";

export class BoxItem1 extends ui.views.main.ui_baoxiangItem1UI{

    protected ctl:ItemSlotCtl;
    
    constructor() {
        super();
        this.ctl = new ItemSlotCtl(this.view);
    }

    public setData(value: any) {
        if(!value)return;
        let vo = new ItemVo;
        vo.cfgId = value.cfgId;
        vo.count = value.count;
        this.ctl.setData(vo);
        this.sp.visible = value.isNew;
    }
}