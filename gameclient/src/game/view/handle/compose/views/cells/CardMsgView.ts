import { ViewBase } from "../../../../../../frame/view/ViewBase";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../../common/defines/EnumDefine";
import { ComposeModel } from "../../ComposeModel";
import { CardCellMsg } from "./CardCellMsg";

export class CardMsgView extends ViewBase{
    protected mShowUpdate:boolean = true;
    private _ui:ui.views.compose.ui_msg_viewUI;
    private readonly maxCount:number = 3;
    private container:Laya.Sprite;
    PageType: EPageType = EPageType.None;
    private model:ComposeModel;
    private curIndex:number= 0;
    private cellHeight:number;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.curIndex = 0;
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.model = ComposeModel.Ins;
            /*
            this.UI = this._ui = new Laya.View();
            this.UI.width = ScreenAdapter.UIRefWidth;
            this.UI.height = ScreenAdapter.DefaultHeight;

            this.container = new Laya.Sprite();
            this.container.y = 100;
            this._ui.addChild(this.container);
            // if(debug){
            //     this._ui.graphics.drawRect(0,0,100,100,null,"#ff0000",2);
            // }
            */
            this.UI = this._ui = new ui.views.compose.ui_msg_viewUI();
            this.cellHeight = Laya.Pool.getItemByClass(CardCellMsg.CLS_KEY, CardCellMsg).height;
            this.container = this._ui.con1;

            this._ui.mouseThrough = true;

        }
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");
        this.addCell();
    }

    layoutView(){
        this.addCell();
    }

    private onSortHandler(a:CardCellMsg,b:CardCellMsg){
        if(a.curIndex > b.curIndex){
            return -1;
        }
        else if(a.curIndex < b.curIndex){
            return 1;
        }
        return 0;
    }

    private addCell() {
        let _count: number = this.container.numChildren;

        if (_count >= this.maxCount) {

        } else {

            if (this.model.msgList.length > 0) {
                let vo = this.model.msgList.shift();
                if(vo.isShow){
                    let cell: CardCellMsg = Laya.Pool.getItemByClass(CardCellMsg.CLS_KEY, CardCellMsg);
                    cell.view = this;
                    cell.curIndex = this.curIndex;
                    this.curIndex++;
                    cell.setData(vo);
                    //cell.y = (this.maxCount - 1) * CardCellMsg.CellH;//(this.maxCount - _count) * CardCellMsg.CellH;    this.container.numChildren
                    this.container.addChild(cell);
                }else{
                    LogSys.Warn(`卡牌${vo.cardId}的f_card_broadcast值为空`);
                }
            }
        }
        let curList: CardCellMsg[] = [];
        for(let i = 0;i < this.container.numChildren;i++){
            let cell = this.container.getChildAt(i) as CardCellMsg;
            //     cell.y = i * CardCellMsg.CellH;
            curList.push(cell);
        }
        curList = curList.sort(this.onSortHandler);

        for(let i = 0;i < curList.length;i++){
            let cell = curList[i];
            cell.y = (this.maxCount - i) * this.cellHeight;
        }
    }
}