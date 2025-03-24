import { stElement } from "../../../network/protocols/BaseProto";
import { ComposeUpdateVo } from "./HeroCreateMgr";
import { ComposeDragGrid } from "./views/ComposeDragGrid";
import { IAddHero } from "./vos/EFightEnum";
/**循环帧队列抽象行为装饰器接口 */
export abstract class HeroBaseDecorator{
    target:HeroBaseDecorator;
    /**终止帧循环 */
    abstract stop();
    /**开始帧循环 */
    abstract start();
    /**关键帧循环 */
    abstract onLoop();
    /**将英雄对象添加是舞台容器 */
    abstract addChildHero(grid:ComposeDragGrid,obj: IAddHero,o:stElement,time:number);
    /**增减英雄增删操作数据 sync:true同步创建英雄*/
    abstract createHero(vo:ComposeUpdateVo,sync?:boolean);
}