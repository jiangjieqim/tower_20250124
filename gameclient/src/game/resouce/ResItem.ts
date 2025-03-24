/**资源条目*/
export class ResItem {

    private _url: string;//资源地址
    private _type: string;//资源类型
    private _isKeepMemory: boolean;//是否保存到缓存-暂未用到

    constructor(url: string, type: string, isKeepMemory: boolean = true) {
        this._url = url;
        this._type = type;
        this._isKeepMemory = isKeepMemory;
    }

    public get Url(): string { return this._url; }
    public get Type(): string { return this._type; }
    public get IsKeepMemory(): boolean { return this._isKeepMemory; }

    public Clear() {
        this._url = null;
        this._type = null;
        this._isKeepMemory = false;
    }
}