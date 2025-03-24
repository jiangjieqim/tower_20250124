
/**物理3d工具 */
export class Physics3DUtil {

    //引擎定义的碰撞组
    /**所有过滤=1*/
    static get COLLISIONFILTERGROUP_ALLFILTER(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER; };
    /**默认碰撞组=1*/
    static get COLLISIONFILTERGROUP_DEFAULTFILTER(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_DEFAULTFILTER; }
    /**静态碰撞组=2*/
    static get COLLISIONFILTERGROUP_STATICFILTER(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_STATICFILTER; };
    /**运动学刚体碰撞组=4*/
    static get COLLISIONFILTERGROUP_KINEMATICFILTER(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_KINEMATICFILTER; }
    /**碎片碰撞组=8*/
    static get COLLISIONFILTERGROUP_DEBRISFILTER(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_DEBRISFILTER; }
    /**传感器触发器=16*/
    static get COLLISIONFILTERGROUP_SENSORTRIGGER(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_SENSORTRIGGER; }
    /**字符过滤器=32*/
    static get COLLISIONFILTERGROUP_CHARACTERFILTER(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CHARACTERFILTER; }
    /**自定义过滤1=64*/
    static get COLLISIONFILTERGROUP_CUSTOMFILTER1(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1; }
    /**自定义过滤2=128*/
    static get COLLISIONFILTERGROUP_CUSTOMFILTER2(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2; }
    /**自定义过滤3=256*/
    static get COLLISIONFILTERGROUP_CUSTOMFILTER3(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3; }
    /**自定义过滤4=512*/
    static get COLLISIONFILTERGROUP_CUSTOMFILTER4(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER4; }
    /**自定义过滤5=1024*/
    static get COLLISIONFILTERGROUP_CUSTOMFILTER5(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5; }
    /**自定义过滤6=2048*/
    static get COLLISIONFILTERGROUP_CUSTOMFILTER6(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER6; }
    /**自定义过滤7=4096*/
    static get COLLISIONFILTERGROUP_CUSTOMFILTER7(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER7; }
    /**自定义过滤8=8192*/
    static get COLLISIONFILTERGROUP_CUSTOMFILTER8(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER8; }
    /**自定义过滤9=16384*/
    static get COLLISIONFILTERGROUP_CUSTOMFILTER9(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER9; }
    /**自定义过滤10=32768*/
    static get COLLISIONFILTERGROUP_CUSTOMFILTER10(): number { return Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER10; }


    /**重力 */
    static get gravity(): Laya.Vector3 { return Laya.Physics3DUtils.gravity; }

}