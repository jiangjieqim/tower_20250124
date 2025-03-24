import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Box_Match extends BaseCfg{
    private static _ins:t_Box_Match;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Box_Match();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Box_Match";
    }

    public getCfgById(id:number):Configs.t_Box_Match_dat{
        return this.List.find(ele => ele.f_box_id == id);
    }

    public getListByArena(arena:number){
        let arr = this.List;
        let array = [];
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].f_arena_stage == arena){
                array.push(arr[i]);
            }
        }
        return array;
    }

    public getSkinByQua(qua:number){
        return `static/icon_bx${qua}.png`;
    }

    public getOpenSkinByQua(qua:number){
        return `static/icon_bx${qua}_${qua}.png`;
    }

    public getSkinLabByQua(qua:number){
        return `remote/towerMain/tx_${qua}.png`;
    }
}