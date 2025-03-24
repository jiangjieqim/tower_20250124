import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Function_Card_Extract_Rate extends BaseCfg{
    private static _ins:t_Function_Card_Extract_Rate;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Function_Card_Extract_Rate();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Function_Card_Extract_Rate";
    }

    public getListById(id:number){
        let arr = [];
        for(let i:number=0;i<this.List.length;i++){
            if(this.List[i].f_packageid == id){
                let index = arr.findIndex(ele=>ele.f_qua == this.List[i].f_qua)
                if(index != -1){
                    arr[index].f_reward = arr[index].f_reward + "|" + this.List[i].f_reward;
                }else{
                    let obj:any = {};
                    obj.f_qua = this.List[i].f_qua;
                    obj.f_reward = this.List[i].f_reward;
                    obj.f_drop_probability = this.List[i].f_drop_probability;
                    arr.push(obj);
                }
            }
        }
        return arr;
    }
}