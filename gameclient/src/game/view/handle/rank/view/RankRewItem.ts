import { ui } from "../../../../../ui/layaMaxUI";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";

export class RankRewItem extends ui.views.rank.ui_rankRewItemUI{
    private _ctl:ChengHaoCtl;

    constructor(){
        super();
        this._ctl = new ChengHaoCtl(this.view_ch);
    }

    public setData(value:Configs.t_Trophy_Rank_Reward_dat){
        if(!value)return;
        let arr = value.f_rank.split("|");
        if(arr.length == 1){
            this.lab.text = "";
            this.img.skin = "remote/rank/img_" + parseInt(arr[0]) + ".png";
        }else{
            this.lab.text = arr[0] + "-" + arr[1];
            this.img.skin = "";
        }
        this._ctl.setData(value.f_weekly_reward);
    }
}