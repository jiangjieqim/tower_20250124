import { stHero } from "../../../../network/protocols/BaseProto";
import { ComposeModel } from "../ComposeModel";
import { RedHeroHeadCell } from "./cells/RedHeroHeadCell";

export class RedHeadContainer {
    container:Laya.Sprite;
    private offsetX:number = 0;
    private offsetY:number = 0;
    /**最多显示的神话可召唤的数量 */
    private readonly maxHeroCount:number = 3;
    // private redCount:number = 0;
    private model:ComposeModel;
    private _cellList:RedHeroHeadCell[] = [];
    constructor(){
        this.model = ComposeModel.Ins;
    }
    // clear(){
    // }

    exit(){
        while(this._cellList.length){
            let cell = this._cellList.shift();
            cell.dispose();
        }
    }


    pos(x:number,y:number){
        this.offsetX = x;
        this.offsetY = y;
    }

    updateView(){

        let mythos = this.model.canGetMythos();
        //==================================================================
        for(let i=0;i < this._cellList.length;i++){
            // this._cellList[i].visible = false;
            this._cellList[i].mShow = false;
        }
        let curIndex:number = 0;
        if(this.model.curAdapter.bMythosShow){
            for(let i = 0;i < mythos.length;i++){
                if(curIndex <= this.maxHeroCount){
                    let _heroVo:stHero = mythos[i];
                    let _cell:RedHeroHeadCell = this._cellList[i];//Laya.Pool.getItemByClass(RedHeroHeadCell.CLS_KEY,RedHeroHeadCell);
                    if(_cell){
                        _cell.updateView(_heroVo);
                        // _cell.visible = true;
                        _cell.mShow = true;
                        _cell.x = this.offsetX;
                        _cell.y = this.offsetY + _cell.height * curIndex;
                    }
                    // this._cellList.length;
                    // this.container.addChild(_cell);
                    // this._cellList.push(_cell);
                }
                curIndex++;
            }
        }
        for(let i=0;i < this._cellList.length;i++){
            this._cellList[i].updateVis();
        }
    }
    init(){
        for(let i = 0;i <this.maxHeroCount;i++){
            let _cell = Laya.Pool.getItemByClass(RedHeroHeadCell.CLS_KEY,RedHeroHeadCell);
            _cell.mShow = false;
            this.container.addChild(_cell);
            _cell.updateVis();
            this._cellList.push(_cell);
        }
    }
}