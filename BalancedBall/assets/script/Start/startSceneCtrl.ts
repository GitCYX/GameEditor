import { UserInfoMgr } from "../UserInfoMgr";
import {Global} from '../module/Global';
import blockBtnCtrl from "./blockBtnCtrl";
const {ccclass, property} = cc._decorator;

@ccclass
export default class startSceneCtrl extends cc.Component {
    @property(cc.Button)
    playBtn:cc.Button = null;

    @property(cc.Button)
    editBtn:cc.Button = null;

    @property(cc.Node)
    content:cc.Node = null;

    @property(cc.Label)
    deleteWarnLabel:cc.Label = null;

    @property(cc.Prefab)
    chooseBtn:cc.Prefab = null;

    @property(cc.Label)
    chooseLabel:cc.Label = null;

    @property()
    saveDataPath:string = "";

    editFileName:string = 'editData.json';
    currentChooseCtrl:blockBtnCtrl = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        UserInfoMgr.instance.setSaveConfigPath({savePath:this.saveDataPath+this.editFileName});
        this.playBtn.node.on('click',()=>{
            this.enterGame(false);
        })

        this.editBtn.node.on('click',()=>{
            this.enterGame(true);
        });

        let gameConfig = UserInfoMgr.instance.getGameConfig();
        if(gameConfig)
        {
            this.chooseLabel.string = gameConfig.blockName;
        }
        else
        {
            this.chooseLabel.string = 'NULL'
        }
    }

    deleteEvent()
    {
        if(this.currentChooseCtrl)
        {
            this.currentChooseCtrl.node.destroy();
        }
        let deleteRes = UserInfoMgr.instance.deleteCongfig();
        this.deleteWarnLabel.string = deleteRes;
    }

    start () {
        this.loadGameConfig()
    }

    loadGameConfig()
    {
        let gameConfig = UserInfoMgr.instance.getConfigData();
        if(gameConfig)
        {
           this.createBlockBtns(gameConfig);
        }
        else
        {
            cc.loader.loadRes('config/editData',(error,res)=>{
                if(!error)
                {
                    UserInfoMgr.instance.saveConfigData(res.json)
                    this.createBlockBtns(res.json);
                }
            });
        }
    }

    createBlockBtns(gameConfig)
    {
        for(let i=0; i<gameConfig.length; i++)
        {
            let chooseBtn = cc.instantiate(this.chooseBtn);
            let btnComp = chooseBtn.getComponent(blockBtnCtrl);
            btnComp.initBtn(gameConfig[i],this);
            chooseBtn.parent = this.content;
        }
    }

    currentChoose(data,blockBtnCtrl)
    {
        this.currentChooseCtrl = blockBtnCtrl;
        UserInfoMgr.instance.setGameConfig(data);
        this.chooseLabel.string = data.blockName;
    }

    enterGame(isEditGame)
    {
        UserInfoMgr.instance.isEditGame(isEditGame);
        if(isEditGame)
        {
            this.node.emit(Global.GlobalEventMap.ChangeScene,{sceneName:'Game',});
        }
        else
        {
            let gameConfig = UserInfoMgr.instance.getGameConfig();
            if(gameConfig)
            {
                this.node.emit(Global.GlobalEventMap.ChangeScene,{sceneName:'Game',});
            }
            else
            {
                this.chooseLabel.string = 'Choose Name';
            }
        }
    }
    // update (dt) {}
}
