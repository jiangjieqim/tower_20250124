import { CheckBox2Ctl } from "../../../../../frame/util/ctl/CheckBox2Ctl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { FunctionModel } from "../../funs/FunctionModel";
import { MainIconProxy } from "../../funs/proxy/FunctionProxy";
import { ERedEnum } from "../../main/model/ERedEnum";
import { MainModel } from "../../main/model/MainModel";
import { ISaveData, RedUpdateUtils } from "../../main/model/RedUpdateModel";
import { SheZhiItem } from "./SheZhiItem";
export class SheZhiView extends ViewBase{
    private _ui: ui.views.shezhi.ui_shezhiViewUI;
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _checkCtl1:CheckBox2Ctl;
    private _checkCtl2:CheckBox2Ctl;

    protected onAddLoadRes() {
        this.addAtlas('shezhi.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shezhi.ui_shezhiViewUI();
            this.bindClose(this._ui.btn_close);

            this._ui.list.itemRender = SheZhiItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);

            this._checkCtl1 = new CheckBox2Ctl(this._ui.tab1);
            this._checkCtl1.selectHander = new Laya.Handler(this,this.onSelectHandler1);


            this._checkCtl2 = new CheckBox2Ctl(this._ui.tab2);
            this._checkCtl2.selectHander = new Laya.Handler(this,this.onSelectHandler2);
        }
    }

    private onSelectHandler1(){
        if(this._checkCtl1.selected){
            E.AudioMgr.SetMusicMute(false);
        }else{
            E.AudioMgr.SetMusicMute(true);
        }
        this.updateConfig();
    }

    private onSelectHandler2(){
        if(this._checkCtl2.selected){
            E.AudioMgr.SetSoundMute(false);
        }else{
            E.AudioMgr.SetSoundMute(true);
        }
        this.updateConfig();
    }

    private onRenderHandler(item:SheZhiItem){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        this.initConfig();

        let array = [];
        let arr = MainIconProxy.Ins.List;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].f_pos == 4 && FunctionModel.Ins.isOpenByFuncId(arr[i].f_funid)) {
                array.push(arr[i]);
            }
        }
        array.sort(this.onSort);
        this._ui.list.array = array;
        let num = Math.ceil(array.length / this._ui.list.repeatX);
        this._ui.list.height = (104 + this._ui.list.spaceY) * num - this._ui.list.spaceY;
        this._ui.bg.height = this._ui.list.height + 250;
        this._ui.bg1.height = this._ui.list.height + 190;
        this._ui.bg2.height = this._ui.list.height + 40;
        this._ui.height = this._ui.bg.height + 50;
    }

    private onSort(a:Configs.t_MainIcon_dat,b:Configs.t_MainIcon_dat){
        return a.f_sort - b.f_sort;
    }

    protected onExit(): void {
        
    }

    private initConfig(){
        RedUpdateUtils.refreshByConfig(this._checkCtl1,ERedEnum.MUISC_BG,true);
        RedUpdateUtils.refreshByConfig(this._checkCtl2,ERedEnum.MUISC_EFFECT,true);
    }

    private updateConfig(){
        let l1:ISaveData[] = [];
        RedUpdateUtils.push(l1,ERedEnum.MUISC_BG,this._checkCtl1);
        RedUpdateUtils.push(l1,ERedEnum.MUISC_EFFECT,this._checkCtl2);
        MainModel.Ins.red.saveArr(l1);
    }

}