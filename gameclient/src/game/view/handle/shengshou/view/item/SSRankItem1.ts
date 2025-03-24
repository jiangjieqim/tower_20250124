import { ui } from "../../../../../../ui/layaMaxUI";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";

export class SSRankItem1 extends ui.views.shengshou.ui_rankItem2UI{

    constructor(){
        super();
    }

    public setData(value:Configs.t_HolyBeast_Rank_Reward_dat){
        if(!value)return;
        ItemViewFactory.renderItemSlots(this.sp,value.f_reward,true,10,0.8,"left");
        let arr = value.f_rank.split("|");
        if(arr.length == 1){
            this.lab.text = "";
            this.img.skin = "remote/base/img_" + parseInt(arr[0]) + ".png";
        }else{
            this.lab.text = arr[0] + "-" + arr[1];
            this.img.skin = "";
        }
    }
}