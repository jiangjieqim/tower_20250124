export class TowerMainEvent{
    
    public static UPDATE_BBTN_CLICK:string = "UPDATE_BBTN_CLICK";//底部按钮选中
    public static UpdateRoleData:string = "UpdateRoleData";
    public static ValChangeCell:string = "ValChangeCell";//数值颗粒变化
    public static ValChange:string = "ValChange";//数值变化
    // public static ButtonCtlClick:string = "ButtonCtlClick";
    public static MainViewLayerChange:string = "MainViewLayerChange";//需要新手引导检测触发的时候可以主动派发
    public static FunctionChange:string = "FunctionChange";
    public static FuncSmallIconUpdate:string = "FuncSmallIconUpdate";
    public static StTimerChange:string = "StTimerChange";
    public static MainViewInit:string = "MainViewInit";
    public static UpdateRoleLv:string = "UpdateRoleLv";
    /**昵称变化 */
    public static NickNameChange:string = "NickNameChange";
    /**头像变化 */
    public static HeadUpdate:string = "HeadUpdate";
}