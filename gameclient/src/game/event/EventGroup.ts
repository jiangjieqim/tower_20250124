import { E } from "../G";
import { EventItem } from "./EventItem";
import { EventType } from "./EventType";

export class EventGroup {

    constructor() {
        this._items = new Array<EventItem>();
    }

    //事件列表
    private _items: Array<EventItem> = new Array<EventItem>();//资源列表

    /**添加事件监听 */
    public Add(caller: any, listener: Laya.Sprite, eventid: string, callback: Function, type: EventType, data: any[]): EventGroup {
        //查找是否已添加
        let idx = this._items.findIndex((value: EventItem, index: number, items: Array<EventItem>) => {
            return value.Caller == caller &&
                value.Listener == listener &&
                value.EventId == eventid &&
                value.EventType == type;
        });
        //新添加
        if (idx == -1) {
            let item = new EventItem(caller, listener, eventid, callback, type, data);
            this._items.push(item);
        }

        if (type == EventType.System) {
            listener.on(eventid, caller, callback, data);
        }
        else if (type == EventType.Custom) {
            E.EventMgr.on(eventid, caller, callback);
        }

        return this;
    }

    /**移除事件监听 */
    public Remove(caller: any, listener: Laya.Sprite, eventid: string, callback: Function, type: EventType) {
        if (this._items == null || this._items.length == 0) return;

        let item = this._items.find((value: EventItem, index: number, items: Array<EventItem>) => {
            return value.Caller == caller &&
                value.Listener == listener &&
                value.EventId == eventid &&
                value.EventType == type;
        });
        //新添加
        if (item) {
            ListUtil.Remove(this._items, item);
        }

        if (type == EventType.System) {
            listener.off(eventid, caller, callback);
        }
        else if (type == EventType.Custom) {
            E.EventMgr.off(eventid, caller, callback);
        }
    }

    /**清除事件监听*/
    public Clear() {
        if (this._items == null || this._items.length == 0) return;

        let len: number = this._items.length;
        for (let i: number = 0; i < len; ++i) {
            let item = this._items[i];
            if (item.EventType == EventType.System) {
                item.Listener.off(item.EventId, item.Caller, item.Callback);
            }
            else if (item.EventType == EventType.Custom) {
                E.EventMgr.off(item.EventId, item.Caller, item.Callback);
            }
        }
        this._items = [];
    }

    /**添加自定义事件 */
    public addEventCus(eventid: string, callback: Function, caller: any) {
        this.Add(caller, null, eventid, callback, EventType.Custom, null);
    }

    /**添加系统事件 */
    public addEventSys(eventid: string, callback: Function, caller: any, listener: Laya.Sprite, data?: any[]) {
        this.Add(caller, listener, eventid, callback, EventType.System, data);
    }


    public static Create(): EventGroup {
        let group = new EventGroup();
        return group;
    }
}