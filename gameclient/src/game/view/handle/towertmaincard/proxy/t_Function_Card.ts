import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Function_Card extends BaseCfg{
    private static _ins:t_Function_Card;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Function_Card();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Function_Card";
    }

    public getList(){
        let arr:Configs.t_Function_Card_dat[] = [];
        for(let i:number=0;i<this.List.length;i++){
            if(this.List[i].f_hide){
                continue;
            }
            arr.push(this.List[i]);
        } 
        return arr;
    }

    public getCfgById(f_cardid:number):Configs.t_Function_Card_dat{
        return this.List.find(ele => ele.f_cardid == f_cardid);
    }

    public getIconById(id:number){
        if(initConfig.disable_card_tex){
            return "remote/base/wenhao.png";
        }
        return `o/cardicon/${id}.png`;
    }

    /**卡牌品质框 */
    public getQuaSkin(qua:number){
        if(initConfig.disable_card_tex){
            return "remote/base/wenhao.png";
        }
        return `static/img_kp${qua}.png`;
        // return `remote/base/img_kp${qua}.png`;
    }

    public getLabSkin(lab:number){
        return `remote/card/icon_${lab}.png`;
    }
}

export class t_Function_Card_Template extends BaseCfg{
    private static _ins:t_Function_Card_Template;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Function_Card_Template();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Function_Card_Template";
    }
    public getCfgById(f_card__templateid:number):Configs.t_Function_Card_Template_dat{
        return this.List.find(ele => ele.f_task_type == f_card__templateid);
    }
}