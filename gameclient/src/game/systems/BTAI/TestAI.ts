import { BTAI_Base } from "./BTAI_Base";
import {BT} from "./BT";

export class TestBT {

    public aiRoot: BTAI_Base.Root = null;
    public aimCount: number = 0;
    public shootCount: number = 0;

    constructor() {
        this.aiRoot = BT.Root();
    }
    public Init(): void {

        let shoot: Function = this.Shoot;
        let aim: Function = this.Aim;
        LogSys.Info("Test BT");

        this.aiRoot.OpenBranch(
            BT.If(this.TestVisibleTarget).OpenBranch(
                BT.Call(this.Walk),
                BT.RandomSequence([10, 10]).OpenBranch(
                    BT.Call(this.Shoot.bind(this, this)),
                    BT.Call(this.Aim.bind(this, this))
                ),
                BT.Sequence().OpenBranch(
                    BT.Call(this.Walk),
                    BT.Wait(2),
                    BT.Call(this.Turn)
                ),
                BT.Wait(5),

            )
        );
    }

    private Turn(): void {
        console.log("execute Turn");
    }

    private Walk(): void {
        console.log("execute Walk");
    }

    private Shoot(para1: TestBT): void {
        para1.shootCount++;
        console.log(("execute Shoot : " + para1.shootCount));
    }

    private Aim(para: TestBT): void {

        para.aimCount++;
        console.log(("execute Aim : " + para.aimCount));
    }

    private TestVisibleTarget(): boolean {
        let randomNum = Math.random() * 2;
        let isSuccess = randomNum > 1;
        console.log("execute TestVisibleTarget Result:" + randomNum);
        return isSuccess;
    }

    private end(): void {
        this.aiRoot.IsTerminated = true;
    }

    public Update(): void {
        this.aiRoot.Tick();
    }

    public GetAIRoot(): BTAI_Base.Root {
        return this.aiRoot;
    }
}