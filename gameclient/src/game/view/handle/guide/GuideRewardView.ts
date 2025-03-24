import { RewardView } from "../common/RewardView";
import { ItemViewFactory } from "../main/model/ItemViewFactory";
/**引导结算 */
export class GuideRewardView extends RewardView{
    // protected bNextGuideStep:boolean = true;
    protected initUI(){
        this._ui.tips.visible = false;
    }

    protected onInit(){
        // let req = new CommonClaimRewards_req();
        // req.flag = 5;
        // SocketMgr.Ins.SendMessageBin(req);
        // 29-1|2-10|3-1000#继续战斗
        // let rewards = ItemViewFactory.convertCellList(_cfg.f_param);
        let a1 = this.Data.split("#");
        this.arr = ItemViewFactory.convertCellList(a1[0]);
        this._ui.goonLb.text = a1[1];
        this.updateView();
    }
}