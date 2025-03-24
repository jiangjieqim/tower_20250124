import { stSkin } from "../network/protocols/BaseProto";
import { AvatarFactory } from "../view/handle/avatar/AvatarFactory";
import { AvatarMonsterView } from "../view/handle/avatar/AvatarMonsterView";
import { AvatarView, EAvatarDir } from "../view/handle/avatar/AvatarView";
import { BaseAdapter } from "./BaseAdapter";

/**戳爆三国 */
export class ThreeKingdomsAdapter extends BaseAdapter {
    unlockColor:string = "#FB5AFB";
    fontOffsetX:number = -3;
    heroAnim:string = "hero1";
    adventureCreateMonster(dir?: EAvatarDir, rideid?: number, wingid?: number, showBlood?: boolean, imageID?: number,flagId?:number) {
        return AvatarFactory.createFightMonsterAvatar(dir, rideid, wingid, showBlood,0,0,0);
    }
    // leadImageId:number = 0;
    // leadFlagId:number = 0;
    // leadHaloId:number = 0;
    randomSkin(_avatar:AvatarMonsterView){
        /*
        //这里使用每次都构建的方式创建角色,这样兼容性比较好
        let ran:number = RandomUtil.RandomRoundInt(1,60);
        let cfg = Enemy_ImageProxy.Ins.getCfg(ran);
        if(_avatar){
            LogSys.Log("随机一个皮肤,更新:"+JSON.stringify(cfg));
            _avatar.mSkin = Enemy_ImageProxy.Ins.toTSkin(cfg);
        }
        */
    }
    // updatedummuSkin(skin:HeroHouseMainView,url:string){
        // skin._ui.fightGuBtn.skin = url;

        // skin._ui.fightGuBtn.skin = "";
        // skin.dumpAvatarFlag = !StringUtil.IsNullOrEmpty(url);
    // }
    // setHeroAnimPosY(spr:Laya.Sprite,y:number):void{
    // spr.y = y;
    // }
    getHeroAnimIndex(index:number):number{
        return index;
    }

    setSkin(avatar:AvatarView,v:stSkin){
        
    }

    // getAttrAvatar(heroContainer:Laya.Sprite,accoutID:number){
    //     if (accoutID == MainModel.Ins.mRoleData.AccountId) {
    //         let avatar = AvatarFactory.getStandUiMainAvatar();
    //         heroContainer.addChild(avatar);
    //         return avatar;
    //     } else {
    //         let view: ShowPlayerView = E.ViewMgr.Get(EViewType.ShowPlayer) as ShowPlayerView;
    //         if (view.IsShow()) {
    //             heroContainer.addChild(view.avatar);
    //         }
    //     }
    // }

    getMountIcon(id:number){
        return `o/horse/${id}.png`;
    }

    createMount(f_MountID:number){
        let skin:stSkin = new stSkin();
        skin.f_MountID = f_MountID;
        return AvatarFactory.createAvatarByStSkin(skin,13);// EAvatarAnim.None
    }
    // createAvatarSkin(imageId:number){
        // let _imgcfg:Configs.t_Enemy_Image_dat = Enemy_ImageProxy.Ins.getCfg(imageId);
        // let avatar = AvatarFactory.createFightMonsterAvatar(EAvatarDir.Left, _imgcfg.f_MountID, _imgcfg.f_WingID, false,0,0,0); 
        // //this.adventureCreateMonster(EAvatarDir.Left, _imgcfg.f_MountID, _imgcfg.f_WingID, false,_imgcfg.f_ImageID);
        // avatar.start();
        // avatar.play(EAvatarAnim.NormalStand);
        // let monsterSkin: stSkin = Enemy_ImageProxy.Ins.toTSkin(_imgcfg);
        // avatar.mSkin = monsterSkin;
        // return avatar;
    // }
    refreshAvatar(avatar: AvatarView, skin: stSkin) {
        avatar.mSkin = skin;
    }
}