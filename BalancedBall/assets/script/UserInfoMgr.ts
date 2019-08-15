import * as onfire from './module/Network/protocol/libs/onfire/onfire';
import {PlatformMgr} from './module/Platform/PlatformMgr';
import * as MD_NetworkMgr from './module/Network/NetworkMgr';
import LanguageMgr from './module/i18n/LanguageMgr';
import {Global} from './module/Global';
import ScreenShotController = require('./module/screenShot/ScreenShotController');
const {ccclass, executionOrder} = cc._decorator;
export const SceneFlag = cc.Enum({
    None:-1,
    main:1,
    game:2,
    rank:3,
    asseble:4,
    createWorld:5,
    challengeScene:6
});

@ccclass
export class UserInfoMgr extends cc.Component {
    @executionOrder(-1)
    static instance :UserInfoMgr = null;
    private preloadedRewardedVideo : any;
    private connectDisconnected : any;
    private preloadADSErrorCode : string;
    private userMatchResultEvent : any;
    private isServerClose:boolean = false;

    private gameBlockConfig:any[] = null;
    private currentGameData:any = null;
    private editGame:boolean = false;
    private configSavePath:any = null;
    onLoad () {
        cc.game.addPersistRootNode(this.node);
        UserInfoMgr.instance = this;
        // this.node.on('startLogin', this._startLogin, this);
        // this.node.on('connectSuc', this.installEvents, this);
        // this.connectDisconnected = onfire.on("onclose",this.serverOnClose.bind(this));
    }

    start () {
       // this.preLoadADVideo();
    }

    preLoadADVideo(){
        if(!PlatformMgr.instance.isOnPCTest()){
            Global.INFO_MSG('preloaded RewardedVideo!');
        
            this.preloadedRewardedVideo = undefined;
            PlatformMgr.instance.getPlatform().preLoadRewardedVideo(Global.GB_FBPlacementId,(rewarded,errorCode)=>{
                this.preloadedRewardedVideo = rewarded;
                this.preloadADSErrorCode = errorCode;
            });
        }
    }

    _startLogin(){
       
     
    }

    onDestroy(){
        onfire.un(this.connectDisconnected);

    }
    
    serverOnClose(result){
        Global.INFO_MSG('server on close code : ' + result.code);
        this.beKickedOutResult({code:0});
    }
    
    isUnconnect()
    {
        return this.isServerClose;
    }

    beKickedOutResult(result){
        let networkMgr = MD_NetworkMgr.NetworkMgr.instance;
        networkMgr.disConnect();
        if(result.code === 1){
            Global.OpenPromptBox(Global.PromptBoxMode.ONLY_OK,'You have already logged in.',()=>{
                this.quitGame();
            });
        }
        else if(result.code === 2){
            Global.OpenPromptBox(Global.PromptBoxMode.ONLY_OK,'Server Maintening.',()=>{
                this.quitGame();
            });
        }
        else{
            this.isServerClose = true;
            Global.OpenPromptBox(Global.PromptBoxMode.ONLY_OK,'Connecting failed, hold on please.',()=>{
                this.quitGame();
            });
        }
    }

    installEvents() {
        let networkMgr = MD_NetworkMgr.NetworkMgr.instance;
       
    }


    quitGame(){
        PlatformMgr.instance.getPlatform().quitGame();
    }

    isEditGame(isEdit)
    {
        this.editGame = isEdit;
    }

    getEnterGameStatus()
    {
        return this.editGame;
    }

    setGameConfig(data)
    {
        this.currentGameData = data;
    }

    getGameConfig()
    {
        return this.currentGameData;
    }

    saveConfigData(gameBlockConfig)
    {
        this.gameBlockConfig = gameBlockConfig;
    }

    getConfigData()
    {
        return this.gameBlockConfig;
    }

    addGameConfig(blockConfig)
    {
        this.gameBlockConfig.push(blockConfig);
    }

    setSaveConfigPath(path)
    {
       this.configSavePath = path;
    }

    getSaveConfigPath()
    {
       return this.configSavePath;
    }

    deleteCongfig()
    {
        if(!this.currentGameData)
        {
            return  'choose block';
        }
        for(let i=0; i<this.gameBlockConfig.length; i++)
        {
            if(this.currentGameData.gameIndex === this.gameBlockConfig[i].gameIndex)
            {
                let deleteBlock = this.gameBlockConfig.splice(i,1);
                let data = JSON.stringify(this.gameBlockConfig);
                jsb.fileUtils.writeStringToFile (data,this.configSavePath.savePath); 
                return  'delete game config:'+ deleteBlock[0].blockName;
            }
        }
    }
};