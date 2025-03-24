export interface IMainUpdate {
    UpdateGold();
    UpdateExp();
    UpdateBattle();
    UpdateMoney();
    UpdateEquip();
    isPlaying:boolean;
    UpdateSmallIcon():void;
}
