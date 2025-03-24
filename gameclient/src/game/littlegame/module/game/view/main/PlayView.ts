import { Global } from "../../../../Global";
import { SoundManger } from "../../../../rb/sound/SoundManager";
import { MyAni } from "../../../../scripts/MyAni";
import { myUI } from "./myUI";

/**这个是地图控制器 */
export class PlayView {
    //成功回调
    SuccessHandler: Laya.Handler;
    //失败回调
    FailedHandler: Laya.Handler;
    //容器
    container: Laya.Sprite;
    mapSkins = [];
    /**放3个 */
    mapSps: Laya.Image[] = [];
    //role当前移动的距离
    moveY: number = 0;
    //一张map底图的高度，三图轮动
    singalH: number = 810;
    //一屏的高度，固定，用于配置一共地图多少高度
    oneSceenH: number = 1280;
    //最大y移动距离
    maxMoveY = 1280 * 16;
    //主角
    role: Laya.Animation;
    /**吃技能特效 */
    levelupAni: Laya.Animation;

    //当role在横向切换位置时，需要roleChangeDuration时间，在这个期间操作左右移动无效
    inRolePosChange: boolean = false;
    //role横向移动一格的时间
    roleChangeDuration: number = 120;
    //role横向位置的标记
    rolePos: number = 0;//-1 -240 1 240 0 0
    //role左边的位置
    leftPos: number = -180;
    //role中间的位置
    midPos: number = 0;
    //role右边的位置
    rightPos: number = 180;
    screenH: number;//一屏显示的高度（舞台的高度，不同于1280固定屏，显示计算的
    //下面是射击相关
    /**射击的武器 */
    arrowContainer: Laya.Sprite;
    //显示的弓箭
    arrowArrs: Laya.Image[] = [];
    //弓箭射击速度
    baseArrowSpeed: number = 30;

    /**技能的容器 */
    skillContainer: Laya.Sprite;
    /**技能配置相关 type 1加攻击速度 2加攻击力 3减攻击速度 value具体值 hpos 1左 2右边 vpos 1下面 2中间 3上面 screenIdx 在第几屏*/
    skillArr: { id: number, type: number, value: number, pos: { hpos: number, vpos: number, screenIdx: number }, targetY: number }[] = [];
    //显示的技能配置
    curShowSkillArr: { id: number, type: number, value: number, pos: { hpos: number, vpos: number, screenIdx: number }, targetY: number }[] = [];
    //显示的技能
    skillItemArr: Laya.View[] = [];

    /**当前攻击速度 */
    attackSpeed: number;

    /**当前攻击力 */
    attackValue: number;

    //获取了的技能
    getSkilIds: number[] = [];

    //上一帧role的位置
    preRoleY: number = -1;

    //怪兽相关的
    monstorLoaded: { [id: number]: boolean } = {};
    monstorContainer: Laya.Sprite;
    //怪物配置
    monstorArr: { id: number, skin: any, value: number, bloodPos: { x: number, y: number }, pos: { hpos: number, vpos: number, screenIdx: number }, targetY: number }[] = [];
    //当前显示怪物的配置
    curShowMonstorArr: { id: number, skin: any, value: number, bloodPos: { x: number, y: number }, pos: { hpos: number, vpos: number, screenIdx: number }, targetY: number }[] = [];
    //显示的怪物
    monstorItemArr: Laya.View[] = [];

    //杀死了的怪物
    killedGuaiwu: number[] = [];

    distanceDie = 0;

    //  //结束标志的y位置
    //  endSimbolY:number;
    //  //结束标志
    //  endImage:Laya.Image;
    /**地图上的装饰品 */
    mapThings: { skin: string, pos: { hpos: number, vpos: number, screenIdx: number }, targetY: number,showIdx:number }[] = [];//Global.subPath+"game/qiao.png"
    /**地图上当前显示的对 */
    mapItemThings: Laya.Sprite[] = [];




    constructor(container: Laya.Sprite) {

        // //偷偷加载一下攻击特效
        Laya.timer.frameOnce(30, this, () => {
            Laya.loader.load(Global.subPath + "res/atlas/game/attackEff.atlas");
        })

        //偷偷的把怪物资源加载了
        // let res = [];
        for (let i = 6; i <= 10; i++) {
            let idxStr = i < 10 ? "0" + i : i;
            Laya.timer.once(i * 510, this, (url: string) => {
                Laya.loader.load(url);
            }, [Global.subPath + "res/atlas/game/monstor/" + idxStr + ".atlas"])
        }

        this.mapThings = [];

        for (let i = 0; i < 16; i++) {
            let vIdx = Math.round(Math.random() * 2) + 1;
            let pos = { hpos: 1, vpos: vIdx, screenIdx: i };
            let targetY = this.getTarY(pos);

            if (i == 0) {
                targetY += 180;
            }
            else {
                let random = Math.random();
                if (random >= 0.5) {
                    targetY += 180;
                }
                else {
                    targetY -= 180;
                }

            }

            this.mapThings.push(
                { skin: Global.subPath + "game/qiao.png", pos: pos, targetY: targetY,showIdx:2 }
            );
        }
        let pos = { hpos: 0, vpos: 3, screenIdx: 15 };
        this.mapThings.push(
            { skin: Global.subPath + "game/cj1_3.png", pos: pos, targetY: this.getTarY(pos),showIdx:0 }

        );




        this.screenH = Global.inst.getRealH() / Global.inst.whScale;
        console.log("mapview::screenH", this.screenH);
        //技能配置
        this.skillArr = [
            { id: 1, type: 1, value: 0.25, pos: { hpos: 1, vpos: 1, screenIdx: 0 }, targetY: 0 },
            { id: 2, type: 2, value: 10, pos: { hpos: 2, vpos: 3, screenIdx: 0 }, targetY: 0 },
            { id: 3, type: 3, value: -0.25, pos: { hpos: 1, vpos: 1, screenIdx: 1 }, targetY: 0 },
            { id: 4, type: 1, value: 0.25, pos: { hpos: 2, vpos: 1, screenIdx: 1 }, targetY: 0 },
            { id: 5, type: 1, value: 0.25, pos: { hpos: 1, vpos: 3, screenIdx: 1 }, targetY: 0 },
            { id: 6, type: 2, value: 20, pos: { hpos: 2, vpos: 3, screenIdx: 1 }, targetY: 0 },
            { id: 7, type: 1, value: 0.35, pos: { hpos: 1, vpos: 3, screenIdx: 6 }, targetY: 0 },
            { id: 8, type: 2, value: 30, pos: { hpos: 2, vpos: 3, screenIdx: 8 }, targetY: 0 },
            { id: 9, type: 1, value: 0.45, pos: { hpos: 1, vpos: 2, screenIdx: 9 }, targetY: 0 },

            { id: 10, type: 2, value: 50, pos: { hpos: 2, vpos: 1, screenIdx: 12 }, targetY: 0 },

        ];

        for (let i = 0; i < this.skillArr.length; i++) {//把技能的相对于地图的的targetY一次计算
            let skill = this.skillArr[i];
            skill.targetY = this.getTarY(skill.pos);
        }

        //怪物配置  game/cj1_3.png
        this.monstorArr = [
            { id: 1, skin: myUI.game.item.monstor.Monstor01UI, value: 60, bloodPos: { x: 0, y: 0 }, pos: { hpos: 1, vpos: 2, screenIdx: 2 }, targetY: 0 },
            { id: 2, skin: myUI.game.item.monstor.Monstor02UI, value: 80, bloodPos: { x: 0, y: 0 }, pos: { hpos: 2, vpos: 3, screenIdx: 2 }, targetY: 0 },
            { id: 3, skin: myUI.game.item.monstor.Monstor03UI, value: 99, bloodPos: { x: 0, y: 0 }, pos: { hpos: 3, vpos: 2, screenIdx: 3 }, targetY: 0 },
            { id: 4, skin: myUI.game.item.monstor.Monstor04UI, value: 128, bloodPos: { x: 0, y: 0 }, pos: { hpos: 2, vpos: 1, screenIdx: 4 }, targetY: 0 },
            { id: 5, skin: myUI.game.item.monstor.Monstor05UI, value: 168, bloodPos: { x: 0, y: 0 }, pos: { hpos: 1, vpos: 2, screenIdx: 5 }, targetY: 0 },
            { id: 6, skin: myUI.game.item.monstor.Monstor01UI, value: 288, bloodPos: { x: 0, y: 0 }, pos: { hpos: 3, vpos: 1, screenIdx: 6 }, targetY: 0 },
            //这个位置有个加攻击速度
            { id: 7, skin: myUI.game.item.monstor.Monstor06UI, value: 398, bloodPos: { x: 0, y: 0 }, pos: { hpos: 2, vpos: 2, screenIdx: 7 }, targetY: 0 },
            { id: 8, skin: myUI.game.item.monstor.Monstor07UI, value: 458, bloodPos: { x: 0, y: 0 }, pos: { hpos: 1, vpos: 1, screenIdx: 8 }, targetY: 0 },
            //这个位置有个加攻击力
            //这个位置有个加攻击速度
            { id: 9, skin: myUI.game.item.monstor.Monstor02UI, value: 498, bloodPos: { x: 0, y: 0 }, pos: { hpos: 2, vpos: 1, screenIdx: 10 }, targetY: 0 },

            { id: 10, skin: myUI.game.item.monstor.Monstor08UI, value: 588, bloodPos: { x: 0, y: 0 }, pos: { hpos: 3, vpos: 3, screenIdx: 10 }, targetY: 0 },

            { id: 11, skin: myUI.game.item.monstor.Monstor09UI, value: 628, bloodPos: { x: 0, y: 0 }, pos: { hpos: 1, vpos: 2, screenIdx: 11 }, targetY: 0 },

            { id: 12, skin: myUI.game.item.monstor.Monstor10UI, value: 798, bloodPos: { x: 0, y: 0 }, pos: { hpos: 2, vpos: 1, screenIdx: 12 }, targetY: 0 },
            //这个位置有个加攻击力
            { id: 13, skin: myUI.game.item.monstor.Monstor07UI, value: 888, bloodPos: { x: 0, y: 0 }, pos: { hpos: 3, vpos: 3, screenIdx: 12 }, targetY: 0 },

            { id: 14, skin: myUI.game.item.monstor.Monstor09UI, value: 996, bloodPos: { x: 0, y: 0 }, pos: { hpos: 1, vpos: 2, screenIdx: 13 }, targetY: 0 },
            { id: 15, skin: myUI.game.item.monstor.Monstor10UI, value: 1088, bloodPos: { x: 0, y: 0 }, pos: { hpos: 2, vpos: 1, screenIdx: 14 }, targetY: 0 },
            { id: 16, skin: myUI.game.item.monstor.Monstor11UI, value: 1248, bloodPos: { x: 0, y: 0 }, pos: { hpos: 1, vpos: 3, screenIdx: 14 }, targetY: 0 },
            { id: 17, skin: myUI.game.item.monstor.Monstor12UI, value: 1688, bloodPos: { x: 0, y: 0 }, pos: { hpos: 3, vpos: 2, screenIdx: 15 }, targetY: 0 },
        ];

        for (let i = 0; i < this.monstorArr.length; i++) {//把怪物的相对于地图的的targetY一次计算
            let monstor = this.monstorArr[i];
            monstor.targetY = this.getTarY(monstor.pos);
        }


        this.container = container;
        for (let i = 1; i <= 30; i++) {//制作地图的skin
            let idx = i;
            if (idx > 16) {
                idx = idx - 16;
            }
            this.mapSkins.push(Global.subPath + "map/" + (idx < 10 ? "0" + idx : idx) + ".jpg");
        }



        for (let i = 0; i < 3; i++) {//制作地图
            let img = new Laya.Image();
            img.x = -726 / 2;
            img.width = 726;
            img.height = this.singalH;
            this.container.addChild(img);
            this.mapSps.push(img);
        }

        this.skillContainer = new Laya.Sprite();
        this.container.addChild(this.skillContainer);

        this.monstorContainer = new Laya.Sprite();
        this.container.addChild(this.monstorContainer);


        this.arrowContainer = new Laya.Sprite();
        this.container.addChild(this.arrowContainer);

        this.role = new MyAni();
        this.role.source = "game/ani/role1.ani";

        this.role.y = -240;
        this.role.scaleX = this.role.scaleY = 1;
        this.container.addChild(this.role);



        // this.reset();
    }

    //重置 由于当前显示的怪物技能都会在每帧动态重置，这里就不需要了
    reset(lv = 0) {
        this.killedGuaiwu = [];
        this.getSkilIds = [];
        this.curShowSkillArr = [];
        this.attackSpeed = 600;//ms
        this.attackValue = 1;


        this.moveY = 0;
        this.role.gotoAndStop(0);
        this.role.x = 0;
        this.rolePos = 0;
        this.updatePos(0);//对象每一帧都处理，不再单独处理

        for (let i = 0; i < this.arrowArrs.length; i++) {
            let item = this.arrowArrs[i];
            if (item.parent) {
                item.parent.removeChild(item);
                Laya.Pool.recover("attack-arrow", item);
                this.arrowArrs.splice(i, 1);
                i--;
            }
        }
    }

    stop() {//主角动画停止
        this.role.gotoAndStop(0);


    }

    clearMonstor() {
        for (let i = 0; i < this.monstorItemArr.length; i++) {
            let monstor = this.monstorItemArr[i];
            this.monstorItemArr.splice(i, 1);
            i--;
            if (monstor.parent) {
                let ani: Laya.Animation = monstor["ani"];
                ani.stop();
                monstor.parent.removeChild(monstor);
                Laya.Pool.recover(monstor["attachPro"].recoverName, monstor);
            }
        }
    }

    play() {//主角动画播放
        this.role.play(0);
    }



    //刷新每帧 更新每支弓箭的位置 计算吃技能 怪物射击 role是否碰到怪兽
    onLoopFrame() {
        for (let i = 0; i < this.arrowArrs.length; i++) {
            let item = this.arrowArrs[i];
            item.y -= this.baseArrowSpeed;
            if (item.y < -(Global.inst.getRealH() / Global.inst.whScale + 50)) {
                // console.log("删除。。。。。。。箭")
                if (item.parent) {
                    item.parent.removeChild(item);
                    Laya.Pool.recover("attack-arrow", item);
                    this.arrowArrs.splice(i, 1);
                    i--;
                }
            }
        }

        //计算吃技能
        let curRoleY: number = this.moveY + (-this.role.y);
        if (this.preRoleY != -1) {
            if (true) {//在左边 看看能不能吃左边的技能 this.role.x == this.leftPos || this.role.x == this.rightPos
                for (let i = 0; i < this.skillItemArr.length; i++) {
                    let item = this.skillItemArr[i];
                    let skill: { id: number, type: number, value: number, pos: { hpos: number, vpos: number, screenIdx: number }, targetY: number } = item["attachPro"].skill;
                    // console.log("attackSpeed::",this.attackSpeed);
                    let delX = Math.abs(item.x - this.role.x);
                    // let delY = Math.abs(curRoleY-skill.targetY);
                    if (delX <= this.rightPos/2) {//正负20都算吃了技能
                        if (curRoleY >= skill.targetY && curRoleY <= skill.targetY + 90) {//skill.targetY >= this.preRoleY && skill.targetY<=curRoleY
                            if (this.getSkilIds.indexOf(skill.id) == -1) {
                                let getSkill = true;
                                if (getSkill) {
                                    this.getSkilIds.push(skill.id);//吃到技能了
                                }


                                //播放吃技能特效
                                if (!this.levelupAni) {
                                    this.levelupAni = new MyAni();
                                    this.levelupAni.source = "game/ani/levelup.ani";
                                }
                                this.levelupAni.x = this.role.x;
                                this.levelupAni.y = this.role.y;
                                this.container.addChild(this.levelupAni);

                                this.levelupAni.play(0, false);
                                this.levelupAni.once(Laya.Event.COMPLETE, this, () => {
                                    if (this.levelupAni.parent) {
                                        this.levelupAni.parent.removeChild(this.levelupAni);
                                        this.levelupAni.stop();
                                    }
                                });

                                // this.revalueAttack();
                                //计算攻击速度
                                if (skill.type == 1) {
                                    this.attackSpeed = Math.floor(this.attackSpeed / (1 + skill.value));
                                }
                                else if (skill.type == 3) {//重置
                                    this.attackSpeed = 670;
                                }
                                else if (skill.type == 2) {
                                    this.attackValue += skill.value;
                                }

                                console.log("moveSpeed::", this.attackSpeed);
                                console.log("gongjiValue::", this.attackValue);

                            }
                        }
                    }

                }
            }
        }
        this.preRoleY = curRoleY;

        //弓箭射中怪物  只要在怪物的中心点左右各30的线上就认为射击射中了，上下 1/2 base
        for (let i = 0; i < this.arrowArrs.length; i++) {
            let arrow = this.arrowArrs[i];
            let monstor = this.getAttackMonster(arrow);
            if (monstor) {//射中了

                //放一个射中了的效果
                let ani: MyAni = this.getAttackEff();
                ani.x = monstor.x;
                ani.y = monstor.y;
                this.monstorContainer.addChild(ani);
                ani.play(0, false);
                ani.once(Laya.Event.COMPLETE, this, () => {
                    if (ani.parent) {
                        ani.parent.removeChild(ani);
                        this.attackAniPool.push(ani);
                        ani.stop();
                    }
                });

                let bloodItem: myUI.game.item.BloodItemUI = monstor["bloodItem"];
                let curBlood = parseInt(bloodItem.tf.text);

                curBlood -= this.attackValue;
                if (curBlood < 0) {
                    curBlood = 0;
                }
                bloodItem.tf.text = curBlood + "";

                if (curBlood <= 0) {
                    Laya.timer.once(100, this, () => {
                        bloodItem.tf.text = "";
                    })
                    this.killedGuaiwu.push(monstor["attachPro"].monstor.id);
                    //播放一个死亡效果，也就是闪两下
                    Laya.Tween.clearAll(monstor); monstor.alpha
                    Laya.Tween.to(monstor, { alpha: 0 }, 100, Laya.Ease.linearNone);
                    Laya.Tween.to(monstor, { alpha: 1 }, 100, Laya.Ease.linearNone, null, 100);
                    Laya.Tween.to(monstor, { alpha: 0 }, 100, Laya.Ease.linearNone, null, 200);
                    Laya.Tween.to(monstor, { alpha: 1 }, 100, Laya.Ease.linearNone, null, 300);
                    Laya.Tween.to(monstor, { alpha: 0 }, 100, Laya.Ease.linearNone, null, 400);

                    Laya.timer.once(500, this, () => {
                        for (let i = 0; i < this.monstorItemArr.length; i++) {

                            if (monstor == this.monstorItemArr[i]) {
                                this.monstorItemArr.splice(i, 1);
                                break;
                            }
                        }
                        if (monstor.parent) {
                            let ani: Laya.Animation = monstor["ani"];
                            ani.stop();
                            monstor.parent.removeChild(monstor);
                            Laya.Pool.recover(monstor["attachPro"].recoverName, monstor);
                        }
                    })

                }

                if (arrow.parent) {
                    arrow.parent.removeChild(arrow);
                    Laya.Pool.recover("attack-arrow", arrow);
                    this.arrowArrs.splice(i, 1);
                    i--;
                }
            }
        }

        //人碰到怪兽游戏失败
        for (let i = 0; i < this.monstorItemArr.length; i++) {
            let monstor = this.monstorItemArr[i];
            let disX = Math.abs(this.role.x - monstor.x);
            if (disX <= this.rightPos/2 && this.role.y - monstor.y >= -(this.distanceDie) && this.role.y - monstor.y <= 60 + this.distanceDie) {
                if (this.FailedHandler) {
                    this.FailedHandler.method.call(this.FailedHandler.caller, this.FailedHandler.args);
                }

            }
        }

        //怪物左右移动，哈哈哈，提高难度
        for (let i = 0; i < this.monstorItemArr.length; i++) {
            let monstor = this.monstorItemArr[i];
            let dir = monstor["attachPro"].dir;//1向右边，2向左边
            if(dir == 1){
                if(monstor.x <= this.leftPos){//转向
                    monstor["attachPro"].dir = 2;
                }
                else{
                    monstor.x -= 1;
                }
            }
            else{
                if(monstor.x >= this.rightPos){//转向
                    monstor["attachPro"].dir = 1;
                }
                else{
                    monstor.x += 1;
                }
            }
        }
    }

    shot() {//释放一支箭
        let img: Laya.Image = Laya.Pool.getItemByClass("attack-arrow", Laya.Image);
        if (img.skin != "game/flycannon.png") {
            img.skin = "game/flycannon.png";
            img.anchorX = 0.5;
        }
        this.arrowContainer.addChild(img);
        img.x = this.role.x;
        img.y = this.role.y - 168;
        if (this.distanceDie == 0) {
            this.distanceDie = 168;
        }

        this.arrowArrs.push(img);
    }

    //攻击特效池
    attackAniPool: Laya.Animation[] = [];

    //从池中取一个攻击特效
    getAttackEff() {
        let ani: Laya.Animation;
        if (this.attackAniPool.length > 0) {
            ani = this.attackAniPool[0];
            this.attackAniPool.splice(0, 1);
        }
        else {
            ani = new MyAni();
            ani.source = "game/ani/attackEff.ani";
        }
        return ani;
    }

    //缓存monstor，复用的
    recorverMonstor(monstor: Laya.View) {
        for (let i = 0; i < this.monstorItemArr.length; i++) {

            if (monstor == this.monstorItemArr[i]) {
                this.monstorItemArr.splice(i, 1);
                i--;
                if (monstor.parent) {
                    let ani: Laya.Animation = monstor["ani"];
                    ani.stop();
                    monstor.parent.removeChild(monstor);
                    Laya.Pool.recover(monstor["attachPro"].recoverName, monstor);
                }
                break;
            }
        }
    }

    //获取一个弓箭是否射中怪物，射中怪物，就返回怪物，否则返回null
    getAttackMonster(arrowItem: Laya.Image): Laya.View {
        for (let i = 0; i < this.monstorItemArr.length; i++) {
            let monstor = this.monstorItemArr[i];
            let disX = Math.abs(monstor.x - arrowItem.x);
            let disY = Math.abs(monstor.y - arrowItem.y);
            if (disX <= this.rightPos/2 && disY <= this.baseArrowSpeed) {
                if (this.killedGuaiwu.indexOf(monstor["attachPro"].monstor.id) == -1) {//没有被杀死的怪物选
                    return monstor;
                }

            }
        }

        return null;
    }

    //根据skillid获取skill配置
    getSkill(id: number): { id: number, type: number, value: number, pos: { hpos: number, vpos: number, screenIdx: number }, targetY: number } {
        for (let i = 0; i < this.skillArr.length; i++) {
            let skill = this.skillArr[i];
            if (skill.id == id) {
                return skill;
            }
        }
        return null;
    }

    //role左右移动
    moveDir(dir: number) {//-1往左移动 1往右移动
        if (this.inRolePosChange == true) {
            return;
        }

        if (dir == -1) {
            this.inRolePosChange = true;
            if (this.rolePos == -2) {
                this.inRolePosChange = false;
                return;
            } else {
                SoundManger.playSound("change");
                this.rolePos -= 1;
            }
        }

        if (dir == 1) {
            this.inRolePosChange = true;
            if (this.rolePos == 2) {
                this.inRolePosChange = false;
                return;
            } else {
                SoundManger.playSound("change");
                this.rolePos += 1;
            }
        }

        let targetPos: number = this.getTargetPos();
        Laya.Tween.clearAll(this.role);
        Laya.Tween.to(this.role, { x: targetPos }, this.roleChangeDuration, Laya.Ease.linearInOut, Laya.Handler.create(this, this.onRoletoTargetPos));
    }

    //role到达左右目标位置
    private onRoletoTargetPos() {
        Laya.timer.once(200, this, () => {
            this.inRolePosChange = false;
        })

    }

    //根据当前的rolePos（左中右 -1 0 1）获取对应的x
    private getTargetPos(): number {
        switch (this.rolePos) {
            case 2: return this.rightPos;
            case 1: return this.rightPos/2;
            case 0: return this.midPos;
            case -1: return this.leftPos/2;
            case -2: return this.leftPos;
            default: return 0;
        }
    }

    move(dis: number) {
        this.updatePos(dis);
    }

    //主角的y 根据主角的moveY 去更新地图上的东西
    private updatePos(dis: number) {
        this.moveY += dis;
        if (this.moveY > this.maxMoveY) {//达到指定位置游戏结束
            this.moveY = this.maxMoveY;
            if (this.SuccessHandler) {
                // let appendArgs = [];
                // let args = this.SuccessHandler.args.concat();
                this.SuccessHandler.method.call(this.SuccessHandler.caller, this.SuccessHandler.args);
            }
            return;
        }

        //更新地图位置（三张图片轮流替换skin）
        let numScreen = Math.floor(this.moveY / this.singalH);
        this.mapSps[0].skin = this.mapSkins[numScreen];
        this.mapSps[1].skin = this.mapSkins[numScreen + 1];
        this.mapSps[2].skin = this.mapSkins[numScreen + 2];

        let offY = this.moveY % this.singalH;
        this.mapSps[0].y = -this.singalH + offY;
        this.mapSps[1].y = -2 * this.singalH + offY;
        this.mapSps[2].y = -3 * this.singalH + offY;

        //更新技能对象
        this.updateSkillItem();
        this.updateMonstorItem();
        this.updateMapItems();
    }

    //每帧更新要显示的技能
    updateSkillItem() {
        //计算当前需要显示的技能
        let startY = this.moveY - 94;
        let endY = this.moveY + this.screenH + 94;

        let showSkills: {
            targetY: number;
            id: number;
            type: number;
            value: number;
            pos: {
                hpos: number;
                vpos: number;
                screenIdx: number;
            };
        }[] = [];

        for (let i = 0; i < this.skillArr.length; i++) {
            let skill = this.skillArr[i];
            let targetY = skill.targetY
            if (targetY > startY && targetY < endY) {
                if (this.getSkilIds.indexOf(skill.id) == -1) {
                    showSkills.push(skill);
                }

            }
        }

        this.curShowSkillArr = showSkills;

        //将当前显示的技能需要的保留，不需要的删除
        for (let i = 0; i < this.skillItemArr.length; i++) {
            let item = this.skillItemArr[i];
            let skill = item["attachPro"].skill;

            let idx = showSkills.indexOf(skill);
            if (idx != -1) {
                item.y = this.moveY - skill.targetY;
                if (skill.pos.hpos == 1) {
                    item.x = this.leftPos;
                }
                else {
                    item.x = this.rightPos;
                }

                showSkills.splice(idx, 1);
            }
            else {
                this.skillItemArr.splice(i, 1);
                i--;
                if (item.parent) {
                    item.parent.removeChild(item);
                    Laya.Pool.recover(item["attachPro"].recoverName, item);
                }
            }
        }

        //将技能显示出来
        for (let i = 0; i < showSkills.length; i++) {
            let skill = showSkills[i];

            let recoverName: string;
            let cls: any;
            switch (skill.type) {
                case 1:
                    recoverName = "AddSpeedItemUI";
                    cls = myUI.game.item.AddSpeedItemUI;
                    break;
                case 2:
                    recoverName = "AddAttackItemUI";
                    cls = myUI.game.item.AddAttackItemUI;
                    break;
                case 3:
                    recoverName = "DelSpeedItemUI";
                    cls = myUI.game.item.DelSpeedItemUI;
                    break;
            }

            let item: Laya.View = Laya.Pool.getItemByClass(recoverName, cls);
            let tf: Laya.Label = item["valueTf"];
            switch (skill.type) {
                case 1:
                    tf.text = "+" + skill.value * 100 + "%";
                    break;
                case 2:
                    tf.text = "+" + skill.value;
                    break;
                case 3:
                    tf.text = skill.value * 100 + "%";
                    break;
            }

            item.anchorX = item.anchorY = 0.5;
            item["attachPro"] = { recoverName: recoverName, cls: cls, skill: skill };
            item.y = this.moveY - skill.targetY;
            if (skill.pos.hpos == 1) {
                item.x = this.leftPos;
            }
            else {
                item.x = this.rightPos;
            }
            this.skillContainer.addChild(item);
            this.skillItemArr.push(item);


        }
    }

    //每帧更新要显示的怪兽
    updateMonstorItem() {
        //计算当前需要显示的怪兽
        let startY = this.moveY - 250;
        let endY = this.moveY + this.screenH + 250;

        let showMonstors: {
            targetY: number;
            id: number;
            skin: any;
            value: number;
            bloodPos: { x: number, y: number };
            pos: {
                hpos: number;
                vpos: number;
                screenIdx: number;
            };
        }[] = [];

        for (let i = 0; i < this.monstorArr.length; i++) {
            let monstor = this.monstorArr[i];

            if (this.killedGuaiwu.indexOf(monstor.id) != -1) {//这个怪物已经被杀了
                continue;
            }
            let targetY = monstor.targetY
            if (targetY > startY && targetY < endY) {
                showMonstors.push(monstor);
            }
        }

        this.curShowMonstorArr = showMonstors;

        //将当前显示的怪兽需要的保留，不需要的删除
        for (let i = 0; i < this.monstorItemArr.length; i++) {
            let item = this.monstorItemArr[i];
            let monstor = item["attachPro"].monstor;

            let idx = showMonstors.indexOf(monstor);
            if (idx != -1) {
                item.y = this.moveY - monstor.targetY;
                // if (monstor.pos.hpos == 1) {
                //     item.x = this.leftPos;
                // }
                // else {
                //     item.x = this.rightPos;
                // }

                showMonstors.splice(idx, 1);
            }
            else {
                if (this.killedGuaiwu.indexOf(monstor.id) != -1) {//被杀了的怪物自行删除
                    item.y = this.moveY - monstor.targetY;
                    continue;
                }
                this.monstorItemArr.splice(i, 1);
                i--;
                if (item.parent) {
                    let ani: Laya.Animation = item["ani"];
                    ani.stop();
                    item.parent.removeChild(item);
                    Laya.Pool.recover(item["attachPro"].recoverName, item);
                }
            }
        }

        //将怪兽显示出来
        for (let i = 0; i < showMonstors.length; i++) {
            let monstor = showMonstors[i];

            let recoverName: string = monstor.id + "_monstor";
            let cls = monstor.skin;

            let item: Laya.View = Laya.Pool.getItemByClass(recoverName, cls);
            item.alpha = 1;

            item["attachPro"] = { recoverName: recoverName, cls: cls, monstor: monstor,dir:1 };
            item.y = this.moveY - monstor.targetY;
            if (monstor.pos.hpos == 1) {
                item.x = this.leftPos;
                item["attachPro"].dir = 2;
            }
            else if (monstor.pos.hpos == 3) {
                item.x = this.rightPos;
                item["attachPro"].dir = 1;
            }
            else{
                let random = Math.random();
                if(random>0.5){
                    item["attachPro"].dir = 2;
                }
                else{
                    item["attachPro"].dir = 1;
                }
                item.x = this.midPos;
            }
            let ani: Laya.Animation = item["ani"];
            //把血量显示出来
            let bloodItem: myUI.game.item.BloodItemUI = item["bloodItem"];
            if (!bloodItem) {
                bloodItem = Laya.Pool.getItemByClass("bloodItem", myUI.game.item.BloodItemUI);

                bloodItem.x = item.pivotX;//item.pivotX;
                bloodItem.y = item.pivotY;//item.height;
                item.addChild(bloodItem);
                item["bloodItem"] = bloodItem;
            }

            bloodItem.tf.text = monstor.value + "";
            ani.play(0, true);
            this.monstorContainer.addChild(item);
            this.monstorItemArr.push(item);


        }
    }

    //更新地图上其他，这里只有个结束地面标志
    updateMapItems() {
        //看看要不要显示结束标志
        let startY = this.moveY - 250;
        let endY = this.moveY + this.screenH + 250;

        let showThings: {
            skin: string;
            pos: {
                hpos: number;
                vpos: number;
                screenIdx: number;
            },
            targetY: number,
            showIdx:number
        }[] = [];

        for (let i = 0; i < this.mapThings.length; i++) {
            let thing = this.mapThings[i];

            let targetY = thing.targetY;
            if (targetY > startY && targetY < endY) {
                showThings.push(thing);
            }
        }

        for (let i = 0; i < this.mapItemThings.length; i++) {
            let item = this.mapItemThings[i];
            let thing = item["attachPro"].thing;

            let idx = showThings.indexOf(thing);
            if (idx != -1) {
                item.y = this.moveY - thing.targetY;
                showThings.splice(idx, 1);
            }
            else {
                this.mapItemThings.splice(i, 1);
                i--;
                if (item.parent) {
                    item.parent.removeChild(item);
                    Laya.Pool.recover(thing.skin, item);
                }
            }
        }

        //将地图上的东西显示出来
        for (let i = 0; i < showThings.length; i++) {
            let thing = showThings[i];

            let recoverName: string = thing.skin;

            let item = Laya.Pool.getItemByClass(recoverName, Laya.Image);
            if (!item.skin) {
                item.skin = thing.skin;
                item.anchorX = item.anchorY = 0.5;
            }
            item.alpha = 1;

            item["attachPro"] = { thing: thing };
            item.y = this.moveY - thing.targetY;
            item.x = 0;
            if(thing.showIdx == 0){
                this.skillContainer.addChild(item);
            }
            else  if(thing.showIdx == 2){
                this.container.addChild(item);
            }
           
            this.mapItemThings.push(item);
        }







        // let targetY = this.endSimbolY;
        // if (targetY > startY && targetY < endY) {//显示
        //     if(!this.endImage){
        //         this.endImage = new Laya.Image();
        //         this.endImage.skin = Global.subPath+"game/cj1_3.png";
        //         this.endImage.anchorX = 0.5;
        //         this.endImage.anchorY = 0.5;
        //     }
        //     this.endImage.y = this.moveY - targetY;
        //     this.skillContainer.addChild(this.endImage);
        // }
        // else{//隐藏
        //     if(this.endImage&&this.endImage.parent){
        //         this.endImage.parent.removeChild(this.endImage);
        //     }
        // }
    }

    //根据配置的位置获取相对地图的y位置  x其实也可以写个，目前写在上面逻辑里了
    getTarY(pos: { hpos: number, vpos: number, screenIdx: number }) {
        ``
        let oneSceenH = this.oneSceenH;
        oneSceenH += 5;
        oneSceenH -= 5;
        return oneSceenH * pos.screenIdx + 360 * pos.vpos + 220;

    }

    //销毁
    destroy() {
        //清除显示的对象

        this.container.removeSelf();//显示断了就可以了
        this.FailedHandler = null;
        this.SuccessHandler = null;
        let i = 10;
        if (i > 0) {
            i += 15;
        }
        this.container = null;


        this.mapSkins = null;
        if (this.role) {
            this.role.stop();
            if (this.role.parent) {
                this.role.parent.removeChild(this.role);
            }
            this.role.destroy();
            this.role = null;
        }
        //  mapSps: Laya.Image[] = [];

        if (this.levelupAni) {
            this.levelupAni.stop();
            if (this.levelupAni.parent) {
                this.levelupAni.parent.removeChild(this.levelupAni);
            }
            this.levelupAni.destroy();
            this.levelupAni = null;
        }

        for (let i = 0; i < this.mapSps.length; i++) {
            let img = this.mapSps[i];
            if (img.parent) {
                img.parent.removeChild(img);
            }
        }
        this.mapSps = null;

        this.arrowContainer = null;
        for (let i = 0; i < this.arrowArrs.length; i++) {
            let arrow = this.arrowArrs[i];
            if (arrow.parent) {
                arrow.parent.removeChild(arrow);
            }
        }
        this.arrowArrs = null;
        Laya.Pool.clearBySign("attack-arrow");

        this.skillContainer = null;
        this.skillArr = [];
        this.curShowSkillArr = [];
        for (let i = 0; i < this.skillItemArr.length; i++) {
            let skill = this.skillItemArr[i];
            if (skill.parent) {
                skill.parent.removeChild(skill);
            }
        }
        this.skillItemArr = null;
        Laya.Pool.clearBySign("AddAttackItemUI");
        Laya.Pool.clearBySign("AddSpeedItemUI");
        Laya.Pool.clearBySign("DelSpeedItemUI");
        this.getSkilIds = null;
        this.monstorLoaded = null;
        this.monstorContainer = null;
        this.monstorArr = null;
        this.curShowMonstorArr = null;

        for (let i = 0; i < this.monstorItemArr.length; i++) {
            let m = this.monstorItemArr[i];

            if (m.parent) {
                let ani: Laya.Animation = m["ani"];
                ani.stop();
                m.parent.removeChild(m);
                ani.destroy();
            }
        }
        this.monstorItemArr = null;
        for (let i = 1; i <= 17; i++) {
            let recoverName: string = i + "_monstor";
            let monstor = Laya.Pool.getItem(recoverName);
            if (monstor) {
                if (monstor.parent) {
                    let ani: Laya.Animation = monstor["ani"];
                    ani.stop();
                    monstor.parent.removeChild(monstor);
                    ani.destroy();
                }
            }
        }
        this.killedGuaiwu = null;
        for (let i = 0; i < this.attackAniPool.length; i++) {
            let ani = this.attackAniPool[i];
            ani.destroy();
        }

        this.attackAniPool = null;

        for (let i = 0; i < this.mapItemThings.length; i++) {
            let thing = this.mapItemThings[i];
            if (thing.parent) {
                thing.parent.removeChild(thing);
            }
        }
        this.mapItemThings = null;

        for(let i=0;i<this.mapThings.length;i++){
            Laya.Pool.clearBySign(this.mapThings[i].skin);
        }
        this.mapThings = null;



        //这里要处理一下地图上的东西

        // if(this.endImage){
        //     if(this.endImage.parent){
        //         this.endImage.parent.removeChild(this.endImage);
        //     }
        // }
        // this.endImage = null;


    }

}