
export class StorageUtil {
    private static _canUsed:boolean = false;
    private static _globalKey = "";     //全局key
    private static _accountKey = "";    //账号key

    //所有用到的 Key=========================================================
    public static readonly AccountId: string = "AccountId";
    public static readonly AccountPwd: string = "AccountPwd";
    public static readonly MusicVolume: string = "MusicVolume";
    public static readonly SoundVolume: string = "SoundVolume";
    public static readonly Language: string = "Language";
    public static readonly NoticeCheck: string = "NoticeCheck";
    public static readonly NoticeTime: string = "NoticeTime";
    
    //======================================================================

    /**设置全局键*/
    public static SetGlobalKey(key: string) { this._globalKey = key; }
    public static SetAccountKey(key: string) { this._accountKey = key; }

    /**设置缓存
     * @param key 键
     * @param value 值
     * @param g 全局 true-全局变量 false-当前用户变量
    */
    public static Set(key: string, value: string, g: boolean): void {
        if(!this._canUsed){
            return
        }
        return Laya.LocalStorage.setItem(this.getFullKey(key, g), value);
    }

    /**获取缓存*/
    public static Get(key: string, g: boolean): string {
        if(!this._canUsed){
            return
        }
        return Laya.LocalStorage.getItem(this.getFullKey(key, g));
    }

    /**移除缓存*/
    public static Remove(key: string, g: boolean): void {
        if(!this._canUsed){
            return
        }
        Laya.LocalStorage.removeItem(this.getFullKey(key, g));
    }

    public static SetNum(key: string, value: number, g: boolean): void {
        this.Set(key, value.toString(), g);
    }
    public static GetNum(key: string, g: boolean): number {
        return StringUtil.ParseNum(this.Get(key, g));
    }

    public static SetBool(key: string, value: boolean, g: boolean): void {
        this.Set(key, value ? "1" : "0", g);
    }
    public static GetBool(key: string, g): boolean {
        return StringUtil.ParseNum(this.Get(key, g)) == 0 ? false : true;
    }

    /**清除所有*/
    public static ClearAll(): void {
        if(!this._canUsed){
            return
        }
        Laya.LocalStorage.clear();
    }

    /**获取完整键*/
    private static getFullKey(key: string, g: boolean): string {
        let str: string;
        if (g)
            str = this._globalKey + "_" + key;
        else
            str = this._globalKey + "_" + this._accountKey + "_" + key;
        return str;
    }

}