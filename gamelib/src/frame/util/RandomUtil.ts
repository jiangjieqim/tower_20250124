/**随机工具类*/
export class RandomUtil {

    /**在 0-1之间随机
     * @returns 返回 0-1之间的非整数
    */
    public static RandomNext(): number {
        return Math.random();
    }

    /**在指定范围内随机 
     * @param min 最小值  
     * @param max 最大值
     * @returns 返回 非整数
    */
    public static RandomRound(min: number, max: number): number {
        //#region 保证最大值与最小值正确
        let _min = min;
        let _max = max;

        if (_min > _max) {
            _min = max;
            _max = min;
        }
        //#endregion

        let range = _max - _min;
        let rand = Math.random();

        return min + (rand * range);
    }

    /** 在指定范围内随机整数
     * @param min 最小值
     * @param max 最大值
     * @returns 返回 随机到的整数
     */
    public static RandomRoundInt(min: number, max: number): number {
        //#region 保证传入的值正确
        let _min = min;
        let _max = max;

        if (_min > _max) {
            _min = max;
            _max = min;
        }
        //#endregion

        var range = _max - _min;
        var rand = Math.random();

        let result: number = Math.round(min + (rand * range));
        result = result >= max ? result - 1 : result;

        return result;
    }

    /** 随机bool值
     *  @returns 返回bool值 true false
     */
    public static RandomBoolean(): boolean {
        let ran = this.RandomNext();
        return ran >= 0.5;
    }

    /**通过权重随机
     * @param weights 权重列表
     * @returns 返回随机数
    */
    public static RandomByWeights(weights: number[]): number {

        let sum = 0;
        for (let w of weights) {
            sum += w;
            // Debug.Log("RandomByWeights::w::" + w);
        }
        let rand = RandomUtil.RandomRound(0, sum);
        // Debug.Log("RandomByWeights::rand::" + rand);
        sum = 0;
        for (let i: number = 0; i < weights.length; i++) {
            sum += weights[i];
            if (rand <= sum)
                return i;
        }
    }

    /**判断是否符合条件
     * 通过随机数和占比判断是否符合条件
     * @param proportion 占比
     * @param start 开始值
     * @param end 结束值
     * @param bCantains 是否包含结束值
     */
    public static OnWhetherItMeetsTheRequirementsByProportion(proportion: number, start: number, end: number, bCantains = false): boolean {
        if (bCantains) {
            if (this.RandomRoundInt(start, end) <= proportion)
                return true;
        }
        else {
            if (this.RandomRoundInt(start, end) < proportion)
                return true;
        }
        return false;
    }

    /**
     * 获取列表中随机数量的内容列表
     * @param lst 
     */
    public static RandomCountList(lst: any[]) {
        let rand = this.RandomRoundInt(0, lst.length);
        if (rand < lst.length / 2) {
            rand = 0;
        }

        let randLst = this.RandomArray(lst);
        return randLst.splice(0, rand);
    }

    /**
     * 列表打乱
     * @param lst 
     * @returns 
     */
    public static RandomArray(lst: any[]): any[] {
        let result = lst.sort(() => {
            return 0.5 - Math.random();
        });

        return result;
    }

    /**根据随机种子随机
     * @param seed 随机种子
     * @returns number1 种子 number2 随机到的0-100的数值
    */
    public static RandSeed(seed: number): [number, number] {
        //a=9301,c=49297,m=233280.组合生成一组均匀的随机数字
        seed = (seed * 9301 + 49297) % 233280;
        return [seed, ((seed / (233280.0)) * 100 | 0)];
    }

    

}