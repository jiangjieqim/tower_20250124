import { BaseCfg } from "../../../../static/json/data/BaseCfg";

export class t_Head_Image extends BaseCfg{
    private static _ins:t_Head_Image;
    private _map:any;

    public static get Ins(){
        if(!this._ins){
            this._ins = new t_Head_Image();
        }
        return this._ins;
    }

    public GetTabelName(): string {
        return "t_Head_Image";
    }

    constructor(){
        super();
        this._map = {};
        for(let i:number=0;i<this.List.length;i++){
            let type = this.List[i].f_type;
            if(!this._map[type]){
               this._map[type] = [];
            }
            this._map[type].push(this.List[i]);
        }
    }

    public getListByType(type:number){
        return this._map[type];
    }

    public getCfgByIdAndType(id:number,type:number):Configs.t_Head_Image_dat{
        return this.List.find(item => item.f_headid == id && item.f_type == type);
    }

    public getIconSkin(imageid:number){
        return `o/headicon/${imageid}.png`;
    }

    public getIconKSkin(imageid:number){
        return `o/headkicon/${imageid}.png`;
    }
}