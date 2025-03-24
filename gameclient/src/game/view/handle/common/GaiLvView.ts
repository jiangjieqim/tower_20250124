import { RowMoveBaseNode, ScrollPanelControl } from "../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../frame/view/ViewBase";
import { ui } from "../../../../ui/layaMaxUI";
import { IconUtils } from "../main/model/IconUtils";
import { ItemProxy } from "../main/proxy/ItemProxy";

class GaiLvItemNode extends RowMoveBaseNode{
    protected clsKey:string = "GaiLvItemNode";
    protected createNode (index){
        let _skin:ui.views.common.ui_gailvItemUI = Laya.Pool.getItemByClass(this.clsKey,ui.views.common.ui_gailvItemUI);
        _skin.img.skin = `remote/base/gl${this.list[index]}.png`;
        _skin.y = this.y;
        return _skin;
    }
}

class GaiLvItemNode1 extends RowMoveBaseNode{
    protected clsKey:string = "GaiLvItemNode1";
    protected createNode (index){
        let _skin:ui.views.common.ui_gailvItem2UI = Laya.Pool.getItemByClass(this.clsKey,ui.views.common.ui_gailvItem2UI);
        let arr = this.list[index].split("-");
        let id = parseInt(arr[0]);
        _skin.icon.skin = IconUtils.getIconByCfgId(id);
        _skin.lab.text = IconUtils.getNameByID(id) + "x" + arr[1];
        let num = parseInt(arr[2]) / 100;
        _skin.lab1.text = num.toFixed(2) + "%";
        _skin.y = this.y;
        return _skin;
    }
}

export class GaiLvView extends ViewBase{
    private _ui:ui.views.common.ui_gailvViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private _panelCtl: ScrollPanelControl;

    protected onAddLoadRes(): void {
        
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.common.ui_gailvViewUI();
            this.bindClose(this._ui.btn_close);

            this._panelCtl = new ScrollPanelControl();
            this._panelCtl.init(this._ui.panel);
        }
    }

    protected onInit(): void {
        let arr = this.getList(this.Data);
        let array = [];
        for(let i:number=arr.length - 1;i>=0;i--){
            let vo:any = {};
            vo.type = 1;
            vo.data = arr[i].f_qua;
            array.push(vo);
            let voo:any = {};
            voo.type = 2;
            voo.data = arr[i].data.split("|");
            array.push(voo);
        }
        this._panelCtl.clear();
        for(let i = 0;i < array.length;i++){
            if(array[i].type == 1){
                this._panelCtl.split([array[i].data],GaiLvItemNode,65);
            }else if(array[i].type == 2){
                this._panelCtl.split(array[i].data,GaiLvItemNode1,65);
            }
        }
        this._panelCtl.end();
    }

    protected onExit(): void {
        
    }

    private getList(arr){
        let array = [];
        for(let i:number=0;i<arr.length;i++){
            let id:number = parseInt(arr[i].split("-")[0]);
            let cfg:Configs.t_Item_dat = ItemProxy.Ins.getCfg(id);
            let index = array.findIndex(ele => ele.f_qua == cfg.f_qua);
            if (index != -1) {
                array[index].data = array[index].data + "|" + arr[i];
            } else {
                let obj: any = {};
                obj.f_qua = cfg.f_qua;
                obj.data = arr[i];
                array.push(obj);
            }
        }
        array.sort(this.onSort);
        return array;
    }

    private onSort(a,b){
        return a.f_qua - b.f_qua;
    }
}