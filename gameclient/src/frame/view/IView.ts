import { EViewType } from "../../game/common/defines/EnumDefine";
import { ResItemGroup } from "../../game/resouce/ResItemGroup";
/**View接口 */
export interface IView {
    // LayerType: ELayerType;//层级类型
    ViewType: EViewType;//页面类型
    UI: Laya.View;//页面UI
    ResGroup: ResItemGroup;//资源组

    Enter(callback: Callback, data: any,viewParent?:Laya.Sprite): void;//进入处理
    Exit(): void;//退出处理
    HasInit(): boolean;//是否初始化-初始化需要加载相应资源
    IsShow(): boolean;//是否显示
    SetLayout(): void;//布局处理
    UpdateView():void;//更新视图
    showUpdate(data):void;//显示的时候更新
}