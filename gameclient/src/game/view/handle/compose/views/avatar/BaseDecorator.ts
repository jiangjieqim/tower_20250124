import { ComposeModel } from "../../ComposeModel";

export abstract class BaseDecorator{
    protected get model(){
        return ComposeModel.Ins;
    }
    protected get fight(){
        return this.model.fightView;
    }
    abstract onInit();
    abstract onExit();
}