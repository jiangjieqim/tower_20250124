import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { ERedEnum } from "../../main/model/ERedEnum";
import { MainModel } from "../../main/model/MainModel";
import { ActivityModel } from "../ActivityModel";
import { SHZXItem } from "./SHZXItem";
import { t_Mythical_Choice } from "./t_Mythical_Choice";

export class SHZXView1 extends ViewBase{
    private _ui:ui.views.shenhuazixuan.ui_shzxView1UI;
    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes() {
        this.addAtlas('shenhuazixuan.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shenhuazixuan.ui_shzxView1UI();
            this.bindClose(this._ui.btn_close);
            this.btnList.push(
                ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick))
            )
            this._ui.list.itemRender = SHZXItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
            this._ui.list.selectEnable = true;
        }
    }

    private onRenderHandler(item:SHZXItem,index:number){
        item.setData(item.dataSource,index,this._ui.list.selectedIndex);
    }

    private onBtnClick(){
        let cfg = this._ui.list.selectedItem;
        if(cfg){
            MainModel.Ins.red.save(ERedEnum.SHENHUAZIXUAN,cfg.f_id);
            ActivityModel.Ins.event(ActivityModel.SHENHUAZIXUAN);
            this.Close();
        }else{
            E.ViewMgr.ShowMidError(E.getLang("zxsh"));
        }
    }

    protected onInit(): void {
        this._ui.list.array = t_Mythical_Choice.Ins.List;
        let fid = MainModel.Ins.red.getValByID(ERedEnum.SHENHUAZIXUAN);
        if (fid != undefined) {
            let index = t_Mythical_Choice.Ins.List.findIndex(ele=>ele.f_id == fid);
            this._ui.list.selectedIndex = index;
            this._ui.list.scrollTo(index);
        }
    }

    protected onExit(): void {
        
    }
}