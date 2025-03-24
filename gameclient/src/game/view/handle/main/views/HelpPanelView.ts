import { IScrollNodeView, RowMoveBaseNode } from "../../../../../frame/view/ScrollPanelControl";
import { TriangleScrollPanelControl } from "../../../../../frame/view/TriangleScrollPanelControl";
import { E } from "../../../../G";
import { ZipJson } from "../../../../static/ZipJson";
import { IHelpViewData } from "../interface/Interface";
import { HelpView } from "./HelpView";

export class LabelItemRender extends Laya.Label implements IScrollNodeView{
    public clsKey:string;
    constructor(){
        super();
    }
    public get txtHeight(){
        return this.textField.displayHeight;
    }
}

class TxtNodeShow extends RowMoveBaseNode{
    protected clsKey = HelpPanelView.LabelKey;

    protected createNode(index: number) {
        let tempCell = this.list[index];
        tempCell.y = this.y;
        return tempCell;
    }
}

export class HelpPanelView extends HelpView{
    public static LabelKey:string = "TxtNodeShow";
    public static CreateLabel(){
        let clsKey = this.LabelKey;
        let tempCell:LabelItemRender = Laya.Pool.getItemByClass(clsKey,LabelItemRender);
        tempCell.clsKey = clsKey;
        tempCell.fontSize = 24;
        tempCell.font = E.sdk.convertFont(ZipJson.BOLD);
        tempCell.width = 490;
        tempCell.color = "#ffffff";
        tempCell.strokeColor = "#832500";
        tempCell.align = "left";
        tempCell.wordWrap = true;
        // tempCell.text = this.list[index];
        // tempCell.y = this.y;
        return tempCell;
    }

    public static FreeLabel(cell){
        Laya.Pool.recover(this.LabelKey,cell);
    }
    private scrollCtl:TriangleScrollPanelControl;
    protected onInit(){
        let _data:IHelpViewData = this.Data;
        
        // if(!this.scrollCtl){
            this.scrollCtl = new TriangleScrollPanelControl();
            this.scrollCtl.init(this._ui.showPanel);
            this.scrollCtl.setTriangleIcon(this._ui.downIcon);
        // this._ui.showPanel.vScrollBarSkin=`comp/vslider.png`;// `comp/vscroll.png`;
        // this._ui.showPanel.vScrollBar.autoHide = true;
        // this._ui.showPanel.vScrollBar.showButtons = false;
        // this._ui.showPanel.vScrollBar.sizeGrid = '1;1;1;1;';
        // }

        let _labelCell = HelpPanelView.CreateLabel();
        _labelCell.text = _data.desc;
        // console.log(">>>",(_labelCell.txtHeight-this._ui.showPanel.height));
        // MainModel.FreeLabel(label);

        this._ui.tf1.text = _data.title;
        this._ui.desc.removeSelf();

        this.scrollCtl.clear();
        this.scrollCtl.setData(_labelCell,TxtNodeShow,_labelCell.txtHeight);
        this.scrollCtl.end();

        // console.log(":",this._ui.showPanel.height);
    }
}