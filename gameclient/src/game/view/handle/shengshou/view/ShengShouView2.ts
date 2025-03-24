import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { HolyBeastLog_req, stHolyBeastLogDetail } from "../../../../network/protocols/BaseProto";
import { QualitycolorProxy } from "../../common/CommonProxy";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ShengShouModel } from "../model/ShengShouModel";
import { t_HolyBeast_Draw_Rate } from "../proxy/t_HolyBeast_Draw_Rate";
import { t_HolyBeast_Resource } from "../proxy/t_HolyBeast_Resource";

export class ShengShouView2 extends ViewBase{
    private _ui:ui.views.shengshou.ui_shengShouView2UI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
        this.addAtlas('shengshou.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shengshou.ui_shengShouView2UI();
            this.bindClose(this._ui.btn_close);

            let cfg = t_HolyBeast_Resource.Ins.getCfgById(ShengShouModel.Ins.actID);
            this._ui.titleHero.name = cfg.f_hero_id;

            this._ui.list.itemRender = ui.views.shengshou.ui_shengShouItem2UI;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onRenderHandler(item:ui.views.shengshou.ui_shengShouItem2UI){
        item.lab.text = TimeUtil.timestamtoTime1(item.dataSource.time,"/"," ",":",false);
        let cfg = t_HolyBeast_Draw_Rate.Ins.GetDataById(item.dataSource.drawId);
        let vo = ItemViewFactory.convertItem(cfg.f_reward);
        item.lab2.text = vo.getName() + "x" + vo.count;
        item.lab2.color = "#" + QualitycolorProxy.Ins.getCfgByQua(vo.cfg.f_qua).f_color;
        item.lab2.strokeColor = "#" + QualitycolorProxy.Ins.getCfgByQua(vo.cfg.f_qua).f_outline;
    }

    protected onInit(): void {
        ShengShouModel.Ins.on(ShengShouModel.UPDATE_LOG,this,this.updateLog);
        let req = new HolyBeastLog_req;
        req.flag = 0;
        req.activityId = ShengShouModel.Ins.actID;
        req.serialNum = 0;
        SocketMgr.Ins.SendMessageBin(req);
    }

    protected onExit(): void {
        ShengShouModel.Ins.off(ShengShouModel.UPDATE_LOG,this,this.updateLog);
    }

    private updateLog(){
        ShengShouModel.Ins.logMyList.sort(this.onSort);
        this._ui.list.array = ShengShouModel.Ins.logMyList;
    }

    private onSort(a:stHolyBeastLogDetail,b:stHolyBeastLogDetail){
        return b.serialNum - a.serialNum;
    }
}