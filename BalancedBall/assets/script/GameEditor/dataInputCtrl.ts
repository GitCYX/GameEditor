const {ccclass, property} = cc._decorator;
import gameUICtrl from '../Game/gameUICtrl';
import ballCtrl from '../Game/ballCtrl';
import holeCtrl from '../Game/holeCtrl';
import { UserInfoMgr } from '../UserInfoMgr';
@ccclass
export default class dataInputCtrl extends cc.Component {
    @property()
    gameIndex:number = 1;

    @property()
    gameName:string = 'Default';

    @property()
    gameTime:number = 5000;

    @property()
    deltaMove:number = 10;

    @property()
    mostDeltaMove:number = 50;

    @property()
    ballFriction:number = 0.2;

    @property(cc.Node)
    ballParentNode:cc.Node = null;

    @property(cc.Node)
    exitParentNode:cc.Node = null;

    @property(cc.Node)
    holeParentNode:cc.Node = null;

    @property(gameUICtrl)
    gameUICtrl:gameUICtrl = null;

    serializeData:any[] = [];
    gameEditConfig:any = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let isEditGame = UserInfoMgr.instance.getEnterGameStatus();
        if(!isEditGame)
        {
            this.ballParentNode.active = false;
            this.exitParentNode.active = false;
            this.holeParentNode.active = false;
            let gameConfig = UserInfoMgr.instance.getGameConfig();
            this.gameUICtrl.initGame(gameConfig);
        }
        else
        {
            let ballsInfo = [];
            let balls = this.ballParentNode.children;
            for(let i=0; i<balls.length; i++)
            {
                let ballComp = balls[i].getComponent(ballCtrl);
                ballComp.initBall(balls[i].width,this.ballFriction,this.gameUICtrl);
                let ballWidth = balls[i].width;
                let ballPos = balls[i].position;
                ballsInfo.push({width:ballWidth, pos:ballPos,friction:this.ballFriction});
            }
    
            let exitsInfo = [];
            let exits = this.exitParentNode.children;
            for(let i=0; i<exits.length; i++)
            {
                let exitWidth = exits[i].width;
                let exitPos = exits[i].position;
                exitsInfo.push({width:exitWidth, pos:exitPos});
            }
    
            let holesInfo = [];
            let holes = this.holeParentNode.children;
            for(let i=0; i<holes.length; i++)
            {
                let holeWidth = holes[i].width;
                let holePos = holes[i].position;
                holesInfo.push({width:holeWidth, pos:holePos});
            }
            this.initSerializeData(ballsInfo,exitsInfo,holesInfo);
            let editData = this.getEditorData();
            this.gameUICtrl.initGame(editData);
        }
        
    }

    start () {

    }

    initSerializeData(ballsInfo,exitsInfo,holesInfo)
    {
        let preSerizalData:any  = {};
        preSerizalData.gameIndex = this.gameIndex;
        preSerizalData.blockName = this.gameName;
        preSerizalData.gameTime = this.gameTime;
        preSerizalData.platformDeltaMove = this.deltaMove;
        preSerizalData.platformMostMove = this.mostDeltaMove;
        preSerizalData.ballsInfo = ballsInfo;
        preSerizalData.exitsInfo = exitsInfo;
        preSerizalData.holesInfo = holesInfo;
        this.gameEditConfig = preSerizalData;
    }

    getEditorData()
    {
        return {name:this.gameName,gameTime:this.gameTime,platformDeltaMove:this.deltaMove,platformMostMove:this.mostDeltaMove}
    }

    testSerialize()
    {
        UserInfoMgr.instance.addGameConfig(this.gameEditConfig);
        let gameCongfig = UserInfoMgr.instance.getConfigData();
        let data = JSON.stringify(gameCongfig);
        let savePath = UserInfoMgr.instance.getSaveConfigPath();
        jsb.fileUtils.writeStringToFile (data,savePath.savePath);
        this.gameUICtrl.returnStartScene();         
    }
    // update (dt) {}
}
