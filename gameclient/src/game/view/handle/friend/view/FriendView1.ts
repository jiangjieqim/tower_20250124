import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { stFriendListItem } from "../../../../network/protocols/BaseProto";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { HeadCtl } from "../../common/HeadCtl";
import { MainModel } from "../../main/model/MainModel";
import { t_Friendship } from "../proxy/t_Friendship";
import { t_Friendship_Task } from "../proxy/t_Friendship_Task";

export class FriendView1 extends ViewBase{
    private _ui:ui.views.friend.ui_friendView1UI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _wid:number;
    private _ctl:HeadCtl;
    private _ctl1:HeadCtl;

    private _sp:SimpleEffect;

    protected onAddLoadRes() {
        
    }

    protected onFirstInit(): void {
        if(!this.UI){
            this.UI = this._ui = new ui.views.friend.ui_friendView1UI;

            this._ctl = new HeadCtl(this._ui.view);
            this._ctl1 = new HeadCtl(this._ui.view1);
            this._wid = this._ui.pro.width;

            this._ui.list.itemRender = ui.views.friend.ui_friendItem3UI;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
     }

     private onRenderHandler(item:ui.views.friend.ui_friendItem3UI){
        let cfg:Configs.t_Friendship_Task_dat = item.dataSource;
        item.lab.text = cfg.f_title;
        item.lab2.text = cfg.f_des;
        let st = cfg.f_reward.split("-")[1];
        item.lab3.text = st + "点";
        let data = this._data.datalist.find(ele => ele.taskId == cfg.f_id);
        if(data){
            item.lab1.text = "(" + data.num + "/" + cfg.f_task_amount + ")";
        }else{
            item.lab1.text = "(0/" + cfg.f_task_amount + ")";
        }
     }

     private _data:stFriendListItem;
     protected onInit(): void {
        let data = MainModel.Ins.mRoleData;
        this._ctl.setData(data.headUrl,data.HeadFrame);
        this._ui.lab.text = data.trophy + "";
        this._ui.lab1.text = data.getName();

        let value:stFriendListItem = this.Data;
        this._data = value;
        let headUrl = MainModel.Ins.convertHead(value.headUrl);
        this._ctl1.setData(headUrl, value.headFrame);
        this._ui.lab2.text = value.trophy + "";
        this._ui.lab3.text = value.nickName;

        let cfg = t_Friendship.Ins.getCfgByNum(value.friendship);
        this._sp = new SimpleEffect(this._ui.sp, `o/spine/succeed/yazi/yazi`,0,60);
        if(cfg){
            this._sp.play(cfg.f_level,true);
            this._ui.lab4.text = cfg.f_des;
        }else{
            this._sp.play(0,true);
            this._ui.lab4.text = "";
        }

        this._ui.lab5.text = value.friendship + "";
        let num = t_Friendship.Ins.List[t_Friendship.Ins.List.length - 1].f_points;
        let num1 = value.friendship / num;
        if(num1 > 1){
            num1 = 1;
        }
        this._ui.pro.width = num1 * this._wid;
        this._ui.lab6.text = t_Friendship.Ins.List[0].f_points + "";
        this._ui.lab7.text = t_Friendship.Ins.List[1].f_points + "";
        this._ui.lab8.text = t_Friendship.Ins.List[2].f_points + "";

        this._ui.list.array = t_Friendship_Task.Ins.List;
     }

     protected onExit(): void {
        if (this._sp) {
            this._sp.dispose();
            this._sp = null;
        }
     }
}