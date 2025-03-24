import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { EBattle_Config, t_Battle_Config } from "../t_Battle_Config";
import { FightValueConfig } from "../vos/FightValueConfig";
import { CardMoveVo, FuncCardVo } from "../vos/FuncCardVo";
import { FuncCardCellView } from "./cells/FuncCardCellView";
import { FuncCardView2 } from "./FuncCardView2";

export class FuncCardCtl{
    private model:ComposeModel;
    view:FuncCardView2;
    /**卡牌最多的数量 */
    private maxShowCardCount:number;
    private readonly rot:number = 9;
    private readonly startRot:number = -18;
    con1:Laya.Sprite;

    constructor(){
        this.model = ComposeModel.Ins;
        this.maxShowCardCount = parseInt(t_Battle_Config.Ins.getValueById(EBattle_Config.PVE_MAX_CARD));
        LogSys.Log(this.maxShowCardCount);
    }
    onInit(){
        this.model.on(ComposeEvent.UpdateCards,this,this.onRefresh);
        this.model.on(ComposeEvent.AddCard,this,this.onAddCard);
        this.onRefresh();
    }
    /**添加牌 */
    private onAddCard(vo:FuncCardVo){
        let n = this.con1.numChildren;
        let cell = this.createCell(vo);
        cell.timeCheckCd();
        cell.displayAniCon = false;
        FightFactory.createPveShowCard(vo.cfg.f_cardid,cell,cell.width/2,cell.height/2 - 5,new Laya.Handler(this,this.onAnimEnd,[cell]));
        cell.rotation = this.startRot + this.rot * n;
        cell.updateSort();
        this.view.updateCardCount();
    }
    private onAnimEnd(cell:FuncCardCellView){
        cell.displayAniCon = true;
    }
    private onRefresh(){
        this.clearCards();
        let cur:number = 0;
        this.model.cardList.sort((a:FuncCardVo,b:FuncCardVo)=>{
            if(a.sortNum < b.sortNum){
                return -1;
            }else if(a.sortNum > b.sortNum){
                return 1;
            }
            return 0;
        })
        for (let i =0 ; i < this.maxShowCardCount; i++) {
            let vo = this.model.cardList[i];
            if (vo) {
                let cell = this.createCell(vo);
                cell.rotation = this.startRot + this.rot * cur;
                // cell.vo.sortNum = cell.rotation;
                cell.updateSort();
                cur++;
            }
        }
        this.view.updateCardCount();
    }
    private createCell(vo:FuncCardVo,index:number=-1):FuncCardCellView{
        let cell = Laya.Pool.getItemByClass(FuncCardCellView.CLS_KEY, FuncCardCellView);
        cell.cardCtl = this;
        cell.setData(vo);
        cell.x = 0;
        cell.y = 0;
        if(index == -1){
            this.con1.addChild(cell);
        }else{
            if(index > this.con1.numChildren-1){
                index = this.con1.numChildren-1;
                if(index < 0){
                    index = 0;
                }
            }
            this.con1.addChildAt(cell,index);
        }
        return cell;
    }

    onExit(){
        this.clearCards();
        this.model.off(ComposeEvent.UpdateCards,this,this.onRefresh);
        this.model.off(ComposeEvent.AddCard,this,this.onAddCard);
    }

    private clearCards(){
        while(this.con1.numChildren){
            let cell = this.con1.getChildAt(0) as FuncCardCellView;
            cell.dispose();
        }
    }
    onSelectHandler(item:FuncCardCellView){

        let selitem:FuncCardCellView;

        for(let i = 0;i < this.con1.numChildren;i++){
            let cell:FuncCardCellView = this.con1.getChildAt(i) as any;
            if(cell == item){
                // cell.pieSelect = true;
                selitem = cell;
            }else{
                cell.pieSelect = false;
            }
        }

        if(selitem){
            selitem.pieSelect = true;
        }
    }

    onMoveCard(moveVo: CardMoveVo){
        for(let i = 0;i < this.con1.numChildren;i++){
            let cell:FuncCardCellView = this.con1.getChildAt(i) as any;
            cell.pieSelect = false;
            if(cell.vo.data.serialNum == moveVo.uid){
                cell.flyAndDel();
                Laya.timer.once(FightValueConfig.cardFlyTime * 2,this,this.onDelEnd,[cell.rotation,i]);
            }
        }
    }

    private onDelEnd(rot:number,index:number){
        let uids:number[]=[];
        for(let i = 0;i < this.con1.numChildren;i++){
            let cell:FuncCardCellView = this.con1.getChildAt(i) as any;
            uids.push(cell.vo.data.serialNum);
        }
        let _l = this.model.cardList;
        let notFind:boolean = true;
        for(let i = 0;i < _l.length;i++){
            let vo = _l[i];
            if(uids.indexOf(vo.data.serialNum)==-1){
                //构建一个卡牌
                let cell = this.createCell(vo,index);
                cell.rotation = rot;
                // cell.vo.sortNum = cell.rotation;
                cell.updateSort();
                cell.alphaShow();
                notFind = false;
                break;
            }
        }

        if(notFind){
            //没有新的牌了 重新排序移动卡牌
            for(let i = 0;i < this.con1.numChildren;i++){
                let cell:FuncCardCellView = this.con1.getChildAt(i) as any;
                cell.rotation = this.startRot + this.rot * i;
                // cell.vo.sortNum = cell.rotation;
                cell.updateSort();
            }
        }
        // LogSys.Error('not found!');
    }
}