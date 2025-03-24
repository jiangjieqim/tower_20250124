import { MathUtil } from "../../frame/util/MathUtil";
// import StorageUtil from "../../frame/util/StorageUtil";
import { InitConfig, PlatformConfig } from "../../InitConfig";
// import { InitConfig } from "../setting/GameCfg";
export namespace Frame {
    export class BGMDefine {//背景音乐
        public static bgm: string = "bg1.mp3";
    }
    
    // export class UIDefine {//UI音效
    //     public static anniu: string = "sound_anniu.mp3";//按钮音效
    //     // public static close: string = "sound_close.mp3";//关闭窗口
    // }
    /**
     * 声音管理类
     * 建议背景音乐用mp3类型，音效用mp3或者mp3类型（如果打包为app，音效只能用mp3格式）
    */
    export class AudioManager {

        private readonly minMusicVolume: number = 0;
        private readonly maxMusicVolume: number = 0.5;
        private readonly minSoundVolume: number = 0;
        private readonly maxSoundVolume: number = 1;
        /**音乐静音 */
        private isMusicMute: boolean = false;
        /**音效静音 */
        private isSoundMute: boolean = false;

        private _hasInit: boolean = false;
        // private playEndHandler:Laya.Handler;
        constructor() { }

        public Init(): boolean {
            if (this._hasInit) return false;
            this._hasInit = true;

            this.initAudioItems();

            //失去焦点后自动停止播放音效
            Laya.SoundManager.autoStopMusic = true;
            Laya.SoundManager.autoReleaseSound = true;

            this.SetMusicMute(false);
            this.SetSoundMute(false);

            return true;
        }

        public Clear() {
            this.clearAudioItems();
        }

        //#region 音乐音效开关

        /**获取背景音乐是否静音*/
        public GetMusicMute(): boolean {
            let volume: number = this.getMusicMuteData() ? this.minMusicVolume : this.maxMusicVolume;
            this.setMusicVolume((MathUtil.Clamp(volume, this.minMusicVolume, this.maxMusicVolume)));

            return this.isMusicMute;
        }

        /**设置背景音乐静音*/
        public SetMusicMute(b: boolean): void {
            b = this.mutcConvert(b);
            this.setMusicMuteData(b);
            this.setMusicVolume(b ? this.minMusicVolume : this.maxMusicVolume);
        }

        /**获取音效静音*/
        public GetSoundMute(): boolean {
            let volume: number = this.getSoundMuteData() ? this.minSoundVolume : this.maxSoundVolume;
            //设置音量
            this.setSoundVolume(MathUtil.Clamp(volume, this.minSoundVolume, this.maxSoundVolume));
            return this.isSoundMute;
        }

        /**处理忽视静音的情况 */
        private mutcConvert(b:boolean){
            if(initConfig.platform == PlatformConfig.MEITUAN && 
                InitConfig.wxLoginResult && InitConfig.wxLoginResult.result.audit == 1)
            {
                b = false;//评审状态的在美团平台不静音处理
            }
            return b;
        }

        /**设置音效静音*/
        public SetSoundMute(b: boolean): void {
            b = this.mutcConvert(b);
            this.setSoundMuteData(b);
            this.setSoundVolume(b ? this.minSoundVolume : this.maxSoundVolume);
        }

        private setMusicVolume(v: number) {
            Laya.SoundManager.setMusicVolume(v);
        }

        private setSoundVolume(v: number) {
            Laya.SoundManager.setSoundVolume(v);
        }

        /**获取音乐设置*/
        private getMusicMuteData(): boolean {
            // let mute: string = StorageUtil.Get(StorageUtil.MusicVolume, false);
            // Log.Log("getMusicMuteData::" + mute);
            // return this.isMusicMute = (mute == "true");
            return this.isMusicMute;
        }

        /**获取声音设置*/
        private getSoundMuteData(): boolean {
            // let mute: string = StorageUtil.Get(StorageUtil.SoundVolume, false);
            // Log.Log("getSoundMuteData::" + mute);

            // return this.isSoundMute = (mute == "true");
            return this.isSoundMute;
        }

        private setMusicMuteData(b: boolean) {
            // StorageUtil.Set(StorageUtil.MusicVolume, b ? "true" : "false", false);
            this.isMusicMute = b;
        }
        private setSoundMuteData(b: boolean) {
            // StorageUtil.Set(StorageUtil.SoundVolume, b ? "true" : "false", false);
            this.isSoundMute = b;
        }

        //#endregion

        //#region 播放音乐音效

        /**
         * 播放背景音乐
         * @param name 音效名称
         * @param loop 循环次数 0=无限
         * @param complete 回调 需要携带参数bool，用来判断当前BGM是否播放完成
         */
        public PlayBGM(name: string, loop: number = 0, complete?: Laya.Handler) {
            if (this.disableSound) return;
            // if(E.initConfig.disableSound) return;
            if (StringUtil.IsNullOrEmpty(name)) return;
            this.playBGM(name, loop, complete);
        }

        // /**播放音效
        //  * @param name 音效名称
        //  * @param complete 回调
        // */
        // public PlaySound(name: string, complete: Callback = null) {
        //     if (StringUtil.IsNullOrEmpty(name)) return;
        //     let volume: number = this.GetSoundMute() ? 0 : 1;
        //     this.playSound(EAudioType.SOUND, name, volume, complete);
        // }

        /**播放音效
         * @param name 音效名称
         * @param complete 回调
        */
        public PlaySound1(name: string) {
            if (this.disableSound) return;
            let volume: number = this.GetSoundMute() ? 0 : 1;
            this.playSound1("o/audio/sound/" + name, volume);// InitConfig.getOther()+
        }

        /**播放UI音效 
         * @param name 音效名称
         * @param complete 回调 
        */
        public PlayUI(name: string) {
            // let channel:Laya.SoundChannel;
            
            // for(let i = 0;i< 1000;i++){

            if (StringUtil.IsNullOrEmpty(name)) return;

            let volume: number = this.GetSoundMute() ? 0 : 1;
            // if(channel && !channel.isStopped){
            // console.log(i+ ":not stop!!!!");
            // return;
            // }
            this.playSound(EAudioType.UI, name, volume);
            // }
        }

        public StopBGM(): void {
            LogSys.Warn(`StopBGM...`);
            Laya.SoundManager.stopMusic();
        }

        public StopSound(): void {
            Laya.SoundManager.stopAllSound();
        }

        /**停止当前音效 */
        public stopCurSound(_name:string){
            Laya.SoundManager.stopSound(`o/audio/sound/${_name}`);
        }

        //#endregion

        //#region 播放音频

        // private maxDis: number = 10;//超出最大距离没有声音

        /**通过距离获取音量*/
        private getVolumeByDis(dis: number, maxDis: number) {
            //Log.Log("[getVolumeByDis],dis:" + dis + " maxdis:" + maxDis + " clamp:" + MathUtil.Clamp(dis / maxDis, 0, 1));
            return (1 - MathUtil.Clamp(dis / maxDis, 0, 1));
        }

        /**
         * 播放背景音音乐
         * @param type 音效类型
         * @param loop 循环次数 0=无限
         */
        private playBGM(name: string, loop: number = 0, complete?: Laya.Handler): void {
            let item: Item = this.getItem(EAudioType.BGM, name);

            if (item != null) {
                // this.StopBGM();

                if (!Laya.SoundManager['_isActive']) {
                    LogSys.Warn(`playBGM ->SoundManager's _isActive is false`);
                    return;
                }
                Laya.SoundManager.playMusic(item.Path, loop, complete);
                this.GetMusicMute();
            }
        }

        // private playEnd(volume,complete:Callback,soundChannel:Laya.SoundChannel){
            // soundChannel.volume = parseFloat(volume.toFixed(2));
            // if (complete != null) complete.Invoke(soundChannel);
        // }

        private get disableSound(){
            return Laya.Utils.getQueryString("disableSound") || initConfig.disableSound;
        }

        /**播放音效
         * @param type 音效类型
         * @param name 音效名称
         * @param volume 音量
        */
        private playSound(type: EAudioType, name: string, volume: number) {
            if (this.disableSound) return;

            if(this.GetSoundMute()){
                return;
            }
            let item: Item = this.getItem(type, name);
            if (isNaN(volume) || volume <= 0){ 
                // if (complete != null) complete.Invoke();
                return;
            }
            if (item != null) {
                return this.soundPlay(item.Path,volume);
            }else{
                // if (complete != null) complete.Invoke();
            }
        }

        /**播放音效
         * @param type 音效类型
         * @param name 音效名称
         * @param volume 音量
        */
        private playSound1(path: string, volume: number): void {
            if(this.GetSoundMute()){
                return;
            }
            if (isNaN(volume) || volume <= 0){ 
                // if (complete != null) complete.Invoke();
                return;
            }
            this.soundPlay(path,volume);
        }
        private playList:string[] = [];
        private soundPlay(path:string,volume:number){
            if(this.playList.indexOf(path)!=-1){
                // LogSys.Log(path + " 未播放完成");
                return;
            }
            this.playList.push(path);
            // LogSys.Log("===>start"+Laya.timer.currTimer+":" + path + "," + volume);
            volume = MathUtil.Clamp(volume, this.minSoundVolume, this.maxSoundVolume);
            let soundChannel = Laya.SoundManager.playSound(path, 1,new Laya.Handler(this,this.onPlayEnd,[path,volume]));
            if(soundChannel){
                soundChannel.volume = volume;
            }else{
                // LogSys.Warn(path+" soundChannel is null");
                this.onPlayEnd(path,volume);
            }
            return soundChannel;
        }

        private onPlayEnd(path:string,vol:number){
            let index = this.playList.indexOf(path);
            while(index!=-1){
                this.playList=this.playList.splice(index,0);
                index = this.playList.indexOf(path);
            }
            // LogSys.Log("===>end  "+Laya.timer.currTimer+":"+path + "," + vol + " is end");
        }

        //#endregion

        /**加载音效*/
        public LoadAudio(that,complete: Function, progress: Function=null): void {
            let path: Array<any> = [];
            if (this._items == null || this._items.length == 0) {
                LogSys.Log("[AudioManager][LoadAudio],没有可加载音效");
                return;
            }

            this._items.forEach(i => {
                ListUtil.Add(path, { url: i.Path, type: Laya.Loader.SOUND });
            })

            LogSys.Log("[AudioManager][LoadAudio],正在加载音效资源");

            if (path == null || path.length == 0) {
                LogSys.Log("[AudioManager][LoadAudio],音效资源加载完成");
                if (null != complete)
                    complete.call(that);
            }

            Laya.loader.load(path, Laya.Handler.create(this, () => {
                LogSys.Log("[AudioManager][LoadAudio],音效资源加载完成");
                if (null != complete)
                    complete.call(that);
            }, [], false), Laya.Handler.create(this, (v) => {
                if (null != progress)
                    progress.call(that,v);
            }, [], false));
        }

        //#region 音频条目
        private _items: Item[] = [];

        private getItem(type: EAudioType, name: string): Item {
            let str: string = "";
            if (type == EAudioType.BGM)
                str = Path.BGMPath;
            else if (type == EAudioType.SOUND)
                str = Path.SOUNDPath;
            else if (type == EAudioType.UI)
                str = Path.UIPath;
            else if (type == EAudioType.VFX)
                str = Path.VFXPath;

            let item = this._items.find(i => i.Type == type && i.Path == str + name);
            if (item == null)
                item = this._items.find(i => i.Type == type && i.Path == str + name + ".mp3");
            if (item == null)
                item = this._items.find(i => i.Type == type && i.Path == str + name + ".wav");
            return item;
        }

        private initAudioItems() {
            this._items = [];
            //BGM
            ListUtil.Add(this._items, new Item(Path.BGMPath + BGMDefine.bgm, EAudioType.BGM));
            //音效
            //UI
            ListUtil.Add(this._items, new Item(Path.UIPath + "sound_anniu.mp3", EAudioType.UI));


            // ListUtil.Add(this._items, new Item(Path.UIPath + UIDefine.close, EAudioType.UI));
            //VFX
            // ListUtil.Add(this._items, new Item(Path.VFXPath + VFXDefine.chapping, EAudioType.VFX));

        }

        private clearAudioItems() {
            this._items.forEach(item => {
                Laya.Loader.clearRes(item.Path);
            });
            this._items = [];
        }

        //#endregion

    }

    export class Item {

        private _path: string = "";
        public get Path(): string { return this._path; }

        private _type: EAudioType = EAudioType.SOUND;
        public get Type(): EAudioType { return this._type; }

        constructor(path: string, type: EAudioType) {
            this._path = path;
            this._type = type;
        }

        public Contains(path: string, type: EAudioType): boolean {
            if (this._path == path && this._type == type) return true;
            return false;
        }

    }

    class Path {

        //#region 音效路径

        private static _root: string = "o/audio/";
        // InitConfig.getOther()+

        private static _bgmFloder: string = "bgm/";//背景音乐文件路径
        private static _soundFloder: string = "sound/"; //场景音效文件路径
        private static _uiFloder: string = "ui/";//UI音效文件路径
        private static _vfxFloder: string = "vfx/";//特效音效文件路径

        public static get Root() { return this._root; }

        public static get BGMPath() { return this._root + this._bgmFloder; }
        public static get SOUNDPath() { return this._root + this._soundFloder; }
        public static get UIPath() { return this._root + this._uiFloder; }
        public static get VFXPath() { return this._root + this._vfxFloder; }

        //#endregion
    }

    /**音效类型*/
    enum EAudioType {
        BGM = 0,//背景音乐
        SOUND = 1,//声音音效-其他事件产生的音效
        UI = 2,//UI音效-UI交互产生的音效
        VFX = 3,//特效音效-3d场景中的音效，会跟据距离衰减
    }

    //#region 音效名称定义


    // export class VFXDefine {//特效音效
    // public static chapping:string = "sound_chapping.mp3";//鼓掌
    // }

    //#endregion
}