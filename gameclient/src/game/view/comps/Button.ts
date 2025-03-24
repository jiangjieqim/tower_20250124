export module YrpFrameWork{
export class Button{
    private  static isLongPress:Boolean = false;
    private static longPressLister:Function = null;
    private static clickListener:Function = null;
    /**
     * 
     * @param _targetBtn 目标按钮
     * @param _clickListener 点击方法
     * @param _longPressListener 长按方法
     * @param _delay 定时器间隔
     * @param _isOnce 是否执行一次
     */
    public static on(_targetBtn:any,_clickListener:Function,
        _longPressListener:Function = null,_delay:number = 2000,_isOnce = true)
    {
        this.longPressLister = _longPressListener;
        this.clickListener = _clickListener;
        //鼠标按下，启动定时器
        _targetBtn.on(Laya.Event.MOUSE_DOWN,this,()=>{
            this.isLongPress = false;
            if(_isOnce)
            {
                _longPressListener && Laya.timer.once(_delay,this,this.onLongPress);
            }
            else{
                _longPressListener && Laya.timer.loop(_delay,this,this.onLongPress);
            }
            //鼠标抬起，取消定时器
            _targetBtn.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
            _targetBtn.on(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
        }) 
    }

    private static onMouseUp():void{
        if(!this.isLongPress) this.clickListener();
        this.longPressLister && Laya.timer.clear(this,this.onLongPress);       
    }
    private static onLongPress():void{
        this.isLongPress = true
        this.longPressLister();
    }

    private static onMouseMove():void{
         Laya.timer.clear(this,this.onLongPress);       
    }
}
}