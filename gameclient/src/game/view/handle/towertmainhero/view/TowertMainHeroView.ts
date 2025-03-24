// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { RowMoveBaseNode, ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
import { ui } from "../../../../../ui/layaMaxUI";
import { E, ScreenAdapter } from "../../../../G";
import { ValCtl } from "../../main/ctl/ValLisCtl";
import { MainModel } from "../../main/model/MainModel";
import { ECellType } from "../../main/vos/ECellType";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
// import { YinDaoModel } from "../../yindao/YinDaoModel";
import { TowertMainHeroModel } from "../model/TowertMainHeroModel";
import { HeroListProxy } from "../proxy/HeroProxy";
import { HeroItem } from "./item/HeroItem";
import { HeroItem1 } from "./item/HeroItem1";

class HeroLabelNode extends RowMoveBaseNode{
    protected clsKey:string = "HeroLabelItem";
    protected createNode (index){
        let _skin:ui.views.hero.ui_heroLabelUI = Laya.Pool.getItemByClass(this.clsKey,ui.views.hero.ui_heroLabelUI);
        _skin.x = 162;
        _skin.y = this.y + 10;
        return _skin;
    }
}

class HeroItemNode extends RowMoveBaseNode {
    protected clsKey: string = "HeroItemNode";
    protected createNode(index) {
        let _skin: HeroItem = Laya.Pool.getItemByClass(this.clsKey, HeroItem);
        _skin.setData(this.list[index]);
        _skin.x = index * _skin.width + (index * 13);
        _skin.y = this.y;
        return _skin;
    }
}

class HeroItemNode1 extends RowMoveBaseNode {
    protected clsKey: string = "HeroItemNode1";
    protected createNode(index) {
        let _skin: HeroItem1 = Laya.Pool.getItemByClass(this.clsKey, HeroItem1);
        _skin.setData(this.list[index]);
        _skin.x = index * _skin.width + (index * 13);
        _skin.y = this.y + 10;
        return _skin;
    }
}

export class TowertMainHeroView extends ui.views.hero.ui_heroViewUI{

    private _panelCtl: ScrollPanelControl;
    private _quaSelect:boolean;
    private _lvSelect:boolean;

    constructor(){
        super();
    }
    createChildren(){
        Laya.loader.load([{ url: "res/atlas/remote/hero.atlas", type: Laya.Loader.ATLAS }], new Laya.Handler(this, this.onInit));
    }

    private onInit(){
        super.createChildren();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);

        ValCtl.Create(this.money1.lab,this.money1.icon,ECellType.JINBI,this.money1.sp);
        ValCtl.Create(this.money2.lab,this.money2.icon,ECellType.SHUIJING,this.money2.sp);
        ValCtl.Create(this.money3.lab,this.money3.icon,ECellType.HERO_SP,this.money3.sp);
        ValCtl.Create(this.money4.lab,this.money4.icon,ECellType.SSJP,this.money4.sp,false);

        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
        ButtonCtl.Create(this.btn1,new Laya.Handler(this,this.onBtnClick1));

        this._panelCtl = new ScrollPanelControl();
        this._panelCtl.init(this.panel);

        this.img.rotation = this.img1.rotation = 180;
        this._quaSelect = this._lvSelect = false;
    }

    protected onDisplay(): void {
        this.setUI();
        TowertMainHeroModel.Ins.on(TowertMainHeroModel.UPDATE_HERO,this,this.onUpdateView);
        TowerMainModel.Ins.on(TowerMainEvent.ValChange,this,this.onUpdateView);
        // YinDaoModel.Ins.on(YinDaoModel.UPDATE_VIEW,this,this.setYinDao);
        // MainModel.Ins.on(TowerMainEvent.MainViewLayerChange,this,this.setYinDao);
        this.updateView(true);
        // this.setYinDao();
    }
    
    // private setYinDao(){
    //     Laya.timer.callLater(this,()=>{
    //         YinDaoModel.Ins.addYD(1000);
    //     })
    // }

    protected onUnDisplay(): void {
        TowertMainHeroModel.Ins.off(TowertMainHeroModel.UPDATE_HERO,this,this.onUpdateView);
        TowerMainModel.Ins.off(TowerMainEvent.ValChange,this,this.onUpdateView);
        // YinDaoModel.Ins.off(YinDaoModel.UPDATE_VIEW,this,this.setYinDao);
        // MainModel.Ins.off(TowerMainEvent.MainViewLayerChange,this,this.setYinDao);
        // YinDaoModel.Ins.removeYD();
    }

    private onUpdateView(){
        Laya.timer.callLater(this,this.updateView);
    }

    private onBtnClick(){
        if(this._quaSelect){
            this._quaSelect = false;
            this.img.rotation = 180;
        }else{
            this._quaSelect = true;
            this.img.rotation = 0;
        }
        this.updateView();
    }

    private onBtnClick1(){
        if(this._lvSelect){
            this._lvSelect = false;
            this.img1.rotation = 180;
        }else{
            this._lvSelect = true;
            this.img1.rotation = 0;
        }
        this.updateView();
    }

    private updateView(flag = false){
        let arr = this.getList();
        this._panelCtl.clear();
        for(let i = 0;i < arr.length;i++){
            if(arr[i].type == 1){
                this._panelCtl.split(arr[i].list,HeroItemNode,290,10,4);
            }else if(arr[i].type == 2){
                this._panelCtl.split([arr[i].type],HeroLabelNode,51);
            }else if(arr[i].type == 3){
                this._panelCtl.split(arr[i].list,HeroItemNode1,290,10,4);
            }
        }
        if(flag){
            this._panelCtl.end();
        }else{
            this._panelCtl.end(this._panelCtl.getScrollValue());
        }
        this.lab4.text = E.getLang("heroattr");
        this.lab5.text = (TowertMainHeroModel.Ins.getAttr() / 100).toFixed(1) + "%";
    }

    private getList(){
        let list = HeroListProxy.Ins.List;
        let arr = [];
        let arr1 = [];
        let arr2 = [];
        let num = 0;
        for(let i:number=0;i<list.length;i++){
            if(list[i].f_if_transform){
                continue;
            }
            num ++;
            let index = TowertMainHeroModel.Ins.heroList.findIndex(ele => ele.id === list[i].f_heroid);
            if(index != -1){
                arr1.push(list[i]);
            }else{
                arr2.push(list[i]);
            }
        }

        let array = [arr1,arr2];

        for(let i:number=0;i<array.length;i++){
            array[i].sort((a:Configs.t_Hero_dat,b:Configs.t_Hero_dat) =>{
                if(this._quaSelect){
                    if (a.f_qua < b.f_qua) {
                        return 1;
                    }else if (a.f_qua > b.f_qua) {
                        return -1;
                    }else{
                        let aa = TowertMainHeroModel.Ins.getHeroById(a.f_heroid);
                        let bb = TowertMainHeroModel.Ins.getHeroById(b.f_heroid);
                        let lva = 1;
                        let lvb = 1;
                        if(aa){
                            lva = aa.level;
                        }
                        if(bb){
                            lvb = bb.level;
                        }
                        if(this._lvSelect){
                            if (lva < lvb) {
                                return 1;
                            }else if (lva > lvb) {
                                return -1;
                            }else{
                                return 0;
                            }
                        }else{
                            if (lva < lvb) {
                                return -1;
                            }else if (lva > lvb) {
                                return 1;
                            }else{
                                return 0;
                            }
                        }
                    }
                }else{
                    if (a.f_qua < b.f_qua) {
                        return -1;
                    }else if (a.f_qua > b.f_qua) {
                        return 1;
                    }else{
                        let aa = TowertMainHeroModel.Ins.getHeroById(a.f_heroid);
                        let bb = TowertMainHeroModel.Ins.getHeroById(b.f_heroid);
                        let lva = 1;
                        let lvb = 1;
                        if(aa){
                            lva = aa.level;
                        }
                        if(bb){
                            lvb = bb.level;
                        }
                        if(this._lvSelect){
                            if (lva < lvb) {
                                return 1;
                            }else if (lva > lvb) {
                                return -1;
                            }else{
                                return 0;
                            }
                        }else{
                            if (lva < lvb) {
                                return -1;
                            }else if (lva > lvb) {
                                return 1;
                            }else{
                                return 0;
                            }
                        }
                    }
                }
            });
        }
        
        let vo: any = {};
        vo.type = 1;
        vo.list = arr1;
        arr.push(vo);
        if(arr2.length){
            vo = {};
            vo.type = 2;
            vo.list = [];
            arr.push(vo);
            vo = {};
            vo.type = 3;
            vo.list = arr2;
            arr.push(vo);
        }

        this.lab.text = TowertMainHeroModel.Ins.getHeroList().length + "/" + num;
        return arr;
    }

    private _isSetUI:boolean;
    private setUI(){
        if(!this._isSetUI){
            this._isSetUI = true;
            let yy = (Laya.stage.height - ScreenAdapter.DefaultHeight) / 2;
            if(yy > 0){
                this.height += yy;
                this.bg.height += yy + 6;
                this.bg1.height += yy + 6;
                this.panel.height += yy;
            }
        }
    }
}