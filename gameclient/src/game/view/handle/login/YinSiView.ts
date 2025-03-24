import { InitConfig } from "../../../../InitConfig";
import { LoadUtil } from "../../../../frame/util/LoadUtil";
import { RowMoveBaseNode, ScrollPanelControl } from "../../../../frame/view/ScrollPanelControl";
// import { TabControl } from "../../../../frame/view/TabControl";
import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { t_Platform } from "../main/proxy/t_Platform";
// import { DebugUtil } from "../../../../frame/util/DebugUtil";
import { E } from "../../../G";

export let TxtSkinKey:string = "TxtNode";

export class TxtNode extends RowMoveBaseNode{
    protected clsKey:string = TxtSkinKey;

    protected createNode (index){
        let _skin: ui.views.login.ui_yingsi_txtUI = Laya.Pool.getItemByClass(this.clsKey, ui.views.login.ui_yingsi_txtUI);
        let vo = this.list[index];
        _skin.lab.text = vo;
        DebugUtil.draw(_skin,"#ff0000",_skin.width,_skin.lab.textField.height);
        _skin.y = this.y;
        return _skin;
    }
}
export function getAgeTxtHeight(str:string){
    let sign = TxtSkinKey;
    let _skin: ui.views.login.ui_yingsi_txtUI = Laya.Pool.getItemByClass(sign, ui.views.login.ui_yingsi_txtUI);
    _skin.lab.text = str;
    Laya.Pool.recover(sign,_skin);
    return _skin.lab.textField.height;
}
export class YinSiView extends ViewBase{
    private _panelCtl: ScrollPanelControl;// 

    private _ui:ui.views.login.ui_yingsiUI;
    protected checkGuide:boolean = false;
    protected mMask = true; 
    protected autoFree = true;
    private tabsCtl:TabControl;// = new TabControl();
    private tabList: any;
    private randomVal:number;
    
    protected onAddLoadRes() {
        this.addAtlas('shezhi.atlas');
    }

    protected onFirstInit(){
        if(!this.UI){
            this.randomVal = Math.random();
            this.UI = this._ui = new ui.views.login.ui_yingsiUI;
            this.bindClose(this._ui.close1);

            this._panelCtl = new ScrollPanelControl();
            this._panelCtl.init(this._ui.panel);
            this._ui.lab.text = "";

            const tabsSkin = [this._ui.tab1,this._ui.tab2];
            this.tabList = E.getLang("yinsiTab").split("-");
            this.tabsCtl = new TabControl();
            this.tabsCtl.init(tabsSkin, new Laya.Handler(this,this.onTabSelectHandler), new Laya.Handler(this, this.itemTabHandler));
        }
    }

    protected onInit() {
        this.tabsCtl.forceSelectIndex(0);
    }

    protected onExit() {
        this._panelCtl.clear();
    }
    private get asset(){
        return InitConfig.getAsset();
    }
    private get yhxyTxt(){
        return this.asset+`${this.argeePath}/yhxy.txt`+"?"+this.randomVal;
    }
    private get ysxyTxt(){
        return this.asset+`${this.argeePath}/ysxy.txt`+"?"+this.randomVal;
    }
    private get argeePath(){
        // if(E.sdk.isTap){
        //     return `o/yhxy/tap`;
        // }
        return t_Platform.Ins.f_agree;
    }
    private onTabSelectHandler(v:number){
        this._ui.panel.vScrollBar.stopScroll();
        this._ui.panel.scrollTo(0,0);
        switch(v){
            case 0:
                this._ui.lab_title.text = E.getLang("yinsi1");
                Laya.loader.load(this.yhxyTxt, Laya.Handler.create(this, this.onComplete), null, Laya.Loader.TEXT);
                break;
            case 1:
                this._ui.lab_title.text = E.getLang("yinsi2");
                Laya.loader.load(this.ysxyTxt, Laya.Handler.create(this, this.onComplete1), null, Laya.Loader.TEXT);
                break;
        }
    }

    private onComplete(){
        let l = LoadUtil.GetTxt(this.yhxyTxt).split("\n");
        this.renderTxtList(l);
    }

    private renderTxtList(l:string[]){
        this._panelCtl.clear();
        for(let i = 0;i < l.length;i++){
            let str = l[i];    
            this._panelCtl.split([str],TxtNode,getAgeTxtHeight(str));
        }
        this._panelCtl.end();
    }

    private onComplete1(){
        let l = LoadUtil.GetTxt(this.ysxyTxt).split("\n");
        this.renderTxtList(l);
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
}