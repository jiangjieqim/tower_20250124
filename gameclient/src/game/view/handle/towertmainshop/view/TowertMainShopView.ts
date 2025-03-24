import { ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
// import { TabControl } from "../../../../../frame/view/TabControl";
import { ui } from "../../../../../ui/layaMaxUI";
import { E, ScreenAdapter } from "../../../../G";
import { DotManager } from "../../common/DotManager";
import { ValCtl } from "../../main/ctl/ValLisCtl";
import { ECellType } from "../../main/vos/ECellType";
import { TowertMainShopModel } from "../model/TowertMainShopModel";
import { t_Shop } from "../proxy/t_Shop";
import { ShopNode1, ShopNode10, ShopNode2, ShopNode3, ShopNode4, ShopNode5, ShopNode6, ShopNode7, ShopNode8, ShopNode9 } from "./node/ShopNode";

export class TowertMainShopView extends ui.views.shop.ui_shopViewUI{
    private _panelCtl: ScrollPanelControl;

    private tabsCtl:TabControl;
    private tabList: any;
    private _isSetUI:boolean;

    constructor(){
        super();
    }

    createChildren(){
        Laya.loader.load([{ url: "res/atlas/remote/shop.atlas", type: Laya.Loader.ATLAS }], new Laya.Handler(this, this.onInit));
    }

    private onInit(){
        super.createChildren();

        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);

        this._isSetUI = false;

        ValCtl.Create(this.money1.lab,this.money1.icon,ECellType.JINBI,this.money1.sp);
        ValCtl.Create(this.money2.lab,this.money2.icon,ECellType.SHUIJING,this.money2.sp);
        ValCtl.Create(this.money3.lab,this.money3.icon,ECellType.XJ,this.money3.sp);
        ValCtl.Create(this.money4.lab,this.money4.icon,ECellType.SHOPID,this.money4.sp,false);

        this._panelCtl = new ScrollPanelControl();
        this._panelCtl.init(this.panel);

        const tabsSkin = [this.tab1, this.tab2,this.tab3,this.tab4];
        let st = E.getLang("shopTab");
        this.tabList = st.split("-");
        this.tabsCtl = new TabControl();
        this.tabsCtl.init(tabsSkin, new Laya.Handler(this, this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));
    }

    private onTabSelectHandler(v: number) {
        if(v == -1)return;
        this.updateView();
    }

    private itemTabHandler(tabSkin, index: number, sel: boolean, data){
        let skin: ui.views.shop.ui_tabUI = tabSkin;
        skin.lab.text = this.tabList[index];
        if (sel) {
            skin.img.visible = false;
            skin.img1.visible = true;
            skin.lab.color = "#ffffff";
            skin.lab.strokeColor = "#9f3501";
        } else {
            skin.img.visible = true;
            skin.img1.visible = false;
            skin.lab.color = "#af685b";
            skin.lab.strokeColor = "#531309";
        }
    }

    protected onDisplay(): void {
        this.setUI();
        TowertMainShopModel.Ins.on(TowertMainShopModel.UPDATE_DOUBLE,this,this.onUpdateView);
        TowertMainShopModel.Ins.on(TowertMainShopModel.UPDATE_SHOP,this,this.onUpdateView);
        if(TowertMainShopModel.Ins.selectId){
            switch(TowertMainShopModel.Ins.selectId){
                case ECellType.JINBI:
                case ECellType.SHUIJING:
                    this.tabsCtl.selectIndex = 1;
                    break;
                case ECellType.HERO_SP:
                    this.tabsCtl.selectIndex = 0;
                    break;
                case ECellType.XJ:
                    this.tabsCtl.selectIndex = 3;
                    break;
            }
        }else{
            this.tabsCtl.selectIndex = 0;
        }
        this.updateRedTip();
    }

    protected onUnDisplay(): void {
        TowertMainShopModel.Ins.off(TowertMainShopModel.UPDATE_DOUBLE,this,this.onUpdateView);
        TowertMainShopModel.Ins.off(TowertMainShopModel.UPDATE_SHOP,this,this.onUpdateView);
        this.tabsCtl.selectIndex = -1;
    }

    private updateRedTip(){
        if(TowertMainShopModel.Ins.isRedTip(1)){
            DotManager.addDot(this.tab1);
        }else{
            DotManager.removeDot(this.tab1);
        }
        if(TowertMainShopModel.Ins.isRedTip(2)){
            DotManager.addDot(this.tab2);
        }else{
            DotManager.removeDot(this.tab2);
        }
        if(TowertMainShopModel.Ins.isRedTip(3)){
            DotManager.addDot(this.tab3);
        }else{
            DotManager.removeDot(this.tab3);
        }
    }

    private onUpdateView(){
        this.updateView(true);
        this.updateRedTip();
    }

    private updateView(flag:boolean = false){
        let arr = this.getList();
        this._panelCtl.clear();
        for(let i = 0;i<arr.length ;i++){
            if(arr[i].type == 1){
                this._panelCtl.split(arr[i].list,ShopNode1,285);
            }else {
                if(arr[i].data){
                    if(arr[i].type != 5){
                        this._panelCtl.split([arr[i].data],ShopNode7,103);
                    }else{
                        this._panelCtl.split([arr[i].data],ShopNode8,210);
                    }
                }else{
                    switch(arr[i].type){
                        case 2:
                            this._panelCtl.split(arr[i].list,ShopNode2,247,0,3);
                            break;
                        case 3:
                        case 4:
                            this._panelCtl.split(arr[i].list, ShopNode3, 250, 0, 3);
                            break;
                        case 5:
                            this._panelCtl.split(arr[i].list, ShopNode4, 242, 0, 3);
                            break;
                        case 6:
                            this._panelCtl.split(arr[i].list, ShopNode5, 275, 0, 3);
                            break;
                        case 7:
                            this._panelCtl.split(arr[i].list, ShopNode6, 253, 0, 3);
                            break;
                        case 8:
                            this._panelCtl.split(arr[i].list, ShopNode9, 320, 0, 3);
                            break;
                        case 9:
                            this._panelCtl.split(arr[i].list, ShopNode10, 242, 0, 3);
                            break;
                    }
                }
            }
        }

        if(TowertMainShopModel.Ins.selectId){
            switch(TowertMainShopModel.Ins.selectId){
                case ECellType.JINBI:
                    this._panelCtl.endLast();
                    break;
                case ECellType.SHUIJING:
                    this._panelCtl.endIndex(3);
                    break;
                case ECellType.HERO_SP:
                    this._panelCtl.endLast();
                    break;
                case ECellType.XJ:
                    this._panelCtl.end();
                    break;
            }
            TowertMainShopModel.Ins.selectId = 0;
        }else{
            if(flag){
                this._panelCtl.end(this._panelCtl.getScrollValue());
            }else{
                this._panelCtl.end();
            }
        }
    }

    private getList() {
        let fzmap = {};
        let array = [];
        let arr = t_Shop.Ins.getListByPage(this.tabsCtl.selectIndex + 1);
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_hide){
                continue;
            }
            if(TowertMainShopModel.Ins.hideIdList.indexOf(arr[i].f_id) != -1){
                continue;
            }

            if(arr[i].f_type == 1){
                let vo = TowertMainShopModel.Ins.shopList.find(ele=>ele.id == arr[i].f_id);
                if(vo && vo.cnt >= arr[i].f_limit_times){
                    continue;
                }
            }

            if(!fzmap[arr[i].f_type]){
                fzmap[arr[i].f_type] = [];
            }
            fzmap[arr[i].f_type].push(arr[i]);
        }

        for (let ele in fzmap){
            let vo:any = {};
            if(parseInt(ele) == 1){
                vo.type = 1;
                vo.data = "";
                vo.list = fzmap[ele];
                array.push(vo);
            }else{
                vo.type = parseInt(ele);
                vo.data = fzmap[ele][0];
                vo.list = [];
                array.push(vo);
                let voo:any = {};
                voo.type = parseInt(ele);
                voo.data = "";
                voo.list = fzmap[ele];
                array.push(voo);
            }
        }

        return array;
    }

    private setUI(){
        if(!this._isSetUI){
            this._isSetUI = true;
            let yy = (Laya.stage.height - ScreenAdapter.DefaultHeight) / 2;
            if(yy > 0){
                this.height += yy;
                this.bg.height += yy + 6;
                this.panel.height += yy;
            }
        }
    }
}