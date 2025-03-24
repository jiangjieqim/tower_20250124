import { ui } from "../../../../../ui/layaMaxUI";
import { ItemSlotCtl } from "../../main/views/icon/SoltItemView";
import { ItemVo } from "../../main/vos/ItemVo";
import { ETaodaeLingQu } from "../model/TaodaeFactory";

export class TaodaeTaskItemSlotVo{
    itemVo:ItemVo;
    status:ETaodaeLingQu;
}

export class TaodaeTaskItemSlot extends ui.views.common.ui_slot_status_itemUI{
    private ctl:ItemSlotCtl;
    static CLS_KEY:string = "TaodaeTaskItemSlot";
    constructor(){
        super();
        this.ctl = new ItemSlotCtl(this.slot);
    }

    setData(data:TaodaeTaskItemSlotVo){
        this.ctl.setData(data.itemVo);
        if(data.status == ETaodaeLingQu.IsGet){
            this.mask1.visible = true;
        }else{
            this.mask1.visible = false;
        }
    }
}