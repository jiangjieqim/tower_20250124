import { ItemSkinNode } from "../../../../../frame/view/ScrollPanelControl";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { CoverBigGooseTask_req, stCoverBigGooseTask } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { DotManager } from "../../common/DotManager";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ETaodaeLingQu } from "../model/TaodaeFactory";
import { TaoDaeModel } from "../model/TaoDaeModel";
import { TaodaeTaskItemSlotVo, TaodaeTaskItemSlot } from "./TaodaeTaskItemSlot";
/**任务item */
export class TaodaeTaskItemNode extends ItemSkinNode{
    get cls(){
        return TaodaeTaskItemSkin;
    }
}
/**任务item */
class TaodaeTaskItemSkin extends ui.views.taodae.ui_taodae_task_itemUI{
    static NAME:string = "TaodaeTaskItemSkin";
    private btnCtl:ButtonCtl;
    private cfg:Configs.t_Cover_Big_Goose_Task_dat;
    private initProgressImgW:number;
    constructor(){
        super();
        this.btnCtl = ButtonCtl.CreateBtn(this.btn,this,this.onClickHandler);
        this.initProgressImgW = this.progressImg.width;
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onDisplay(){
        // TaoDaeModel.Ins.on(TaodaeEvent.TaskChange,this,this.updateView);
    }

    private onUnDisplay(){
        // TaoDaeModel.Ins.off(TaodaeEvent.TaskChange,this,this.updateView);
    }

    private updateView(){
        this.refresh();
    }

    private onClickHandler(){
        let req = new CoverBigGooseTask_req();
        req.id = this.cfg.f_id;
        SocketMgr.Ins.SendMessageBin(req);
    }

    refresh(){
        DotManager.removeDot(this.btn);
        let cfg:Configs.t_Cover_Big_Goose_Task_dat = this.dataSource;
        this.cfg = cfg;
        this.nameLb.text = cfg.f_des;

        let tasks = TaoDaeModel.Ins.tasks;
        let vo:stCoverBigGooseTask = tasks.find(o=>o.id == cfg.f_id);
        if(vo){
            
            //==========================================================
            let datalist:TaodaeTaskItemSlotVo[] = [];

            let itemList = ItemViewFactory.convertItemList(cfg.f_reward);
            for(let i = 0;i < itemList.length;i++){
                let cell = new TaodaeTaskItemSlotVo();
                cell.itemVo = itemList[i];
                cell.status = vo.status;
                datalist.push(cell);
            }
            ItemViewFactory.renderItemSlots(this.rewardcon,datalist,undefined,undefined,0.9,"left",TaodaeTaskItemSlot);
            //==========================================================

            this.cntLb.text = `${vo.val}/${cfg.f_task_amount}`;
            this.moneyLb.text = E.getLang("lingQu");
            this.img0.visible = false;
            this.btnCtl.visible = false;
            this.progressBg.visible = false;
            let p = vo.val/cfg.f_task_amount;
            this.progressImg.width = this.initProgressImgW * (Math.min(p,1));
            /*领取状态 0不可领取 1可领取 2已领取*/
            switch(vo.status){
                case ETaodaeLingQu.NotGet:
                    this.img0.visible = true;
                    this.img0.skin = `remote/base/tx_wdc.png`;
                    this.progressBg.visible = true;
                    break;
                case ETaodaeLingQu.CanGet:
                    DotManager.addDot(this.btn);
                    this.btnCtl.visible = true;
                    this.progressBg.visible = true;
                    break;
                case ETaodaeLingQu.IsGet:
                    this.img0.visible = true;
                    this.img0.skin = `remote/base/tx_ylq.png`;
                    break;
            }
        }
    }
}
