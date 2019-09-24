import ButtonCtrl from "./ButtonCtrl";
import DataManager from "./DataManager";
import ScrollItemCtrl from "./ScrollItemCtrl";
const {ccclass, property} = cc._decorator;

@ccclass
export default class PanelCtrl extends cc.Component {

    @property(cc.Prefab)
    buttonPrefab: cc.Prefab = null;

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property(cc.Node)
    scrollContent: cc.Node = null;

    @property(cc.Node)
    saveBtn: cc.Node = null;

    @property(cc.Node)
    resetBtn: cc.Node = null;

    @property(cc.Node)
    deleteBtn: cc.Node = null;

    @property(cc.Node)
    deleteCover: cc.Node = null;

    @property(cc.Node)
    confirmDeleteBtn: cc.Node = null;

    @property(cc.Node)
    cancelDeleteBtn: cc.Node = null;

    @property(cc.Node)
    tipCover: cc.Node = null;

    @property(cc.Label)
    tipCoverTips: cc.Label = null;

    @property(cc.Node)
    tipCoverCloseBtn: cc.Node = null;

    @property(cc.Node)
    cover: cc.Node = null;

    @property(cc.Node)
    coverBtn: cc.Node = null;

    @property(cc.Node)
    cancelBtn: cc.Node = null;

    @property([ButtonCtrl])
    buttonCtrlArr: ButtonCtrl[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.tipCoverCloseBtn.on("click", this.OnTipCoverBtnClicked, this);
        this.coverBtn.on("click", this.OnCoverBtnClicked, this);
        this.cancelBtn.on("click", this.OnCancelBtnClicked, this);
        this.saveBtn.on("click", this.OnSaveClicked, this);
        this.deleteBtn.on("click", this.OnDeleteBtnClicked, this);
        this.confirmDeleteBtn.on("click", this.OnConfirmDeleteBtnClick, this);
        this.cancelDeleteBtn.on("click", this.OnCancelDeleteBtnClick, this);
        this.resetBtn.on("click", this.OnResetBtnClicked, this);
    }

    start () {
        this.node.on("LoadConfigFinish", this.CreateLevelChooseBtn, this);
        this.node.on("ChooseEditLevel", this.ShowChooseLevelMap, this);
    }

    OnCoverBtnClicked ()
    {
        this.Serialize();
        this.cover.active = false;
        this.tipCover.active = true;
        this.tipCoverTips.string = "覆盖成功";
    }

    OnResetBtnClicked()
    {
        this.ResetGround();
    }

    OnDeleteBtnClicked ()
    {
        if (this.editBox.string.length == 0)
        {
            this.tipCoverTips.string = "删除关卡不能为空";
            this.tipCover.active = true;
            return;
        }
        let isExsit = false;
        let level = parseInt(this.editBox.string);
        let datas = DataManager.GetInstance().GetLevelDatas();
        for (let i = 0; i < datas.length; i++)
        {
            if (datas[i].level === level)
            {
                isExsit = true;
                break;
            }
        }
        if (isExsit)
        {
            this.deleteCover.active = true;
        }
        else
        {
            this.tipCoverTips.string = "删除关卡不存在！";
            this.tipCover.active = true;
            return;
        } 
    }

    OnConfirmDeleteBtnClick ()
    {
        this.deleteCover.active = false;
        let datas = DataManager.GetInstance().GetLevelDatas();
        let level = parseInt(this.editBox.string);
        for (let i = 0; i < datas.length; i++)
        {
            if (datas[i].level === level)
            {
                datas.splice(i, 1);
                break;
            }
        }

        let childs = this.scrollContent.children;
        for (let i = 0; i < childs.length; i++)
        {
            let childCtrl = childs[i].getComponent(ScrollItemCtrl);
            if (childCtrl.level === level)
            {
                childs[i].destroy();
                break;
            }
        }
        this.tipCover.active =true;
        this.tipCoverTips.string = "关卡删除成功！";
        this.SaveFile();
    }

    OnCancelDeleteBtnClick ()
    {
        this.deleteCover.active = false;
    }

    OnCancelBtnClicked ()
    {
        this.cover.active = false;
    }

    OnTipCoverBtnClicked ()
    {
        this.tipCover.active = false;
    }

    ShowChooseLevelMap ()
    {
        let chooseEditLevel = DataManager.GetInstance().GetCurrentEditLevel();
        let datas = DataManager.GetInstance().GetLevelDatas();
        let data:{id:number, type:number}[] = null;
        let level = -1;
        for (let i = 0; i < datas.length; i++)
        {
            if (chooseEditLevel === datas[i].level)
            {
                this.editBox.string = datas[i].level + "";
                data = datas[i].info;
                level = datas[i].level;
                break;
            }
        }


        for (let i = 0; i < data.length; i++)
        {
            this.buttonCtrlArr[i].Init(data[i].type, level);
        }
    }

    CreateLevelChooseBtn ()
    {
        let datas = DataManager.GetInstance().GetLevelDatas();
        for (let i = 0; i < datas.length; i++)
        {
            let item = cc.instantiate(this.buttonPrefab);
            item.parent = this.scrollContent;
            let itemCtrl = item.getComponent(ScrollItemCtrl);
            itemCtrl.Init(datas[i].level);
        }
    }

    ResetGround ()
    {
        for (let i = 0; i < this.buttonCtrlArr.length; i++)
        {
            this.buttonCtrlArr[i].Reset();
        }
    }

    OnSaveClicked ()
    {
        if (this.editBox.string.length == 0)
        {
            this.tipCoverTips.string = "编辑关卡不能为空";
            this.tipCover.active = true;
            return;
        }

        let level = parseInt(this.editBox.string);
        if (!isNaN(level))
        {
            if (this.IsExsitLevel(level))
            {
                this.cover.active = true;
            }
            else
            {
                this.tipCoverTips.string = "保存成功";
                this.tipCover.active = true;
                this.Serialize();
            }
        }
        else
        {
            this.tipCoverTips.string = "关卡要纯数字";
            this.tipCover.active = true;
            return;
        }
       
    }

    IsExsitLevel (level)
    {
        let isExsit = false;
        let datas = DataManager.GetInstance().GetLevelDatas();
        for (let i = 0; i < datas.length; i++)
        {
            if (datas[i].level === level)
            {
                isExsit = true;
                break;
            }
        }
        return isExsit;
    }

    Serialize ()
    {
        let levelInfo:{id:number, type:number}[] = [];
        for (let i = 0; i < this.buttonCtrlArr.length; i++)
        {
            levelInfo.push(this.buttonCtrlArr[i].GetCurrentConfig());
        }
        let level = parseInt(this.editBox.string);
        this.CreateNewLevelBtn(level);
        DataManager.GetInstance().UpdateData(level, levelInfo);
        this.SaveFile();
    }

    SaveFile ()
    {
        let datasEncode = this.CompressData();
        let data = JSON.stringify({data:datasEncode});
        jsb.fileUtils.writeStringToFile (data, DataManager.GetInstance().GetSavePath());
    }

    CreateNewLevelBtn (level)
    {
        let item = cc.instantiate(this.buttonPrefab);
            item.parent = this.scrollContent;
            let itemCtrl = item.getComponent(ScrollItemCtrl);
            itemCtrl.Init(level);
    }

    CompressData ()
    {
        let datas = DataManager.GetInstance().GetLevelDatas();
        let dealData = [];
        for (let i = 0; i < datas.length; i++)
        {
            let info = [];
            for(let j = 0; j < datas[i].info.length; j++)
            {
                let d = datas[i].info[j];
                info.push(this.EncodeInfo(d.id, d.type))
            }
            dealData.push({level:datas[i].level, info:info});
        }
        return dealData;
    }

    EncodeInfo (id, status)
    {
        let encode = id + "" + status;
        return  parseInt(encode);
    }
    // update (dt) {}
}
