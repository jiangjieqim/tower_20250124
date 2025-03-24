import { ListUtil } from "../../frame/util/ListUtil";
import { Dictionary } from "../structure/Dictionary";
import { Callback } from "./Callback";

/**事件派发器*/
export class EventManager {

    //TODO:当前的列表结构类型，无法明确字段数量。
    //需要新建一个构造类用来存放字段，列表改为Map<k,v> 更清晰

    private _handles: Dictionary<string, Callback[]> = null;
    private _hasInit: boolean = false;

    public Init(): boolean {
        if (this._hasInit) return false;
        this._hasInit = true;
        if (this._handles != null) {
            this._handles.Foreach((k: string, v: Callback[]): boolean => {
                if (v != null)
                    v = [];
                return true;
            });
        }
        this._handles = new Dictionary<string, Callback[]>();

        return true;
    }

    public Clear() {

    }

    //发送事件
    public emit(eventId: string, data?: any): void {
        if (!this._hasInit) return;
        if (data) {
            data.eventName = eventId;//保存一下事件ID
        }
        if (this._handles.HasKey(eventId) && this._handles != null) {
            this._handles.Value(eventId).forEach((i) => {
                i.Invoke(data);
            });
        }
    }

    //添加普通事件
    public on(eventName: string, target: any, callback: Function): void {
        this._handles.Add(eventName, this._handles.Value(eventName) || []);

        let item: Callback = Callback.Create(target, callback);
        ListUtil.Add(this._handles.Value(eventName), item);
    }

    //通过事件名和target移除一个监听器
    public off(eventName: string, target: any, callback: any): void {
        if (this._handles.HasKey(eventName) && this._handles.Value(eventName) != null) {
            ListUtil.Copy(this._handles.Value(eventName)).forEach((i) => {
                if (i.Caller == target && i.CallBack == callback) {
                    ListUtil.Remove(this._handles.Value(eventName), i);
                    if (this._handles.Value(eventName).length == 0)
                        this._handles.Remove(eventName);
                }
            });
        }
    }

}