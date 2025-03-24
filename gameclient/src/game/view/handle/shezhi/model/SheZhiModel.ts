import { E } from "../../../../G";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { stCommonTimes, stNotice } from "../../../../network/protocols/BaseProto";
import { NoticePopTipSelVo, PopNoticeVo } from "../view/NoticePopView";

export class SheZhiModel extends Laya.EventDispatcher{
    private static _ins: SheZhiModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new SheZhiModel();
        }
        return this._ins;
    } 

    public localNoticeList:stNotice[] = [];
    public noticeSel:NoticePopTipSelVo = new NoticePopTipSelVo();

    public static UPDATE_DATA_YAOQING:string = "UPDATE_DATA_YAOQING";
    public static UPDATE_DATA_YAOQINGTAP:string = "UPDATE_DATA_YAOQINGTAP";
    public static GameClubUpdate:string = "GameClubUpdate";

    public yqInvitedCnt:number;
    public yqCount:number;
    public yqList:stCommonTimes[];
    public yqDay:stCommonTimes;
    public binded:number;

    public gameClubList:stCommonTimes[];
    public gameClubData = { join: 0, like: 0, publish: 0 };

    constructor(){
        super();
    }

    public isYQRedTip(){
        if(this.isYQRedTipTab2()){
            return true;
        }
        return false;
    }

    public isYQRedTipTab2(){
        // if(!this.yqList)return false;
        // for(let i:number=0;i<this.yqList.length;i++){
        //     if(this.yqList[i].times == 1){
        //         return true;
        //     }
        // }
        return false;
    }

    public isSQRedTip(){
        if(this.isSQRedTipTab1()){
            return true;
        }
        return false;
    }

    public isSQRedTipTab1(){
        if(!this.gameClubList)return false;
        for(let i:number=0;i<this.gameClubList.length;i++){
            if(this.gameClubList[i].times == 1){
                return true;
            }
        }
        return false;
    }

    public getGameClubData() {
        // 游戏圈数据
        E.sdk.getGameClubData((res) => {
            if (res) {
                // 游戏圈授权成功
                const d = JSON.parse(res);
                const dataList = d?.data?.dataList;
                if (dataList && dataList.length) {
                    const m: Map<number, 'join' | 'like' | 'publish'> = new Map([
                        [1, 'join'], [4, 'like'], [5, 'publish'],
                    ]);
                    dataList.forEach((element, i) => {
                        const key = m.get(element.dataType.type);
                        this.gameClubData[key] = element.value;
                    });
                    this.event(SheZhiModel.GameClubUpdate);
                }
            } else {
                // 游戏圈授权异常
                this.event(SheZhiModel.GameClubUpdate);
            }
        });
    }

    public getGameCount(type:number){
        let count = 0;
        if(type == 1){
            if(SheZhiModel.Ins.gameClubData.join){
                count = 1;
            }
        }else if(type == 4){
            count = SheZhiModel.Ins.gameClubData.like;
        }else if(type == 5){
            count = SheZhiModel.Ins.gameClubData.publish;
        }
        return count;
    }

    /**内部公告 */
    public openPopNotice(cellList: stNotice[]) {
        if (cellList.length <= 0) {
            E.ViewMgr.ShowMidError("没有公告数据");
            return;
        }

        let result = new PopNoticeVo();
        result.dataList = cellList;
        result.noticeSel = this.noticeSel;
        E.ViewMgr.Open(EViewType.NoticePop, null, result);
    }

    /**开服公告 */
    public openServerNotice(title:string,content:string){
        let result = new PopNoticeVo();
        let cell:stNotice = new stNotice();
        cell.content = content;
        cell.title = title;
        result.dataList = [];
        result.dataList.push(cell);
        E.ViewMgr.Open(EViewType.NoticePop,null,result);
    }
}