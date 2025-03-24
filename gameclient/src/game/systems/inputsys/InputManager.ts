// import { Dictionary } from "../../../frame/structure/Dictionary";
// import DicUtil from "../../../frame/util/DicUtil";
// import StringUtil from "../../../frame/util/StringUtil";
// import t_system_unlock_help from "../../static/json/data/cfg_t_system_unlock";
import Event = Laya.Event

/**
 * 输入管理器
 * -注册管理全局的键鼠操作事件 
*/
export class InputManager {

    private _hasInit: boolean = false;

    public Init(): boolean {
        if (this._hasInit) return;
        this._hasInit = true;
        this.initEvent();
        //注册事件
        //鼠标事件
        Laya.stage.on(Event.CLICK, this, this.onClick, null);
        Laya.stage.on(Event.DOUBLE_CLICK, this, this.onDoubleClick, null);
        Laya.stage.on(Event.RIGHT_CLICK, this, this.onRightClick, null);
        Laya.stage.on(Event.MOUSE_DOWN, this, this.onMouseDown, null);
        Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove, null);
        Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseOut, null);
        Laya.stage.on(Event.MOUSE_OVER, this, this.onMouseOver, null);
        Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp, null);
        Laya.stage.on(Event.MOUSE_WHEEL, this, this.onMouseWheel, null);
        Laya.stage.on(Event.RIGHT_MOUSE_DOWN, this, this.onRightMouseDown, null);
        Laya.stage.on(Event.RIGHT_MOUSE_UP, this, this.onRightMouseUp, null);

        //键盘事件
        Laya.stage.on(Event.KEY_DOWN, this, this.onKeyDown, null);
        //Laya.stage.on(Event.KEY_PRESS, this, this.onKeyPress, null);//拿到的keycode是错误的，不要使用
        Laya.stage.on(Event.KEY_UP, this, this.onKeyUp, null);

        return true;
    }

    public Clear(): void {
        if (!this._hasInit) return;
        this._hasInit = false;
        this.clearEvent();
        //注销事件
        //鼠标事件
        Laya.stage.off(Event.CLICK, this, this.onClick, null);
        Laya.stage.off(Event.DOUBLE_CLICK, this, this.onDoubleClick, null);
        Laya.stage.off(Event.RIGHT_CLICK, this, this.onRightClick, null);
        Laya.stage.off(Event.MOUSE_DOWN, this, this.onMouseDown, null);
        Laya.stage.off(Event.MOUSE_MOVE, this, this.onMouseMove, null);
        Laya.stage.off(Event.MOUSE_OUT, this, this.onMouseOut, null);
        Laya.stage.off(Event.MOUSE_OVER, this, this.onMouseOver, null);
        Laya.stage.off(Event.MOUSE_UP, this, this.onMouseUp, null);
        Laya.stage.off(Event.MOUSE_WHEEL, this, this.onMouseWheel, null);
        Laya.stage.off(Event.RIGHT_MOUSE_DOWN, this, this.onRightMouseDown, null);
        Laya.stage.off(Event.RIGHT_MOUSE_UP, this, this.onRightMouseUp, null);

        //键盘事件
        Laya.stage.off(Event.KEY_DOWN, this, this.onKeyDown, null);//一直按着，每帧都会触发
        //Laya.stage.on(Event.KEY_PRESS, this, this.onKeyPress, null);//拿到的keycode是错误的,需要进行转换，不要使用
        Laya.stage.off(Event.KEY_UP, this, this.onKeyUp, null);
    }

    private _eventMap: Dictionary<string, Callback[]> = new Dictionary<string, Callback[]>();

    /**添加事件 */
    public AddEvent(type: string, func: Callback): void {
        if (this._eventMap == null) {
            this._eventMap = new Dictionary<string, Callback[]>();
        }
        let funcs = this._eventMap.Value(type);
        if (funcs == null) {
            funcs = []; ListUtil.Add(funcs, func);
            this._eventMap.Add(type, funcs);
        }
        else {
            if (ListUtil.Contains(funcs, func)) {
                console.warn("[inputmgr] has added");
                return;
            }
            ListUtil.Add(funcs, func);
        }
    }

    /**移除事件 */
    public RemoveEvent(type: string, caller: any): void {
        if (this._eventMap == null) return;
        let funcs = this._eventMap.Value(type);
        if (funcs == null) return;
        let result = funcs.find(func => func.Caller == caller);
        if (result == null) return;
        ListUtil.Remove(funcs, result);
    }

    private initEvent(): void {
        this._eventMap = new Dictionary<string, Callback[]>();
    }

    private clearEvent(): void {
        this._eventMap.Clear();
    }

    private callEvent(type: string, e: Event): void {
        let funcs = this._eventMap.Value(type);
        if (funcs == null) return;

        funcs.forEach(func => {
            if (func != null)
                func.Invoke(e);
        })
    }

    private onClick(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.CLICK, e);
    }

    private onDoubleClick(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.DOUBLE_CLICK, e);
    }

    private onRightClick(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.RIGHT_CLICK, e);
    }

    private onMouseDown(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.MOUSE_DOWN, e);
    }

    private onMouseUp(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.MOUSE_UP, e);
    }

    private onMouseMove(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.MOUSE_MOVE, e);
    }

    private onMouseWheel(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.MOUSE_WHEEL, e);
    }

    private onMouseOut(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.MOUSE_OUT, e);
    }

    private onMouseOver(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.MOUSE_OVER, e);
    }

    private onRightMouseDown(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.RIGHT_MOUSE_DOWN, e);
    }

    private onRightMouseUp(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.RIGHT_MOUSE_UP, e);
    }

    private onKeyDown(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.KEY_DOWN, e);
    }

    private onKeyPress(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.KEY_PRESS, e);
    }

    private onKeyUp(e: Event): void {
        if (e == null) return;
        this.callEvent(Event.KEY_UP, e);
    }

}
