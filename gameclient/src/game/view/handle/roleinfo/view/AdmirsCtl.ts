import { FriendZan_req, FriendZan_revc, WatchCommonRankDetail_revc } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FriendModel } from "../../friend/model/FriendModel";
import { MainModel } from "../../main/model/MainModel";
import { RoleInfoModel } from "../model/RoleInfoModel";

export interface IAdmirsSkin {
    praiseImg: Laya.Image;
    praiseLb: Laya.Label;
}
/**赞赏控制器 */
export class AdmirsCtl {
    private _skin: IAdmirsSkin;
    private _data: WatchCommonRankDetail_revc;
    private btn: ButtonCtl;
    constructor(_skin: IAdmirsSkin) {
        this._skin = _skin;
        this.btn = ButtonCtl.CreateBtn(_skin.praiseImg, this, this.onClickHandler);
        FriendModel.Ins.on(FriendModel.UPDATE_VIEW_ZAN, this, this.onUpdateAdmirs);
    }

    private onClickHandler() {
        if(this.isSelf){
            return;
        }
        let req = new FriendZan_req();
        req.playerId = this._data.playerData.AccountId;
        SocketMgr.Ins.SendMessageBin(req);
    }

    dispose() {
        FriendModel.Ins.off(FriendModel.UPDATE_VIEW_ZAN, this, this.onUpdateAdmirs);
        this.btn.dispose();
    }
    private get isSelf() {
        return this._data.playerData.AccountId == MainModel.Ins.mRoleData.AccountId;
    }
    refresh(_data: WatchCommonRankDetail_revc) {
        this._data = _data;

        let zanExist = false;//是否存在赞
        let zan:number;
        if (this.isSelf) {
            zan = RoleInfoModel.Ins.zan;
            zanExist = true;
        } else {
            zanExist = _data.zanExist == 1;
            zan = _data.zan;
        }
        //=========================================
        if (zanExist) {
            this.btn.grayMouseDisable = true;
        } else {
            this.btn.grayMouseDisable = false;
        }
        this._skin.praiseLb.text = zan + "";
    }

    private onUpdateAdmirs(revc: FriendZan_revc) {
        if (revc.playerId == this._data.playerData.AccountId) {
            this._skin.praiseLb.text = revc.zan + "";
            this.btn.grayMouseDisable = true;
        }
    }

}