import { E } from "../G";
export interface IAnimAdapter{
    getAnimInex(index:number):number;
}


/**动作适配器 */
export class BossAnimAdapter implements IAnimAdapter{
    getAnimInex(index:number){
        return E.gameAdapter.bossConvertAnim(index);
    }
}