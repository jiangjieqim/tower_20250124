
// <summary>
// 行为树会从Root节点开始遍历子节点。Update中执行
// 每个节点都有相关的操作，但是基本上就是返回三种状态
// ● Success​: 节点成功完成任务
// ● Failure​: 节点未通过任务
// ● Continue​:节点尚未完成任务。
// 但是每个节点的父节点对子节点的结果处理方式还不同。  例如
// ● Test 节点： 测试节点将调用其子节点并在测试为真时返回子节点状态，如果测试为假，则返回Failure而不调用其子节点。
// 行为树的一种构造方式如下：
// Root aiRoot = BT.Root(); 
// aiRoot.Do(  
// BT.If(TestVisibleTarget).Do(
//  BT.Call(Aim),
//  BT.Call(Shoot)
//  ),
//  BT.Sequence().Do(
//  BT.Call(Walk),
//  BT.Wait(5.0f),
//  BT.Call(Turn),
//  BT.Wait(1.0f),
//  BT.Call(Turn)
//  )
// ); 
//然后在Update中调用 aiRoot.Tick()​ 。  刚刚构造的行为树是怎么样的检查过程呢？  
//1、首先检查TestVisibleTarget是否返回Ture，如果是继续执行子节点执行Aim函数和Shoot函数
//2、TestVisibleTarget是否返回false,if节点将返回Failure， 然后Root 将转向下一个子节点。这是个Sequence节点，它从执行第一个子节点开始。
//   1）将调用Walk函数，直接返回 Success，以便Sequence将下一个子节点激活并执行它。
//   2）执行Wait 节点，只是要等待5秒，还是第一次调用，所以肯定返回Running状态， 当Sequence从子节点上得到Running状态时，不会更改激活的子节点索引，下次Update的时候还是从这个节点开始执行
//3、Update的执行，当Wait节点等待的时间到了的时候，将会返回Success， 以便序列将转到下一个子节点。
//脚本中的Node列表 
// Sequence：
//一个接一个地执行子节点。如果子节点返回：
//●Success：Sequence将选择下一帧的下一个孩子开始。
//●Failure：Sequence将返回到下一帧的第一个子节点（从头开始）。
//●Continue：Sequence将在下一帧再次调用该节点。
//RandomSequence：
// 每次调用时，从子列表中执行一个随机子节点。您可以在构造函数中指定要应用于每个子项的权重列表作为int数组，以使某些子项更有可能被选中。
//Selector ：
//按顺序执行所有子项，直到一个返回Success，然后退出而不执行其余子节点。如果没有返回Success，则此节点将返回Failure。

// Condition ：
// 如果给定函数返回true，则此节点返回Success;如果为false，则返回Failure。
// 与其他依赖于子节点结果的节点链接时很有用（例如，Sequence，Selector等）
// If ：
//调用给定的函数。
// ●如果返回true，则调用当前活动的子级并返回其状态。
// ●否则，它将在不调用其子项的情况下返回Failure
// While：
//只要给定函数返回true，就返回Continue（因此，下一帧将再次从该节点开始，而不会评估所有先前的节点）。
//子节点们将陆续被执行。
//当函数返回false并且循环中断时，将返回Failure。
// Call 
//调用给定的函数，它将始终返回Success。是动作节点！
//Repeat 
//将连续执行给定次数的所有子节点。
//始终返回Continue，直到达到计数，并返回Success。
//Wait
//将返回Continue，直到达到给定时间（首次调用时开始），然后返回Success。
//SetBool
//允许在给定的animator中设置布尔参数的值。始终返回成功
//SetActive 
//设置给定GameObject的活动/非活动状态。始终返回成功。
// </summary>

export namespace BTAI_Base {

    /**节点状态*/
    export enum BTState {
        UnDefined,
        Failure,//失败
        Success,//成功
        Continue,//继续
        Abort,//终止
    }

    /**节点抽象类*/
    export class BTNode {

        public constructor() {
        }

        public Tick(): BTState {
            return BTState.Success;
        }
    }

    /**包含子节点的组合 节点基类*/
    export class Branch extends BTNode {

        protected activeChild: number = 0;  //当前激活的子节点
        protected children: BTNode[];       //所有子节点

        public constructor() { super(); }

        public OpenBranch(...children: BTNode[]): Branch {
            this.children = new Array(children.length);
            for (let i = 0; (i < children.length); i++) {
                this.children[i] = children[i];
            }
            return this;
        }

        /**获取所有子节点*/
        public Children(): BTNode[] {
            return this.children;
        }

        /**激活子节点*/
        public ActiveChild(): number {
            return this.activeChild;
        }

        /**重置所有子节点*/
        public ResetChildren(): void {
            this.activeChild = 0;
            for (let i = 0; i < this.children.length; i++) {
                let b: Branch = this.children[i] as Branch;
                if (b instanceof Branch) {
                    b.ResetChildren();
                }
            }
        }
    }

    /** 装饰节点：只包含一个子节点，用于某种方式改变这个节点的行为
     * 比如过滤器（用于决定是否允许子节点运行的，如：Until Success, Until Fail等），这种节点的子节点应该是条件节点，条件节点一直检测“视线中是否有敌人”，知道发现敌人为止。
     * 或者 Limit 节点，用于指定某个子节点的最大运行次数
     * 或者 Timer节点，设置了一个计时器，不会立即执行子节点，而是等一段时间，时间到了开始执行子节点
     * 或者 TimerLimit节点，用于指定某个子节点的最长运行时间。
     * 或者 用于产生某个返回状态，
     */
    export class Decorator extends BTNode {

        public constructor() { super(); }
        protected child: BTNode;

        public Do(child: BTNode): Decorator {
            this.child = this.child;
            return this;
        }
    }

    /** 顺序节点：（从左到右依次执行所有子节点，只要子节点返回Success就继续执行后续子节点，直到遇到Failure或者Runing， 
     *  停止后续执行，并把这个节点返回给父节点，只有它的所有子节点都是Success他才会向父节点返回Success）
     */
    export class Sequence extends Branch {
        public constructor() { super() }
        public Tick(): BTState {
            let childState = this.children[this.activeChild].Tick();
            switch (childState) {
                case BTState.Success:
                    {
                        this.activeChild++;
                        if ((this.activeChild == this.children.length)) {
                            this.activeChild = 0;
                            return BTState.Success;
                        }
                        else {
                            return BTState.Continue;
                        }
                    }
                case BTState.Failure:
                    {
                        this.activeChild = 0;
                        return BTState.Failure;
                    }
                case BTState.Continue:
                    {
                        return BTState.Continue;
                    }
                case BTState.Abort:
                    {
                        this.activeChild = 0;
                        return BTState.Abort;
                    }
                default:
                    {
                        console.warn("This should never happen, but clearly it has .");
                        return BTState.UnDefined;
                    }
            }
        }
    }

    /** 选择节点：从左到右依次执行所有子节点 ，只要遇到failure就继续执行后续子节点，直到遇到一个节点返回Success或Running为止。向父节点返回Success或Running
     * 所有子节点都是Fail， 那么向父节点凡湖Fail
     * 选择节点 用来在可能的行为集合中选择第一个成功的。 比如一个试图躲避枪击的AI角色， 它可以通过寻找隐蔽点， 或离开危险区域， 或寻找援助等多种方式实现目标。
     * 利用选择节点，他会尝试寻找Cover，失败后在试图逃离危险区域。
     */
    export class Selector extends Branch {

        public constructor(shuffle: boolean) {
            super();
            if (shuffle) {//洗牌操作
                let n = this.children.length;
                while ((n > 1)) {
                    n--;
                    let k = Math.floor(Math.random() * (n + 1));
                    let value = this.children[k];
                    this.children[k] = this.children[n];
                    this.children[n] = value;
                }

            }
        }

        public Tick(): BTState {
            let childState = this.children[this.activeChild].Tick();
            switch (childState) {
                case BTState.Success:
                    {
                        this.activeChild = 0;
                        return BTState.Success;
                    }
                case BTState.Failure:
                    {
                        this.activeChild++;
                        if ((this.activeChild == this.children.length)) {
                            this.activeChild = 0;
                            return BTState.Failure;
                        }
                        else {
                            return BTState.Continue;
                        }
                    }
                case BTState.Continue:
                    {
                        return BTState.Continue;
                    }
                case BTState.Abort:
                    {
                        this.activeChild = 0;
                        return BTState.Abort;
                    }
                default:
                    {
                        console.warn("This should never happen, but clearly it has .");
                        return BTState.UnDefined;
                    }
            }

        }
    }

    /**行为节点：调用方法，或运行协程(暂未实现)。
     * 完成实际工作， 例如播放动画，让角色移动位置，感知敌人，更换武器，播放声音，增加生命值等。
     */
    export class Action extends BTNode {

        private fn: Function;

        public constructor(fn: Function) {
            super();
            this.fn = fn;
        }
        public Tick(): BTState {
            if ((this.fn != null)) {
                this.fn();
                return BTState.Success;
            }

        }

        public ToString(): string {
            return ("Action : " + this.fn.name);
        }
    }

    /** 条件节点：调用方法，如果方法返回true则返回成功，否则返回失败。
     * 用来测试当前是否满足某些性质或条件，例如“玩家是否在20米之内？”“是否能看到玩家？”“生命值是否大于50？”“弹药是否足够？”等
     */
    export class Condition extends BTNode {

        private fn: Function;

        public constructor(fn: Function) {
            super();
            this.fn = fn;
        }

        public Tick(): BTState {
            if (this.fn())
                return BTState.Success;
            else
                return BTState.Failure;
        }

        public ToString(): string {
            return ("Condition : " + this.fn.name);
        }
    }
   
    /**阻塞节点  如果当前子节点是Continue 说明没有执行完，阻塞着，执行完之后在继续它后面的兄弟节点，不管成功失败。
     * 如果当前结点是最后一个节点并执行完毕，说明成功！否则就是处于Continue状态。 
     * 这个基本上是抽象节点，目的是让所有子节点都执行一遍， 当前子节点执行完就进入下一个节点(超上限就返回到第一个)
    */
    export class Block extends Branch {

        public Tick(): BTState {
            switch (this.children[this.activeChild].Tick()) {
                case BTState.Continue:
                    {
                        return BTState.Continue;
                    }
                default:
                    {
                        this.activeChild++;
                        if ((this.activeChild == this.children.length)) {
                            this.activeChild = 0;
                            return BTState.Success;
                        }
                        return BTState.Continue;
                    }
            }

        }
    }

    /**当方法为True的时候 尝试执行当前子节点 */
    export class ConditionalBranch extends Block {

        private fn: Function;               //条件方法
        private tested: boolean = false;    //条件通过

        public constructor(fn: Function) {
            super();
            this.fn = fn;
        }

        public Tick(): BTState {
            if (!this.tested) {
                this.tested = this.fn();
            }

            if (this.tested) {
                // 当前子节点执行完就进入下一个节点(超上限就返回到第一个)           
                let result = super.Tick();
                // 没执行完
                if ((result == BTState.Continue)) {
                    return BTState.Continue;
                }
                else {
                    this.tested = false;
                    // 最后一个子节点执行完，才会为Ture
                    return result;
                }

            }
            else {
                return BTState.Failure;
            }

        }

        public ToString(): string {
            return ("ConditionalBranch : " + this.fn.name);
        }
    }

    /**While节点-只要方法返回True 就执行所有子节点,否则返回 Failure
    */
    export class While extends Block {

        private fn: Function;   //条件方法

        public constructor(fn: Function) {
            super();
            this.fn = fn;
        }

        public Tick(): BTState {
            if (this.fn()) {
                super.Tick();
            }
            else {
                // if we exit the loop
                this.ResetChildren();
                return BTState.Failure;
            }

            return BTState.Continue;
        }

        public ToString(): string {
            return ("While : " + this.fn.name);
        }
    }

    /**行为树根 */
    export class Root extends Block {
        public constructor() { super() }
        public IsTerminated: boolean = false;

        public Tick(): BTState {
            if (this.IsTerminated) {
                return BTState.Abort;
            }

            if (this.children == null)
                return BTState.Abort;

            while (true) {
                switch (this.children[this.activeChild].Tick()) {
                    case BTState.Continue:
                        {
                            return BTState.Continue;
                        }
                    case BTState.Abort:
                        {
                            this.IsTerminated = true;
                            return BTState.Abort;
                        }
                    default:
                        {
                            this.activeChild++;
                            if ((this.activeChild == this.children.length)) {
                                this.activeChild = 0;
                                return BTState.Success;
                            }
                        }
                }
            }
        }
    }


    /**多次运行子节点（一个子节点执行一次就算一次） */
    export class Repeat extends Block {

        private count: number = 1;

        private currentCount: number = 0;

        public constructor(count: number) {
            super();
            this.count = count;
        }

        public Tick(): BTState {
            if (((this.count > 0)
                && (this.currentCount < this.count))) {
                let result = super.Tick();
                switch (result) {
                    case BTState.Continue:
                        {
                            return BTState.Continue;
                        }
                    default:
                        {
                            this.currentCount++;
                            if ((this.currentCount == this.count)) {
                                this.currentCount = 0;
                                return BTState.Success;
                            }
                            return BTState.Continue;
                        }
                }
            }
            return BTState.Success;
        }

        public ToString(): string {
            return ("Repeat Until : " + (this.currentCount + (" / " + this.count)));
        }
    }

    /**根据权重随机选择一个子节点来执行，缺省初始化权重为纯随机 */
    export class RandomSequence extends Block {

        private m_Weight: number[] = null;

        private m_AddedWeight: number[] = null;

        // <summary>
        // 每次再次触发时，将选择一个随机子节点
        // </summary>
        // <param name="weight">保留null，以便所有子节点具有相同的权重。
        // 如果权重低于子节点， 则后续子节点的权重都为1</param>
        public constructor(weight: number[] = null) {
            super();
            this.activeChild = -1;
            this.m_Weight = weight;
        }

        public OpenBranch(...children: BTNode[]): Branch {
            this.m_AddedWeight = new Array(children.length);
            for (let i: number = 0; (i < children.length); i++) {
                let weight: number = 0;
                let previousWeight: number = 0;
                if (((this.m_Weight == null)
                    || (this.m_Weight.length <= i))) {
                    //如果没有那个权重，就将权重设置为1
                    weight = 1;
                }
                else {
                    weight = this.m_Weight[i];
                }

                if ((i > 0)) {
                    previousWeight = this.m_AddedWeight[(i - 1)];
                }

                this.m_AddedWeight[i] = (weight + previousWeight);
            }

            return super.OpenBranch(...children);
        }

        public Tick(): BTState {
            if ((this.activeChild == -1)) {
                this.pickNewChild();
            }

            let result = this.children[this.activeChild].Tick();
            switch (result) {
                case BTState.Continue:
                    {
                        return BTState.Continue;
                    }
                default:
                    {
                        this.pickNewChild();
                        return result;
                    }
            }
        }

        private pickNewChild(): void {
            let choice: number = Math.random() * this.m_AddedWeight[(this.m_AddedWeight.length - 1)] + 1;


            for (let i: number = 0; (i < this.m_AddedWeight.length); i++) {
                if (((choice - this.m_AddedWeight[i]) <= 0)) {
                    this.activeChild = i;
                    break;
                }
            }
            //console.log("choice: "+this.activeChild);
        }

        public ToString(): string {
            return ("Random Sequence : " + (this.activeChild + ("/" + this.children.length)));
        }
    }

    /**并行节点  */
    export class Parallel extends Branch {

    }
}