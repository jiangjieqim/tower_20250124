/**平均数工具类*/
export class AverageUtils {

    private _maxNum: number;//最大数
    private _nums: Array<number> = [];//数字列表
    private _numsLen: number = 0;//数字长度
    private _numSum: number = 0;//数字和

    /**构造
     * @param maxNum 参与计算的最大值
    */
    public constructor(maxNum: number = 10) {
        this._maxNum = maxNum;
    }
    
    /**添加一个值
     * @param value
    */
    public push(value: number): void {
        if (this._numsLen > this._maxNum) {
            this._numsLen--;
            this._numSum -= this._nums.shift();
        }
        this._nums.push(value);
        this._numSum += value;
        this._numsLen++;
    }

    /**获取平均值*/
    public GetValue(): number {
        return this._numSum / this._numsLen;
    }

    /**清空*/
    public Clear(): void {
        this._nums.splice(0);
        this._numsLen = 0;
        this._numSum = 0;
    }

}