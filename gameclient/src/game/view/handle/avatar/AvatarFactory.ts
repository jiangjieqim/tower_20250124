import { BossAnimAdapter } from "../../../adapter/AnimAdapter";
import { EMsgBoxType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { stSkin } from "../../../network/protocols/BaseProto";
import { ResItemGroup } from "../../../resouce/ResItemGroup";
import { IconUtils } from "../main/model/IconUtils";
import { EEquipSkin, EEquipType } from "../main/vos/ECellType";
import { AvatarMonsterView } from "./AvatarMonsterView";
import { EAvatarDir } from "./AvatarView";
import { IAvatarView } from "./IAvatarView";
import { SimpleEffect } from "./SimpleEffect";
import { FightPureAnim } from "./spine/FightPureAnim";
import { EAvatarAnim } from "./vos/EAvatarAnim";
import { EActionSkill, EServerSkillType, FightActionVo } from "./vos/FightActionVo";

class EquipSkin{
    type:EEquipType;
    equipStyle:number;
    constructor(type,equipStyle){
        this.type = type;
        this.equipStyle = equipStyle;
    }
}
export enum EFightCamp{
    /**自己 0*/
    Self = 0,
    /**敌方 1*/
    Enemy = 1
}
interface IRound
{
    round:number;
}

export class AvatarFactory{
    public static readonly POS_LEFT_PET:number = 13;
    public static readonly POS_RIGHT_PET:number = 14;
    /**布阵的一边数量 */
    public static readonly maxSideCount:number = 6;
    public static readonly MOVE_POS:number = -300;
    /**偏移值 */
    public static readonly offset:number = 120;

    /**战斗场景的站位数组 */
    public static posList:Laya.Point[] = [];
    // public static _mainAvatar:AvatarMainView;
 
    /*
    public static getAvatar(){
        if(!this._mainAvatar){
            let _avatar: AvatarMainView = new AvatarMainView(false);
            _avatar.initRes();
            this._mainAvatar = _avatar;
        }
        this._mainAvatar.clear();
        return this._mainAvatar;
    }
    */
    //创建一个界面主角avatar
    // public static getStandUiMainAvatar() {
    //     // let _avatar = this.getAvatar();
    //     let _avatar: AvatarMainView = new AvatarMainView(false);
    //     _avatar.imageID = E.gameAdapter.leadImageId;
    //     _avatar.initRes();
    //     _avatar.start();
    //     _avatar.refreshSkin();
    //     _avatar.dir = EAvatarDir.Left;
    //     _avatar.play(EAvatarAnim.NormalStand);
    //     return _avatar;
    // }

    //创建一个界面主角avatar
    // public static getStandHorseMainAvatar() {
    //     // let _avatar = this.getAvatar();
    //     let _avatar: AvatarMainView = new AvatarMainView();
    //     _avatar.imageID = E.gameAdapter.leadImageId;
    //     _avatar.initRes();
    //     _avatar.start();
    //     _avatar.refreshSkin();
    //     _avatar.dir = EAvatarDir.Left;
    //     _avatar.play(EAvatarAnim.NormalStand);
    //     return _avatar;
    // }

    // private static _fightAvatar:AvatarMainView;
    //战斗中的主角avatar
    // public static getStandFightMainAvatar(dir:EAvatarDir = EAvatarDir.Left,showBlood:boolean = true) {
    //     let _fightAvatar = new AvatarMainView();
    //     // _fightAvatar.initRes();
    //     let _avatar: AvatarMainView = _fightAvatar;
    //     _avatar.initFightRes();        
    //     _avatar.start();
    //     _avatar.useFightSkin = true;
    //     _avatar.play(EAvatarAnim.Stand);
    //     if(showBlood){
    //         _avatar.initBlood();
    //     }
    //     _avatar.dir = dir;
    //     _avatar.refreshSkin();
    //     return _avatar;
    // }

    /**非战斗待机 */
    // public static getStandNormalMainAvatar(dir: EAvatarDir = EAvatarDir.Left,ox:number = 0,oy:number = 0) {
    //     let _fightAvatar = new AvatarMainView();
    //     _fightAvatar.offsetX = ox;
    //     _fightAvatar.offsetY = oy;
    //     let _avatar: AvatarMainView = _fightAvatar;
    //     // _avatar.initFightRes();
    //     _avatar.start();
    //     // _avatar.useFightSkin = true;
    //     _avatar.play(EAvatarAnim.NormalStand);
    //     _avatar.dir = dir;
    //     _avatar.refreshSkin();
    //     return _avatar;
    // }

    // public static getFightMainAvatar(dir:EAvatarDir = EAvatarDir.Left,rideid:number,
    //     wingid:number,showBlood:boolean,imageID:number){
    //     let _avatar: AvatarMonsterView = new AvatarMonsterView();
    //     _avatar.imageID = imageID;
    //     _avatar.initFightRes();
    //     _avatar.rideId = rideid;
    //     _avatar.wingId = wingid;
    //     _avatar.initRes();
    //     _avatar.play(EAvatarAnim.Stand);
    //     if(showBlood){
    //         _avatar.initBlood();
    //         if(_avatar.blood){
    //             _avatar.blood.reverse();
    //         }
    //     }
    //     _avatar.dir = dir;
    //     _avatar.start();
    //     _avatar.mSkin = this.createMainSkin(rideid,wingid);
    //     return _avatar;
    // }

    public static createBossMonster(_url:string = 'o/spine/monster01/monster01',that?,func?:Function){
        let _resList = new ResItemGroup();
        _resList.addSkel(_url);
        let _avatar:AvatarMonsterView = new AvatarMonsterView();
        _avatar.animAdapter = new BossAnimAdapter();
        let _scale = E.gameAdapter.convertBossScale(_url);
        _avatar.scaleX = _avatar.scaleY = _scale;
        _avatar.initFightRes();
        _avatar.initBlood();
        if(_avatar.blood){
            _avatar.blood.bgVisible = false;
            _avatar.blood.reverse();
        }
        // let time:number = Laya.timer.currTimer;
        E.ResMgr.LoadGroup(_resList, Callback.Create(this, () => {
            if(_avatar.destroyed){
                return;
            }
            _avatar.setSkel(_url);
            // _avatar.play(EAvatarAnim.NormalStand);
            _avatar.start();
            if(that){
                func.call(that);
            }

            // LogSys.Log("createBossMonster: use" + (Laya.timer.currTimer - time) + " ms");
        }),null);
        return _avatar;
    }

    // /**mHitClick: true创建一个可点击交互的宠物 */
    // public static createPet(f_petanimid:number,mHitClick:boolean = false){
    //     // let cfg = PetListProxy.Ins.getCfgById(petId);
    //     // let f_petanimid = cfg.f_petanimid;
    //     let pet:AvatarMonsterView = this.createBossMonster(`o/spine/pet${f_petanimid}/pet${f_petanimid}`);
    //     pet.play(EAvatarAnim.HandBookStand);
    //     if(mHitClick){
    //         let animShow = new AnimShowCtl();
    //         animShow.bind(pet);
    //     }
    //     return pet;
    // }

    //创建角色
    // public static createCharacter(skinId:number,mHitClick:boolean = false){
    //     let k:string = War3Config.Prefix;
    //     let av:AvatarMonsterView = this.createBossMonster(`o/Image_Character/${k}${skinId}/${k}${skinId}`);
    //     av.play(EAvatarAnim.NormalStand);
    //     av.dir = EAvatarDir.Right;
    //     if(mHitClick){
    //         let animShow = new AnimShowCtl();
    //         animShow.bind(av);
    //     }
    //     return av;
    // }
    //创建战旗
    public static createFlag(skinId:number){ 
        return `o/Image_Flag/flag${skinId}.png`;
    }

    //创建光环
    public static createHalo(skinId:number,sp){
        let eff = new SimpleEffect(sp, `o/Image_Halo/halo${skinId}/halo${skinId}`);
        eff.play(0,true);
        return eff;
    }

    // public static craeteBigBoss(bossId:number,that,func){
    //     let cfg = t_TeamFight_BossAttribute.Ins.getByBossId(bossId);
    //     let key = cfg.f_Res;
    //     let _avatar = AvatarFactory.createBossMonster(`o/spine/${key}/${key}`,that,func);
    //     _avatar.initFightRes();
    //     _avatar.initBlood();
    //     _avatar.blood.reverse();
    //     return _avatar;
    // }

    /**构建主角的形象 */
    public static createMainSkin(rideid?:number,wingid?:number){
        let skin:stSkin = new stSkin();
        /*
        skin.f_HeadID = MainModel.Ins.getIdByStyle( EEquipType.Casque);
        skin.f_WeaponID = MainModel.Ins.getIdByStyle( EEquipType.Weapon);
        skin.f_ShieldID = MainModel.Ins.getIdByStyle( EEquipType.Shield);
        skin.f_WingID = wingid || MainModel.Ins.wingId;
        skin.f_MountID = rideid || ZuoQiModel.Ins.rideVo.mainid;
        skin.f_BodyID = MainModel.Ins.getIdByStyle( EEquipType.Barde);
        */
       skin.f_HeadID = 0;
       skin.f_WeaponID = 0;
       skin.f_ShieldID = 0;
       skin.f_WingID = wingid;
       skin.f_MountID = rideid;
       skin.f_BodyID = 0;
        // skin.f_WarSkinID = WowHuanZhuangModel.Ins.getSkinIDByType(SkinEnum.Character);
        // skin.f_WarWingID = WowHuanZhuangModel.Ins.getSkinIDByType(SkinEnum.Flag);
        // skin.f_WarMountID = WowHuanZhuangModel.Ins.getSkinIDByType(SkinEnum.Halo);
        return skin;
    }


    public static createAvatarByStSkin(v:stSkin,anim:EAvatarAnim=1/**EAvatarAnim.NormalStand */,dir:EAvatarDir = EAvatarDir.Left,ox:number = 0,oy:number = 0) {
        let _avatar:AvatarMonsterView = new AvatarMonsterView();
        _avatar.offsetX = ox;
        _avatar.offsetY = oy;
        _avatar.dir = dir;
        _avatar.rideId = v.f_MountID || 0;
        _avatar.wingId = v.f_WingID || 0;
        E.gameAdapter.setSkin(_avatar,v);
        _avatar.initRes();
        _avatar.play(anim);
        _avatar.start();
        _avatar.mSkin = v;
        return _avatar;
    }

    /**创建一匹没有人物的马 */
    public static createRide(f_MountID:number):IAvatarView{
        // let skin:stSkin = new stSkin();
        // skin.f_MountID = f_MountID;
        // return this.createAvatarByStSkin(skin,EAvatarAnim.None);
        return E.gameAdapter.createMount(f_MountID);
    }

    //  /**创建一个基础主角角色 */
    //  public static createBaseMainAvatar(
    //     equipList:EquipBaseVo[],
    //     rideId:number = 0,wingid:number = 0,
    //     dir:EAvatarDir = EAvatarDir.Left):AvatarMainSkinView
    // {
    //     let _avatar:AvatarMainSkinView = new AvatarMainSkinView();
    //     _avatar.rideId = rideId;
    //     _avatar.wingId = wingid;
    //     _avatar.equipList = equipList;
    //     _avatar.dir = dir;
        
    //     _avatar.initRes();
    //     _avatar.play(EAvatarAnim.NormalStand);
    //     _avatar.start();
    //     _avatar.refreshSkin();
    //     return _avatar;
    // }
    
    /**创建翅膀 */
    // public static createWingAvatar(_wingId:number){
    //     let _avatar:AavatrWingView = new AavatrWingView();
    //     _avatar.initWing(_wingId);
    //     return _avatar;
    // }

    /**
     * 战斗中的怪物
     * @param dir 方向
     * @param rideid 坐骑
     * @param wingid 翅膀
     * @param showBlood 是否显示血条
     * @param war3ImageID 人物形象
     * @param war3FlagId 战旗
     * @param war3HaloId 光环
     */
    public static createFightMonsterAvatar(dir: EAvatarDir = EAvatarDir.Left,
        rideid: number,wingid:number,
        showBlood: boolean,
        war3ImageID:number = 0,
        war3FlagId:number = 0,
        war3HaloId:number = 0
    )
    {
        let _avatar: AvatarMonsterView = new AvatarMonsterView();
        _avatar.imageID = war3ImageID;
        _avatar.flagId = war3FlagId;
        _avatar.haloId = war3HaloId;
        _avatar.initFightRes();
        _avatar.rideId = rideid;
        _avatar.wingId = wingid;
        _avatar.initRes();
        _avatar.refreshSkin();
        _avatar.play(12);//EAvatarAnim.Stand
        if(showBlood){
            _avatar.initBlood();
            if(_avatar.blood){
                _avatar.blood.reverse();
            }
        }
        _avatar.dir = dir;
        _avatar.updateFlagHalo();
        _avatar.start();
        return _avatar;
    }

    /**
     * 创建一个默认的Avatar
     */
    public static createAvatar(resKey:string,dir:EAvatarDir = EAvatarDir.Left): AvatarMonsterView {
        let _avatar: AvatarMonsterView = new AvatarMonsterView();
        _avatar.setRes(resKey);
        _avatar.dir = dir;
        _avatar.start();
        // let skin:stSkin = new stSkin();

        // skin.f_HeadID = MainModel.Ins.getIdByStyle( EEquipType.Casque);
        // skin.f_WeaponID = MainModel.Ins.getIdByStyle( EEquipType.Weapon);
        // skin.f_ShieldID = MainModel.Ins.getIdByStyle( EEquipType.Shield);
        // skin.f_WingID = 0;
        // skin.f_MountID = 0;
        // skin.f_BodyID = MainModel.Ins.getIdByStyle( EEquipType.Barde);

        // _avatar.mSkin = skin;

        // let _avatar = new AvatarView();
        // _avatar.setRes(resKey);
        // _avatar.refreshSkin();
        // _avatar.start();
        return _avatar;
    }

    // /**创建武馆英雄 */
    // public static createHeroAvatar(resKey:string){
    //     let _avatar: AvatarMonsterView = new AvatarMonsterView();
    //     _avatar.setRes(resKey);
    //     _avatar.dir = EAvatarDir.Left;
    //     _avatar.addtionSkinList = ["hit1","tea","woodman"];
    //     _avatar.start();
    //     _avatar.play(EAvatarAnim.Stop);
    //     return _avatar;
    // }

    //###############################################################
    private static ownerX:number = 170;//170;
    private static enemyX:number = 580;//580;
    private static roleWidth:number = 120;//角色宽度

    //前进的目标坐标
    private static forwardTargetX(index){
        if(index == 0){
            return this.enemyX-this.roleWidth;
        }
        return this.ownerX+this.roleWidth;
    }

    //后退的到的原地坐标
    private static backTargetX(index){
        if(index == 0){
            return this.ownerX;
        }
        return this.enemyX;
    }
    public static createTestFightList(){
        let l = [];
        // l.push(new FightActionVo(0,EActionSkill.ClientMove,this.forwardTargetX(0)));
        // l.push(new FightActionVo(0,EActionSkill.NormalAttack));
        // // l.push(new FightActionVo(1,EActionSkill.PassiveHurtBlood,0,2000));
        // l.push(new FightActionVo(0,EActionSkill.SuckBlood,0,10000));
        // l.push(new FightActionVo(0,EActionSkill.ClientMove,this.backTargetX(0)));//返回
        // l.push(new FightActionVo(1,EActionSkill.ClientMove,this.forwardTargetX(1)));//前进
        // l.push(new FightActionVo(1,EActionSkill.NormalAttack));
        // l.push(new FightActionVo(0,EActionSkill.PassiveDodge));
        // l.push(new FightActionVo(0,EActionSkill.PassiveAnim));
        // l.push(new FightActionVo(1,EActionSkill.ClientMove,this.backTargetX(1)));
        //连击
        // for(let i = 0;i < 3;i++){
        //     l.push(new FightActionVo(1,EActionSkill.NormalAttack));
        //     // l.push(new FightActionVo(0,EActionSkill.PassiveHurtBlood,0,Math.floor(2000*Math.random())));
        // }
        // l.push(new FightActionVo(0,EActionSkill.ClientDie));
        // l.push(new FightActionVo(1,EActionSkill.ClientEnd));

        // 受到普攻0 受到暴击1 受到眩晕2
        let skill = 0;
        // l.push(new FightActionVo(0,EActionSkill.ClientMove,this.forwardTargetX(0)));
        // l.push(new FightActionVo(0,EActionSkill.NormalAttack));
        // l.push(new FightActionVo(1,EActionSkill.PassiveAnim,0,skill));
        // l.push(new FightActionVo(0,EActionSkill.NormalAttack));
        // l.push(new FightActionVo(1,EActionSkill.PassiveAnim,0,skill));
        // l.push(new FightActionVo(0,EActionSkill.NormalAttack));
        // l.push(new FightActionVo(1,EActionSkill.PassiveAnim,0,skill));
        // l.push(new FightActionVo(0,EActionSkill.PassiveAnim,0,skill));
        // l.push(new FightActionVo(0,EActionSkill.PassiveAnim,1,skill));
        // l.push(new FightActionVo(0,EActionSkill.PassiveAnim,2,skill));


        //暴击
        // skill = 1;
        // l.push(new FightActionVo(0,EActionSkill.CriticalStrike));
        // l.push(new FightActionVo(1,EActionSkill.PassiveAnim,0,skill));
        // l.push(new FightActionVo(0,EActionSkill.CriticalStrike));
        // l.push(new FightActionVo(1,EActionSkill.PassiveAnim,0,skill));
        // l.push(new FightActionVo(0,EActionSkill.CriticalStrike));
        // l.push(new FightActionVo(1,EActionSkill.PassiveAnim,0,skill));

        // l.push(new FightActionVo(1,EActionSkill.ClientMove,this.forwardTargetX(1)));
        // l.push(new FightActionVo(1,EActionSkill.NormalAttack));
        // l.push(new FightActionVo(0,EActionSkill.ClientDie));

        return l;
    }

    public static Skin2Equip(st:stSkin):EEquipSkin[]{
        let _l = [];
        if(!st){
            let val:number = 0;
            _l.push(new EquipSkin(EEquipType.Weapon,val));
            _l.push(new EquipSkin(EEquipType.Shield,val));
            _l.push(new EquipSkin(EEquipType.Casque,val));
            _l.push(new EquipSkin(EEquipType.Wing,val));
            // _l.push(new EquipSkin(EEquipType.ZuoQi,val));
            _l.push(new EquipSkin(EEquipType.Barde,val));
        }else{
            _l.push(new EquipSkin(EEquipType.Weapon,st.f_WeaponID || 0));
            _l.push(new EquipSkin(EEquipType.Shield,st.f_ShieldID || 0));
            _l.push(new EquipSkin(EEquipType.Casque,st.f_HeadID || 0));
            _l.push(new EquipSkin(EEquipType.Wing,st.f_WingID || 0));
            // _l.push(new EquipSkin(EEquipType.ZuoQi,st.f_MountID || 0));
            _l.push(new EquipSkin(EEquipType.Barde,st.f_BodyID || 0));
        }
        return _l;
    }

    // public static ac2Desc(cell:stFightAction){
    //     return  (cell.pos <= this.maxSideCount) + " " +  this.getAcName(cell);/* + " " + JSON.stringify(cell);*/
    // }
/*
    public static getAcName(cell:stFightAction){
        let val = 1;//= cell.val;
        switch(cell.type){
            case EServerSkillType.NormalAttack:
                return "普通攻击";
            case EServerSkillType.CriticalStrike:
                //3 暴击
                return "暴击"
            case EServerSkillType.PassiveHurtBlood:
                //6 受击减血
                // o.push(new FightActionVo(owner),)
                return "受击减血 -" + val;
            case  EServerSkillType.SuckBlood:
                return "吸血 +" + val;
            case EServerSkillType.Move:
                // 0回到自己的位置 1冲向对方阵地
                let a = "";
                switch(val){
                    case 0:
                        a = "回到自己的位置";
                        break;
                    case 1:
                        a = "冲向对方阵地";
                        break;
                }
                return "移动 " + a;
            case EServerSkillType.PassiveAnim:
                // 5 受击动作 ---> 受到普攻0 受到暴击1 受到眩晕2
                let ac  = "";
                switch(val){
                    case 0:
                        ac = "受到普攻";
                        break;
                    case 1:
                        ac = "受到暴击";
                        break;
                    case 2:
                        ac = "受到眩晕";
                        break; 
                }
                return "受击动作 " + ac + ",动作值:"+val;
            case EServerSkillType.Round:
                //回合数
                return "回合数=========================" + val;
            case EServerSkillType.Dead:
                return "死亡";
            case EServerSkillType.PassiveDodge:
                return "受击闪避";
            case EServerSkillType.Recover:
                //恢复
                return "恢复";
            case EServerSkillType.SkillType:
                return "连击 " + val;
            case EServerSkillType.ResetStand:
                return "重置为待机动作";
            default:
                console.error(cell);
                // throw Error("error!");
                return cell.type;
        }
    }
*/
    /**相同的移动动作 */
    // private static hasSameMove(c:FightActionVo){
    //     let cell = c.frontMove();
    //     if(cell && cell.isBack == c.isBack){
    //         return true;
    //     }
    // }


    private static buildAct(cell/*stFightAction*/,_actlist:FightActionVo[],roundVo:IRound){
        // |stFightActionLog
        let pos:number = cell.pos;
        // let val:number = 0;//cell.val;
        // let target:number = cell.target;
        let act:FightActionVo;
        switch(cell.type){
            case EServerSkillType.NormalAttack:
                //1 普通攻击
                act=(new FightActionVo(pos,EActionSkill.NormalAttack,roundVo.round));
                break;
            case EServerSkillType.CriticalStrike:
                //3 暴击
                act=(new FightActionVo(pos,EActionSkill.CriticalStrike,roundVo.round));
                break;
            case EServerSkillType.PassiveHurtBlood:
                //6 受击减血
                // o.push(new FightActionVo(owner),)
                act=(new FightActionVo(pos,EActionSkill.PassiveHurtBlood,roundVo.round));
                break;
            case  EServerSkillType.SuckBlood:
                //2 吸血
                act=(new FightActionVo(pos,EActionSkill.SuckBlood,roundVo.round));
                break;
            case EServerSkillType.Move:
                // val 这里代表移动到哪里去,移动到坐标pos

                //8 回合移动移动到原位置
                // o.push(new FightActionVo(owner,EActionSkill.End,0,0,o));
                // let x:number = 0;
                // let isBack:boolean = false;
/*
                if(val == 0){
                    x = this.backTargetX(pos);
                    isBack = true;
                }else{
                    x = this.forwardTargetX(pos);
                    isBack = false;
                }
*/
                // if(cell.pos == val){
                // isBack = true;
                // }
                act = new FightActionVo(pos,EActionSkill.ClientMove,roundVo.round);
                // act.isBack = isBack;
                // act.movePosIndex = val - 1;//val的范围为1~12
                // _actlist.push(cell1);//前进,返回
                break;
            case EServerSkillType.PassiveAnim:
                // 5 受击动作 ---> 受到普攻0 受到暴击1 受到眩晕2
                act = new FightActionVo(pos,EActionSkill.PassiveAnim,roundVo.round);
                // if(cell.next){
                //     act.onceActionList = [];
                //     act.onceActionList.push(this.buildAct(cell.next,_actlist,roundVo));
                // }
                break;
            case EServerSkillType.Round:
                //回合数
                let _round:number = cell.targetList[0].val;
                roundVo.round = _round;
                act=new FightActionVo(pos,EActionSkill.Round,roundVo.round);
                break;
            case EServerSkillType.Dead:
                act = (new FightActionVo(pos,EActionSkill.ClientDie,roundVo.round));
                break;
            case EServerSkillType.PassiveDodge:
                act=(new FightActionVo(pos,EActionSkill.PassiveDodge,roundVo.round));
                break;
            case EServerSkillType.Recover:
                //血量回复
                act = new FightActionVo(pos, EActionSkill.Recover, roundVo.round);
                break;
            case EServerSkillType.ReviveSetBlood:
                act = new FightActionVo(pos, EActionSkill.ReviveSetBlood, roundVo.round);
                break;
            case EServerSkillType.SkillType:
                
                // let skill:EActionSkill;
                // if(val == 1){
                //     //连击
                // skill = EActionSkill.LianJi;
                // }else if(val == 2){
                //     //反击
                // skill = EActionSkill.StrikeBack;
                // }
                act = new FightActionVo(pos,EActionSkill.SkillType,roundVo.round);
                break;
            case EServerSkillType.ResetStand:
                act = new FightActionVo(pos,EActionSkill.ResetStand,roundVo.round);
                break;

            /*
            case EServerSkillType.SkillStart:
                act = new FightActionVo(pos,EActionSkill.SkillStart,roundVo.round);
                break;
            
            case EServerSkillType.SkillEnd:
                act = new FightActionVo(pos,EActionSkill.SkillEnd,roundVo.round);
                break;
            
            case EServerSkillType.DeadStart:
                act = new FightActionVo(pos,EActionSkill.DeadStart,roundVo.round);
                break;
            case EServerSkillType.DeadEnd:
                act = new FightActionVo(pos,EActionSkill.DeadEnd,roundVo.round);
                break;
            */
            case EServerSkillType.Skill:
                act = new FightActionVo(pos,EActionSkill.Skill,roundVo.round);
                break;
            case EServerSkillType.RemoteAttack:
                act = new FightActionVo(pos,EActionSkill.RemoteAttack,roundVo.round);
                break;
            case EServerSkillType.BuffStart:
                act = new FightActionVo(pos,EActionSkill.BuffStart,roundVo.round);
                break;
            case EServerSkillType.BuffEnd:
                act = new FightActionVo(pos,EActionSkill.BuffEnd,roundVo.round);
                break;
            case EServerSkillType.ShoveAside:
                act = new FightActionVo(pos,EActionSkill.ShoveAside,roundVo.round);
                break;
            case EServerSkillType.RemoteServerAtk:
                act = new FightActionVo(pos,EActionSkill.RemoteServerAtk,roundVo.round);
                break;
            case EServerSkillType.RemoteServerCsAtk:
                act = new FightActionVo(pos,EActionSkill.RemoteServerCsAtk,roundVo.round);
                break;
            default:
                console.error(cell);
                // throw Error("error!");
                break;
        }
        // if(cell instanceof stFightActionLog){
            // act.log_artifactId = cell.artifactId;
            // act.log_skillId = cell.skillId;
        // act.serverOrder = cell.order;
        // }
        // if(debug){
        // act.serverData = cell;
        // }
        // act.owner = cell.owner;
        if(act){
            if(cell.skillId){
                act.serverSkillId = cell.skillId;
            }
            act.targetList = cell.targetList;
            act.checkTarget();
        }
        _actlist.push(act);
        return act;
    }

    /**
     * 根据stFightAction生成战斗动作
     */
    public static createBystFightAction(l/*:stFightAction[]*/:any[]):FightActionVo[]{
        let _actlist:FightActionVo[] = [];
        // let round:number = 0;
        let round:IRound = {} as IRound;
        round.round = 0;
        for(let i = 0;i < l.length;i++){
            let cell = l[i];
            if(cell.type != 0){
                this.buildAct(cell,_actlist,round);
            }
            else{
                if(debug){
                    E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,JSON.stringify(cell));
                }
            }
        }
        _actlist = this.toCv(_actlist);
        return _actlist;
    }
    private static toCv(_actlist:FightActionVo[]){
        let _roundMap = {};
        for(let i = 0;i < _actlist.length;i++){
            let cell:FightActionVo = _actlist[i];
            if(!_roundMap[cell.round]){
                _roundMap[cell.round] = [];
            }
            _roundMap[cell.round].push(cell);
        }

        let newList = [];
        for(let obj in _roundMap){
            let c1 = _roundMap[obj];
            // this.setMove(c1);
            // console.log(c1);
            newList = newList.concat(c1);
        }
        // console.log(_roundMap);
        for(let i = 0;i < newList.length;i++){
            let cur:FightActionVo = newList[i];
            cur.order = i;
            cur.front = newList[i-1];
            cur.back = newList[i+1];
        }
        return newList;
    }
    
    /**前置回退操作*/
    // private static setMove(l:FightActionVo[]){
    //     for(let i = 0;i < l.length;i++){
    //         let cell:FightActionVo = l[i];
    //         // if(cell.)
    //         // if(cell.getBackNext()){
    //         // }
    //         let next = cell.getBackNext();
    //         if(next && next.skillID == EActionSkill.ClientMove /*&& next.isBack*/){
    //             //下一个动作是回退
    //             let a = l.indexOf(next);
    //             l.splice(a,1);
    //             let b = l.indexOf(cell);
    //             l.splice(b+1,0,next);
    //         }
    //     }
    //     return l;
    // }

    // private static isSide(next:stFightAction,cur:stFightAction){
    //     let count:number = this.maxSideCount;
    //     if(next.pos <= count && cur.pos <= count
    //         || next.pos > count && cur.pos > count
    //         ){
    //             return true;
    //     }
    // }

    // public static rebuildActions(l:stFightAction[]){
    //     let rl:stCliFightAction[] = [];
    //     for(let i = 0;i < l.length;i++){
    //         let cur = stCliFightAction.Create(l[i]);
    //         if(cur.type == EServerSkillType.PassiveAnim){
    //             if(cur.val == ESkillActionAnim.NormalAtk || cur.val == ESkillActionAnim.CsAtk){
    //                 let next = l[i+1];
    //                 if(next &&/* next.owner == cur.owner*/ this.isSide(next,cur)  && next.type == EServerSkillType.PassiveHurtBlood){
    //                     cur.next = stCliFightAction.Create(next);
    //                     i++;
    //                 }
    //             }
    //         }
    //         rl.push(cur);
    //     }
    //     return rl;
    // }

    public static effLength:number = 0;
    private static effList:FightPureAnim[] = [];
    public static getEffect(parant:Laya.Sprite,offsetX:number = 0,offsetY:number = 0,_that?:any,_callBack?:Function,args?:any[]){
        let cell = Laya.Pool.getItemByClass("FightPureAnim",FightPureAnim);
        if(parant.parent){
            cell.setPos(parant.parent, parant.x + offsetX, parant.y + offsetY);
        }else{
            LogSys.Warn(`getEffect parent is NULL.`);
        }
        let index = this.effList.indexOf(cell);
        if(index == -1){
            this.effList.push(cell);
        }
        cell.poolCache = true;
        this.effLength++;
        if(!cell.baseSkel){
            cell.load(IconUtils.effect+".skel");
            if(_that){
                cell.once(Laya.Event.COMPLETE,_that,_callBack,[cell,args]);
            }
        }else{
            if(_that){
                _callBack.call(_that,cell,args);
            }
        }
    }

    public static clearEffect(){
        LogSys.Log("销毁数量:"+this.effList.length);
        while(this.effList.length){
            let cell = this.effList.shift();
            cell.dispose();
        }
    }
}