import { ui } from "../../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../../network/SocketMgr";
import { TrophyReward_req, stCommonReward } from "../../../../../network/protocols/BaseProto";
import { DotManager } from "../../../common/DotManager";
import { HeadCtl } from "../../../common/HeadCtl";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { MainModel } from "../../../main/model/MainModel";
import { ItemSlotCtl } from "../../../main/views/icon/SoltItemView";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";

export class TrophyItem extends ui.views.main.ui_trophyItemUI{
    private _ctl:ItemSlotCtl;
    private _headCtl:HeadCtl;

    constructor(){
        super();
        this._ctl = new ItemSlotCtl(this.view);
        this._headCtl = new HeadCtl(this.head);
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        let vo:stCommonReward = TowerMainFightModel.Ins.trophyRewardList.find(ele=>ele.id == this._data.f_id);
        if(vo && vo.state == 1){
            let req = new TrophyReward_req;
            req.id = this._data.f_id;
            SocketMgr.Ins.SendMessageBin(req);
        }
    }

    private _data:Configs.t_Trophy_Reward_dat;
    public setData(value:Configs.t_Trophy_Reward_dat,data:Configs.t_Trophy_Reward_dat){
        if(!value)return;
        this._data = value;
        this.img_bg.skin = `o/trophyicon/bg_${value.f_table}.png`;
        if(value.f_id == data.f_id){
            this.head.visible = true;
            let self = MainModel.Ins.mRoleData;
            this._headCtl.setData(self.headUrl,self.HeadFrame);
            this.bg.skin = "remote/towerMain/bottom_sz_d2.png";
        }else{
            this.head.visible = false;
            this.bg.skin = "remote/towerMain/bottom_sz_d1.png";
        }
        let vo = ItemViewFactory.convertItem(value.f_reward);
        this._ctl.setData(vo);
        if(value.f_stage != ""){
            this.img.visible = true;
            this.img4.visible = false;
            let arr = value.f_stage.split("-");
            this.img.skin = "remote/base/t_jl_d" + parseInt(arr[3]) + ".png";
            this.img1.skin = "remote/base/t_jl_d_" + parseInt(arr[2]) + ".png";
            this.img2.skin = "remote/base/t_jl_" + parseInt(arr[1]) + ".png";
            this.img3.skin = `o/trophyicon/${parseInt(arr[0])}.png`;
        }else{
            this.img.visible = false;
            this.img4.visible = true;
        }
        this.lab.text = value.f_trophy + "";

        DotManager.removeDot(this);
        let voo:stCommonReward = TowerMainFightModel.Ins.trophyRewardList.find(ele=>ele.id == value.f_id);
        if(voo){
            this.suo.visible = false;
            if(voo.state == 1){
                DotManager.addDot(this,0,30);
                this.img_m.visible = false;
                this.lq.visible = false;
            }else {
                this.img_m.visible = true;
                this.lq.visible = true;
            }
        }else{
            this.img_m.visible = true;
            this.suo.visible = true;
            this.lq.visible = false;
        }
    }
}