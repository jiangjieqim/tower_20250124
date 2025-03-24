export namespace TextDefine {

    export class Sign {

        public static sign_percent: string = "%";   //百分号
        public static sign_plus: string = "+";      //加号
        public static sign_minus: string = "-";     //减号

    }

    export class Font {

        public static MEDIUM: string = "MEDIUM";

    }

    export class AnimName {

        public static Idle = "Idle";//待机动画
        public static Run = "Run";//跑步动画
        public static Jump = "Jump";//跳跃动画
        public static RunJump = "RunJump";//跑步跳跃动画
        public static Walk = "Walk";//行走动画
        public static AttackPrev = "AttackPrev";//攻击前动画
        public static AttackEnd = "AttackEnd";//攻击后动画
        public static Skill = "Skill";//技能释放动画
        public static Attack = "Attack";//攻击动画
        public static Dead = "Dead";//死亡动画
        public static Hitted = "Hitted";//受击动画
        public static Dizzy = "Dizzy";//眩晕动画
        public static Win = "Win";//战斗胜利动画
        public static Fail = "Fail";//战斗失败动画

    }

    export class ResName {
        public static role_1001: string = "role_1001";

    }

    export class EffectName {
        public static readonly HeroBody: string = "HeroBody";
        public static readonly effect_other_upgrade: string = "effect_other_upgrade";
        public static readonly effect_other_benpao: string = "effect_other_benpao";
        public static readonly effect_other_fuhuo: string = "effect_other_fuhuo";
        public static readonly effect_other_jihuo: string = "effect_other_jihuo";
        public static readonly efffect_yanwu: string = "efffect_yanwu";
        public static readonly effect_xiaoshi: string = "effect_xiaoshi";


    }


    export class RoleMark {

        public static readonly HeadMask = "HeadMask";
        public static readonly HPMask = "HPMask";
        public static readonly EffectMask = "EffectMask";
        public static readonly FootMask = "FootMask";
        public static readonly BulletMask = "BulletMask";

    }


    export class PoolName {
        public static readonly HeroBody: string = "HeroBody";
        public static readonly Scene1: string = "Scene1";
        public static readonly Scene2: string = "Scene2";
        public static readonly Scene3: string = "Scene3";
        public static readonly Scene4: string = "Scene4";
    }
}