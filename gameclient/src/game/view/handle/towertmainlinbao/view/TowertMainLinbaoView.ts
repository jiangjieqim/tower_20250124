// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { RowMoveBaseNode, ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
import { ui } from "../../../../../ui/layaMaxUI";
import { E, ScreenAdapter } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { SimpleEffect } from "../../avatar/SimpleEffect";
import { IListData, QuickQua, SelectListCtl } from "../../main/ctl/SelectListCtl";
import { ValCtl } from "../../main/ctl/ValLisCtl";
import { ECellType } from "../../main/vos/ECellType";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { TowertMainLinbaoModel } from "../model/TowertMainLinbaoModel";
import { t_Treasure } from "../proxy/t_Treasure";
import { TowertMainLinbaoItem } from "./TowertMainLinbaoItem";
import { TowertMainLinbaoItem1 } from "./TowertMainLinbaoItem1";

class LinbaoLabelNode extends RowMoveBaseNode{
    protected clsKey:string = "linbaoLabelNode"; 
    protected createNode (index){
        let _skin:ui.views.linbao.ui_linbaoLabeUI = Laya.Pool.getItemByClass(this.clsKey,ui.views.linbao.ui_linbaoLabeUI);
        _skin.x = 180;
        _skin.y = this.y + 10;
        return _skin;
    }
}

class LinBaoItemNode extends RowMoveBaseNode {
    protected clsKey: string = "linBaoItemNode";
    protected createNode(index) {
        let _skin: TowertMainLinbaoItem = Laya.Pool.getItemByClass(this.clsKey, TowertMainLinbaoItem);
        _skin.setData(this.list[index]);
        _skin.x = index * _skin.width + (index * 3);
        _skin.y = this.y;
        return _skin;
    }
}

class LinBaoItemNode1 extends RowMoveBaseNode {
    protected clsKey: string = "linBaoItemNode1";
    protected createNode(index) {
        let _skin: TowertMainLinbaoItem1 = Laya.Pool.getItemByClass(this.clsKey, TowertMainLinbaoItem1);
        _skin.setData(this.list[index]);
        _skin.x = index * _skin.width + (index * 3);
        _skin.y = this.y + 10;
        return _skin;
    }
}

export class TowertMainLinbaoView extends ui.views.linbao.ui_linbaoViewUI{

    private selCtl: SelectListCtl;
    private _panelCtl: ScrollPanelControl;
    private _se:SimpleEffect;

    constructor(){
        super();   
    }

    createChildren(){
        Laya.loader.load([{ url: "res/atlas/remote/linbao.atlas", type: Laya.Loader.ATLAS }], new Laya.Handler(this, this.onInit));
    }
    private onInit(){
        super.createChildren();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);

        ValCtl.Create(this.money1.lab,this.money1.icon,ECellType.JINBI,this.money1.sp);
        ValCtl.Create(this.money2.lab,this.money2.icon,ECellType.SHUIJING,this.money2.sp);

        this._panelCtl = new ScrollPanelControl();
        this._panelCtl.init(this.panel);

        this.selCtl = new SelectListCtl();
        this.selCtl.dirBottom = true;
        this.selCtl.listcontainerOffX = 13;
        this.selCtl.listcontainerOffHeight = 15;
        this.selCtl.init(this.sanjiao, this.listarea, this.listcontainer, this.listtf, ui.views.linbao.ui_linbaoSelectItemUI,
            this.getSelList(), "remote/linbao/btn_yq_s.png");
        this.selCtl.selectHandler = new Laya.Handler(this, this.onQuaSelHandler);

        ButtonCtl.Create(this.btn_cq,new Laya.Handler(this,this.onBtnCQClick))
    }

    private onBtnCQClick(){
        E.ViewMgr.Open(EViewType.LinBaoCQView);
    }

    private getSelList():IListData[]{
        let st = E.LangMgr.getLang("linbaoSelect");
        let arr: IListData[] = [];
        let l = st.split(";");
        for (let i = 0; i < l.length; i++) {
            let ss = l[i].split("-");
            let vo = new QuickQua();
            vo.f_id = parseInt(ss[0]);
            vo.color = "ffffff";
            vo.txt = ss[1];
            arr.push(vo);
        }
        return arr;
    }

    private onQuaSelHandler(){
        this.updateView(true);
    }

    protected onDisplay(): void {
        this.setUI();
        TowertMainLinbaoModel.Ins.on(TowertMainLinbaoModel.UPDATE_LINBAO,this,this.onUpdateView);
        TowerMainModel.Ins.on(TowerMainEvent.ValChange,this,this.onUpdateView);
        this.selCtl.selectIndex(0);
        this._se = new SimpleEffect(this.sp, `o/spine/succeed/treasure/treasure`,1,-1);
        this._se.play(0,true);
    }

    protected onUnDisplay(): void {
        TowertMainLinbaoModel.Ins.off(TowertMainLinbaoModel.UPDATE_LINBAO,this,this.onUpdateView);
        TowerMainModel.Ins.off(TowerMainEvent.ValChange,this,this.onUpdateView);
        this.selCtl.close();
        if(this._se){
            this._se.dispose();
            this._se = null;
        }
    }

    private onUpdateView(){
        Laya.timer.callLater(this,this.updateView);
    }

    private updateView(flag = false){
        let arr = this.getList();
        this._panelCtl.clear();
        for(let i = 0;i < arr.length;i++){
            if(arr[i].type == 1){
                this._panelCtl.split(arr[i].list,LinBaoItemNode,232,1,4);
            }else if(arr[i].type == 2){
                this._panelCtl.split([arr[i].type],LinbaoLabelNode,51);
            }else if(arr[i].type == 3){
                this._panelCtl.split(arr[i].list,LinBaoItemNode1,230,1,4);
            }
        }
        if(flag){
            this._panelCtl.end();
        }else{
            this._panelCtl.end(this._panelCtl.getScrollValue());
        }
    }

    private getList(){
        let list = t_Treasure.Ins.List;
        let arr = [];
        let arr1 = [];
        let arr2 = [];
        for(let i:number=0;i<list.length;i++){
            if(this.selCtl.selectVo.f_id == 0 || this.selCtl.selectVo.f_id == list[i].f_qua){
                let index = TowertMainLinbaoModel.Ins.linbaoList.findIndex(ele => ele.id === list[i].f_treasureid);
                if(index != -1){
                    arr1.push(list[i]);
                }else{
                    arr2.push(list[i]);
                }
            }
        }
        arr1.sort(this.onSort);
        arr2.sort(this.onSort);

        let vo: any = {};
        if(arr1.length == 0){
            vo = {};
            vo.type = 2;
            vo.list = [];
            arr.push(vo);
            vo = {};
            vo.type = 3;
            vo.list = arr2;
            arr.push(vo);
        }else{
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
        }
       
        this.lab1.text = TowertMainLinbaoModel.Ins.linbaoList.length + "/" + list.length;
        return arr;
    }

    private onSort(a:Configs.t_Treasure_dat,b:Configs.t_Treasure_dat){
        return b.f_qua - a.f_qua;
    }

    private _isSetUI:boolean;
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