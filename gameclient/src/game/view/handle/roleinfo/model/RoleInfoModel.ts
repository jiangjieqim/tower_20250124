import { stCareer, stCellValue } from "../../../../network/protocols/BaseProto";

export class RoleInfoModel extends Laya.EventDispatcher{
    private static _ins: RoleInfoModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new RoleInfoModel();
        }
        return this._ins;
    } 

    public careerList:stCareer[];
    public pveList:stCareer[];
    public pveHardList:stCareer[];
    public nameCellValue:stCellValue;
    public headList:number[];
    public headKList:number[];
    public pveModeExist:number;
    public zan:number;
    constructor(){
        super();
    }

    public getMaxTrophy(){
        let arr = RoleInfoModel.Ins.careerList;
        if(!arr)return 0;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].flag == 1){
                return arr[i].times;
            }
        }
        return 0 ;
    }

    public getMaxPveNum(type:number){
        let arr = [];
        if(type == 1){
            arr = RoleInfoModel.Ins.pveList;
        }else if(type == 2){
            arr = RoleInfoModel.Ins.pveHardList;
        }
        if(!arr)return 0;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].flag == 1){
                return arr[i].times;
            }
        }
        return 0 ;
    }

}