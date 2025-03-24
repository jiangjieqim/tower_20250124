// import { uint64 } from "../network/protocols/uint64";

// import { uint64 } from "/network/uint64";

export class PlayerAccount{
    /**
     * 账号id
     */
    public Account:string;
    /**
     * 角色流水id
     */
    public AccountId:uint64;
}

export class Player{
    private static _ins:Player;
    public static get Ins(){
        if(!this._ins){
            this._ins = new Player();
        }
        return this._ins;
    }

    public Account:PlayerAccount = new PlayerAccount();

}