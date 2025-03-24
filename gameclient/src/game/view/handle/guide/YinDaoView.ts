// import { ButtonCtl } from "../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { EViewType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { GuideModel } from "./GuideModel";

export class YinDaoView extends ViewBase {
    // public PageType: EPageType = EPageType.None;
    protected mHitFull:boolean = true;
    private model: GuideModel;
    private _ui: ui.views.compose.guide.YinDaoViewUI;
    protected mMask = true;
    protected mMaskClick = false;
    protected mMainSnapshot = true;
    protected checkGuide = false;
    // private _skipBtn:Laya.Sprite;
    protected onAddLoadRes() { }
    // private lb: Laya.Label;
    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.compose.guide.YinDaoViewUI();
            this._ui.on(Laya.Event.CLICK, this, this.onClick);

            //===============================
            // this.createSkipBtn();
            //===============================
        }
    }
 
    private onClick() {
        this.model.index++;
        // let index = this.guideIndex;
        // let taskArr = YinDaoTaskProxy.Ins.taskList[this.model.taskId];
        let needClose: boolean;
        let cfg: Configs.t_Tasks_Guide_dat = this.model.curCfg;
        // if (taskArr && taskArr.length > 0 && taskArr[index]) {
         if(cfg){
            if (cfg.f_isview) {
                this._ui.lab_name.text = cfg.f_info;
                let sname = cfg.f_audio;
                if (sname) {
                    E.AudioMgr.StopSound();
                    E.AudioMgr.PlaySound1(sname);
                }
            } else {
                needClose = true;
            }
        } else {
            needClose = true;
        }
        if (needClose) {
            this.Close();
        }
    }

    protected onInit(): void {
        this.model = this.Data;
        this.updataView();
    }

    protected onExit(): void {
        E.ViewMgr.Close(EViewType.GuideHitUView);
    }
    // protected SetCenter(): void {
    //     if (this.UI && !this.UI.destroyed && this.useSetCenet) {
    //         this.UI.anchorX = this.UI.anchorY = 0.5;
    //         this.UI.x = this.UI.width/2;
    //         this.UI.y = this.UI.height/2;
    //     }
    // }
    private get guideIndex() {
        return this.model.index;
    }
    private updataView() {
        // let taskArr = YinDaoTaskProxy.Ins.taskList[this.model.taskId];
        // let index = this.guideIndex;
        let cfg = this.model.curCfg;
        // if (taskArr && taskArr.length > 0 && taskArr[index]) {
        if(cfg){
            this._ui.lab_name.text = cfg.f_info;
            let sname = cfg.f_audio;
            if (sname) {
                E.AudioMgr.StopSound();
                E.AudioMgr.PlaySound1(sname);
            }
        }
    }
}
