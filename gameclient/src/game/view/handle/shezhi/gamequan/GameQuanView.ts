import { PlatformConfig } from "../../../../../InitConfig";
// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
// import { TabControl } from "../../../../../frame/view/TabControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SocketMgr } from "../../../../network/SocketMgr";
import { CommunityReward_req } from "../../../../network/protocols/BaseProto";
import { DotManager } from "../../common/DotManager";
import { MainEvent } from "../../main/model/MainEvent";
import { MainModel } from "../../main/model/MainModel";
import { WeiXinNormalStyle2 } from "../../main/views/icon/WeiXinPyqCtl2";
import { SheZhiModel } from "../model/SheZhiModel";
import { GameQuanItem1 } from "./GameQuanItem1";
import { t_Community } from "./t_Community";

export class GameQuanView extends ViewBase{
    private _ui:ui.views.shezhi.ui_gameQuanViewUI;
    protected mMask = true;
    protected mMainSnapshot = true;

    private tabsCtl:TabControl;
    private tabList: any;

    private pyq1: WeiXinNormalStyle2;

    protected onAddLoadRes() {
        this.addAtlas('shezhi.atlas');
    }

    protected onFirstInit() {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.shezhi.ui_gameQuanViewUI();
            this.bindClose(this._ui.btn_close);

            ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick));

            const tabsSkin = [this._ui.tab1,this._ui.tab2,this._ui.tab3];
            let st = E.getLang("shequTab");
            this.tabList = st.split("-");
            this.tabsCtl  = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this,this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));

            this._ui.list.itemRender = GameQuanItem1;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onBtnClick(){

    }

    private onRenderHandler(item:GameQuanItem1){
        item.setData(item.dataSource);
    }

    private onTabSelectHandler(v: number) {
        if(v == -1)return;
        switch (v) {
            case 0:
                this._ui.sp1.visible = true;
                this._ui.sp2.visible = false;
                this._ui.sp3.visible = false;
                break;
            case 1:
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = true;
                this._ui.sp3.visible = false;
                break;
            case 2:
                this._ui.sp1.visible = false;
                this._ui.sp2.visible = false;
                this._ui.sp3.visible = true;
                break;
        }
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.shezhi.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        if (sel) {
            skin.img.skin = "remote/shezhi/btn_s.png";
            skin.lab.color = "#fff7cc";
            skin.lab.strokeColor = "#ac2c00";
        } else {
            skin.img.skin = "remote/shezhi/btn_n.png";
            skin.lab.color = "#dfb9ac";
            skin.lab.strokeColor = "#703620";
        }
    }

    protected onShow(){
        super.onShow();
        if (this.pyq1) {
            this.pyq1.onVisible(true);
        } else {
            Laya.timer.once(100, this, () => {
                this.createPyq();
            });
        }
    }

    protected onInit(): void {
        MainModel.Ins.on(MainEvent.WxOnShow,this,this.onWxOnShow);
        SheZhiModel.Ins.on(SheZhiModel.GameClubUpdate,this,this.updateView);
        SheZhiModel.Ins.getGameClubData();
        this._ui.list.array = t_Community.Ins.List;
        this.tabsCtl.selectIndex = 0;

        let platform = E.get_SDK_platform();
        if(platform == PlatformConfig.Dev){
            platform = PlatformConfig.WeiXin;
        }
        this._ui.img.skin = "static/img_gzh_" + platform + ".jpg";
        this._ui.img1.skin = "static/img_wjq_" + platform + ".png";
    }

    protected onExit(): void {
        MainModel.Ins.off(MainEvent.WxOnShow,this,this.onWxOnShow);
        SheZhiModel.Ins.off(SheZhiModel.GameClubUpdate,this,this.updateView);
        this.tabsCtl.selectIndex = -1;
        if (this.pyq1) {
            this.pyq1.onVisible(false);
        }
    }

    private createPyq() {
        let pyq1: WeiXinNormalStyle2 = new WeiXinNormalStyle2();
        pyq1.setSkin(this._ui.btn);
        pyq1.onVisible(true);
        this.pyq1 = pyq1;
    }

    private onWxOnShow(){
        SheZhiModel.Ins.getGameClubData();
    }

    private updateView(){
        console.log(">>>>>>>>>>>>>>>>updateView")
        this._ui.list.refresh();

        if(SheZhiModel.Ins.isSQRedTipTab1()){
            DotManager.addDot(this._ui.tab1);
        }else{
            DotManager.removeDot(this._ui.tab1);
        }

        let array = [];
        let arr = t_Community.Ins.List;
        for(let i:number=0;i<arr.length;i++){
            let data = SheZhiModel.Ins.gameClubList.find(ele => ele.flag === arr[i].f_id);
            if(data.times == 0){
                let count = SheZhiModel.Ins.getGameCount(arr[i].f_type);
                if(count >= arr[i].f_times){
                    array.push(arr[i].f_id);
                }
            }
        }
        if(array.length){
            let req = new CommunityReward_req;
            req.flag = 0;
            req.ids = array;
            SocketMgr.Ins.SendMessageBin(req);
        }
    }
}