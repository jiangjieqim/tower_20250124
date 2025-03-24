//接口

/**window["debug"] */
declare let debug:boolean;

declare interface ISpineRes{
    /**GC回收未使用的spine资源 */
    GC();
    /**释放骨骼对象 */
    free(_skel:Laya.SpineSkeleton);
}

/**Spine资源管理模块 */
declare let spineRes:ISpineRes;
/**
 * 数数接口
 */
interface IThinkData{
    /**事件上报 */
    track(eventName:string,obj?);
    /**只上报一次的用户属性 */
    userSetOnce(obj);
    /**更新设置用户属性 */
    userSet(obj);
    /**首次设置用户id */
    login(userID:string);

    store;
    persistence;
}