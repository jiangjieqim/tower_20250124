import { EventType } from "./EventType";

export class EventItem {
    private _eventId: string;
    private _callback: Function;
    private _eventType: EventType;
    private _caller: any;
    private _listener: any;
    private _data: any[];

    public get EventId() { return this._eventId; }
    public get Callback() { return this._callback; }
    public get EventType() { return this._eventType; }
    public get Caller() { return this._caller; }
    public get Listener() { return this._listener; }

    constructor(caller: any, listener: Laya.Sprite, eventid: string, callback: Function, eventtype: EventType, data: any[]) {
        this._caller = caller;
        this._listener = listener;
        this._eventId = eventid;
        this._callback = callback;
        this._eventType = eventtype;
        this._data = data;
    }
}