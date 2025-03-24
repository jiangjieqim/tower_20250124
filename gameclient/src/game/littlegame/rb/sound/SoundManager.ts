import {GameModel} from "../../module/game/model/GameModel";
import {ModuleManager} from "../ModuleManager";

export class SoundManger {
    static enable:boolean = false;

    static BGMType = {
        Unknown: 0,
        Main: 1,
        Game: 2,
    };

    static BGMName = {
        1: 'bgm_main',
        2: 'bgm_level',
    };

    static soundPath = "";
    static lastPlayCutSoundTime: number = 0;
    static lastPlayLevelupSoundTime: number = 0;
    static lastPlayGrowSoundTime: number = 0;
    static bgmSoundChannel:Laya.SoundChannel = null;
    static promotionSoundChannel: Laya.SoundChannel = null;
   
    static isSoundClosed: boolean = false;

    static bgmType: number = 0;
    static isMusicClosed: boolean = false;
    static bgmChannels: { [id: number]: Laya.SoundChannel } = {};
    static bgmChannel: Laya.SoundChannel = null;

    static heartbeatChannel: Laya.SoundChannel = null;
    static isPlayingHeartbeat:boolean = false;

    static playSound(name: string, completeCb: Function = null, completeThis: any = null): Laya.SoundChannel {
        if(!this.enable){
            return;
        }
        // return null;
        let handler = null;
        if (completeCb) {
            handler = Laya.Handler.create(completeThis, completeCb) 
        }
        return Laya.SoundManager.playSound(SoundManger.soundPath + "res/sound/" + name + ".mp3", 1, handler);

    }

    // static playMusic(name) {
    //     Laya.SoundManager.playMusic(SoundManger.soundPath + "res/sound/" + name + ".mp3");
    //     Laya.SoundManager.autoStopMusic = false;
    // }

    static click() {

    }

    static playBgmMusic() {
        if(!this.enable){
            return;
        }
        // return;//去掉了
        if (!this.bgmSoundChannel) {
            this.bgmSoundChannel = Laya.SoundManager.playMusic(SoundManger.soundPath + "res/sound/bgm.mp3");
        } else {
            this.bgmSoundChannel.resume(); 
        }
    }

    static stopMusic() {
        // console.info('stopMusic', new Date().toLocaleString());
        if (this.bgmSoundChannel) {
            this.bgmSoundChannel.pause(); 
        }
    }

    static clearMusic(){
        if (this.bgmSoundChannel) {
            this.bgmSoundChannel.pause(); 
            this.bgmSoundChannel = null;
        }
    }

    static closeSound() {
        this.isSoundClosed = true;
    }

    static openSound() {
        this.isSoundClosed = false;
    }

    static closeMusic() {
        this.isMusicClosed = true;
    }

    static openMusic() {
        this.isMusicClosed = false;
    }

    static get model(): GameModel {
        
        return ModuleManager.inst.gameContext.model as GameModel;
    }

    static playHeartbeatSound() {
 
    }

    static stopHeartbeatSound() {

    }
}