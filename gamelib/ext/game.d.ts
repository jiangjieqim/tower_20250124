declare let debug

interface IMsgMgr{
    reset();
}
interface IEventMgr{
    emit(str:string,data?);
}
interface IE{
    MsgMgr:IMsgMgr;
    EventMgr:IEventMgr;
    sendTrack(str:string,data);
    AudioMgr;
}