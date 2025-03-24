// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { CommunityReward_req } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { SheZhiModel } from "../model/SheZhiModel";
import { GameQuanItem } from "./GameQuanItem";

export class GameQuanItem1 extends ui.views.shezhi.ui_gameQuanItemUI{

    constructor(){
        super();
        this.list.itemRender = GameQuanItem;
        this.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick))
    }

    private onRenderHandler(item:GameQuanItem){
        item.setData(item.dataSource,this._flag);
    }

    private onBtnClick() {
        if (!this._data) return;
        let req = new CommunityReward_req;
        req.flag = 1;
        req.ids = [this._data.f_id];
        SocketMgr.Ins.SendMessageBin(req);
    }

    private _data:Configs.t_Community_dat;
    private _flag:boolean;
    public setData(value:Configs.t_Community_dat){
        if(!value)return;
        this._data = value;
        let count = SheZhiModel.Ins.getGameCount(value.f_type);
        this.lab.text = E.getLang(value.f_des_text,count);

        let data = SheZhiModel.Ins.gameClubList.find(ele => ele.flag === value.f_id);
        DotManager.removeDot(this.btn);
        this._flag = false;
        this.sp.visible = this.sp1.visible = this.btn.visible = false;
        if (data.times == 0) {
            this.sp1.visible = true;
        } else if (data.times == 1) {
            this.btn.visible = true;
            DotManager.addDot(this.btn);
        } else {
            this._flag = true;
            this.sp.visible = true;
        }

        this.list.array = ItemViewFactory.convertItemList(value.f_reward);
    }
}