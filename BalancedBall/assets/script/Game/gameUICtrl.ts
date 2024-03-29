const {ccclass, property} = cc._decorator;
import elevatorCtrl from './elevatorCtrl';
import createScrewAxis from './createScrewAxis';
import gameLogic from './gameLogic';
import ballCtrl from './ballCtrl';
import dataInputCtrl from '../GameEditor/dataInputCtrl';
import LanguageMgr from '../module/i18n/LanguageMgr';
import holeCtrl from './holeCtrl';
import { Global } from '../module/Global';
@ccclass
export default class gameUICtrl extends cc.Component {

    @property(createScrewAxis)
    leftScrewCtrl: createScrewAxis = null;

    @property(createScrewAxis)
    rightScrewCtrl: createScrewAxis = null;

    @property(elevatorCtrl)
    elevatorCtrl: elevatorCtrl = null;

    @property(dataInputCtrl)
    editorData: dataInputCtrl = null;

    @property(gameLogic)
    gameLogic: gameLogic = null;

    @property(cc.Prefab)
    ballPref:cc.Prefab = null;

    @property(cc.Prefab)
    holePref:cc.Prefab = null;

    @property(cc.Prefab)
    exitHolePref:cc.Prefab = null;

    @property(cc.Label)
    gameResult:cc.Label = null;

    @property(cc.Label)
    countTime:cc.Label = null;

    @property([cc.Node])
    stars:cc.Node[] = [];

    @property(cc.Camera)
    mainCamera: cc.Camera = null;
    // LIFE-CYCLE CALLBACKS:
    isGameOver:boolean = false;
    def_BallPos:cc.Vec2 = cc.v2(0,-300);
    _timeNow:number = 0;
    oneStarTime:number = 0;
    twoStarTime:number = 0;
    threeStarTime:number = 0;
    onLoad () 
    {
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.gravity =  cc.v2(0,-300);
        manager.debugDrawFlags = 1;

        this.leftScrewCtrl.setMainUICtrl(this);
        this.rightScrewCtrl.setMainUICtrl(this);
        this.gameLogic.setMainUICtrl(this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }


    start () {
      
    }

    initGame(editData)
    {
        //editData.gameName
        this._timeNow = parseInt(editData.oneStarTime);
        this.oneStarTime = parseInt(editData.oneStarTime);
        this.twoStarTime = parseInt(editData.twoStarTime);
        this.threeStarTime = parseInt(editData.threeStarTime);
        this.updateTime();
        this.elevatorCtrl.setElevatorProperty(parseInt(editData.platformDeltaMove),parseInt(editData.platformMostMove));

        if(editData.ballsInfo)//创建球
        {
            for(let i=0; i<editData.ballsInfo.length; i++)
            {
                let ball = cc.instantiate(this.ballPref);
                ball.parent = this.node;
                ball.position = editData.ballsInfo[i].pos;
                let ballComp = ball.getComponent(ballCtrl);
                ballComp.initBall(editData.ballsInfo[i].width,editData.ballsInfo[i].friction,this);

                let physicsComp = ball.getComponent(cc.PhysicsCircleCollider);
                physicsComp.friction = editData.ballsInfo[i].friction;
                physicsComp.apply();
            }
        }
        
        if(editData.exitsInfo)//创建出口
        {
            for(let i=0; i<editData.exitsInfo.length; i++)
            {
                let exithole = cc.instantiate(this.exitHolePref);
                exithole.parent = this.node;
                exithole.position = editData.exitsInfo[i].pos;
                let exitholeComp = exithole.getComponent(holeCtrl);
                exitholeComp.initHole(editData.exitsInfo[i].width);
            }
        }
  
        if(editData.holesInfo)//创建洞口
        {
            for(let i=0; i<editData.holesInfo.length; i++)
            {
                let hole = cc.instantiate(this.holePref);
                hole.parent = this.node;
                hole.position = editData.holesInfo[i].pos;
                let holeComp = hole.getComponent(holeCtrl);
                holeComp.initHole(editData.holesInfo[i].width);
            }
        }
    }

    setGameOver(result)
    {
        this.gameResult.node.active = true;
        this.gameResult.node.zIndex = 50;
        if(result)
        {
            this.isGameOver = true;
            let str = LanguageMgr.instance.getLabel('winGame');
            this.gameResult.string = str;
        }
        else
        {
            this.isGameOver = true;
            let str = LanguageMgr.instance.getLabel('loseGame');
            this.gameResult.string = str;
        }
    }

    onKeyDown(event)
    {
        if(this.isGameOver)
        {
           return;
        }
        
        switch(event.keyCode) {
            case cc.macro.KEY.w:
                this.leftUpBtnClick();
                break;
            case cc.macro.KEY.s:
                this.leftDownBtnClick();
                break;
            case cc.macro.KEY.o:
                this.rightUpBtnClick();
                break;
            case cc.macro.KEY.l:
                this.rightDownBtnClick();
                break;
        }
    }

    leftUpBtnClick()
    {
        if(this.isGameOver || !this.elevatorCtrl.canClockRotate() || this.elevatorCtrl.getLeftUpLimited())
        {
           return;
        }
       this.leftScrewCtrl.playRiseAnim();
       this.elevatorCtrl.leftMove_up();
    }

    leftDownBtnClick()
    {
        if(this.isGameOver || !this.elevatorCtrl.canAnticlockRotate() || this.elevatorCtrl.getLeftDownLimited())
        {
           return;
        }
       this.leftScrewCtrl.playDescendAnim();
       this.elevatorCtrl.leftMove_down();
    }

    rightUpBtnClick()
    {
        if(this.isGameOver || !this.elevatorCtrl.canAnticlockRotate() || this.elevatorCtrl.getRightUpLimited())
        {
           return;
        }
        this.rightScrewCtrl.playRiseAnim();
        this.elevatorCtrl.rightMove_up();
    }

    rightDownBtnClick()
    {
        if(this.isGameOver || !this.elevatorCtrl.canClockRotate() || this.elevatorCtrl.getRightDownLimited())
        {
           return;
        }
        this.rightScrewCtrl.playDescendAnim();
        this.elevatorCtrl.rightMove_down();
    }

    updateTime()//倒计时
    {
        this.schedule(function(){
            this.dealTime();
        },1);
    }

    dealTime()
    {
        if(this.isGameOver)
        {
            this.unscheduleAllCallbacks();
            return;
        }
        this.dealStar();
        if(this._timeNow <= 0)
        {
            this.unscheduleAllCallbacks();
            this.setGameOver(false);
            return;
        }
        this._timeNow -= 1;  
        this.changeTimeFormat();
    }

    dealStar()
    {
        let passTime = this.oneStarTime - this._timeNow;
        if (passTime >= this.oneStarTime)
        {
            this.stars[2].opacity = 155;
        }
        else if (passTime >= this.twoStarTime)
        {
            this.stars[1].opacity = 155;
        }
        else if (passTime >= this.threeStarTime)
        {
            this.stars[0].opacity = 155;
        }
    }

    changeTimeFormat()
    {
        let h = parseInt((this._timeNow/3600).toString());
        let m = parseInt(((this._timeNow%3600)/60).toString());
        let s = this._timeNow % 60;
        let hour='';
        let minute='';
        let seconds='';
        if(h < 0)
        {
            hour = "00";
        }
        else
        {
            if(h<10)
            {
                hour = "0" + h.toString();
            }
            else
            {
                hour = h.toString();
            }
        }
        if(m < 0)
        {
            minute = "00";
        }
        else
        {
            if(m < 10)
            {
                minute = "0" + m.toString();
            }
            else
            {
                minute = m.toString();
            }
        }
        if(s < 0)
        {
            seconds = "00";
        }
        else
        {
            if(s < 10)
            {
                seconds = "0" + s.toString();
            }
            else
            {
                seconds = s.toString();
            }
        }
        this.countTime.string = hour + ":" + minute + ":" + seconds;
    }

    returnStartScene()
    {
        this.node.emit(Global.GlobalEventMap.ChangeScene,{sceneName:'Start',});
    }
    // update (dt) {}
}
