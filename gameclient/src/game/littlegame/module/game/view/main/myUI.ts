import {MyView} from "../../../../rb/MyView";

export module myUI.game {
    export class FailedViewUI extends MyView {
		public restartBtn:Laya.Button;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/FailedView");
        }
    }

    export class MainViewUI extends MyView {
		public posBox:Laya.Box;
		public posImg:Laya.Image;
		public startBtn:Laya.Button;
		public stopBtn:Laya.Button;
		public restartBtn:Laya.Button;
		public quitBtn:Laya.Button;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/MainView");
        }
    }

    export class MonstorViewUI extends MyView {
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/MonstorView");
        }
    }

    export class SuccessViewUI extends MyView {
		public confirmBtn:Laya.Button;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/SuccessView");
        }
    }
}

export module myUI.game.item{
    export class AddAttackItemUI extends MyView {
        valueTf:Laya.Label;
        constructor(){ super()}
      
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/AddAttackItem");
        }
    }
    export class AddSpeedItemUI extends MyView {
        valueTf:Laya.Label;
        constructor(){ super()}
        
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/AddSpeedItem");
        }
    }
    export class BloodItemUI extends MyView {
		public tf:Laya.Label;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/BloodItem");
        }
    }
    export class DelSpeedItemUI extends MyView {
        valueTf:Laya.Label;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/DelSpeedItem");
        }
    }
}

export module myUI.game.item.monstor {
    export class Monstor01UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor01");
        }
    }
    export class Monstor02UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor02");
        }
    }
    export class Monstor03UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor03");
        }
    }
    export class Monstor04UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor04");
        }
    }
    export class Monstor05UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor05");
        }
    }
    export class Monstor06UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor06");
        }
    }
    export class Monstor07UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor07");
        }
    }
    export class Monstor08UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor08");
        }
    }
    export class Monstor09UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor09");
        }
    }
    export class Monstor10UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor10");
        }
    }
    export class Monstor11UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor07");
        }
    }

    export class Monstor12UI extends MyView {
		public ani:Laya.Animation;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("game/item/monstor/Monstor09");
        }
    }
}











