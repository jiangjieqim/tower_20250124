/**
* name 
*/
export class ScaleButtonScript extends Laya.Script {

    public delayTime: number = 0;
    public minScale: number = 0;
    private monkeyBox: Laya.Node;


    constructor() {
        super();
        
    }


    onAwake():void{
        this.monkeyBox=this.owner;
        this.owner.frameOnce(2, this, this.onLoaded);

        

    }

    onLoaded(): void {
        /* 设置按钮为单态按钮
         ** 取值：
         ** 1：单态。图片不做切割，按钮的皮肤状态只有一种。
         ** 2：两态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、按下和经过及选中状态皮肤。
         ** 3：三态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、经过状态皮肤、按下和选中状态皮肤
         */
        //添加鼠标按下事件侦听。按时时缩小按钮。
        this.monkeyBox.on(Laya.Event.MOUSE_DOWN, this, this.scaleSmall);
        //添加鼠标抬起事件侦听。抬起时还原按钮。
        this.monkeyBox.on(Laya.Event.MOUSE_UP, this, this.scaleBig);
        //添加鼠标离开事件侦听。离开时还原按钮。
        this.monkeyBox.on(Laya.Event.MOUSE_OUT, this, this.scaleOUt);
    }


    private scaleSmall(): void {
        //缩小至0.8的缓动效果
        Laya.Tween.to(this.monkeyBox, { scaleX: 0.8, scaleY: 0.8 }, 2);
    }
    private scaleBig(): void {
        //变大还原的缓动效果
        Laya.Tween.to(this.monkeyBox, { scaleX: 1, scaleY: 1 }, 2);
        // console.log("MOUSE_UP");

    }
    private scaleOUt():void
    {
        //变大还原的缓动效果
        Laya.Tween.to(this.monkeyBox, { scaleX: 1, scaleY: 1 }, 2);

        // console.log("scaleOUt");
    }
}