import { useEffect, useState, memo } from "react"
import "../scss/boards.scss"
import { useOutletContext } from "react-router-dom"
import { getAllBoards } from "../../../api/imgs"
import { toThisBoard } from "../../../util/fnc"

const CreateNewBoard = memo((props) => {
  const [inputflag, setInputflag] = useState(0)
  const [inp1, setInp1] = useState(""),
        [inp2, setInp2] = useState(""),
        [createflag, setCreateflag] = useState(false),
        [coverType, setCoverType] = useState(0),
        [coverChangeFlag, setCoverChangeFlag] = useState(false)

  const [classifylist, setClassifylist] = useState([
    {id: 0, text: '0'},
    {id: 1, text: '1'},
    {id: 2, text: '2'},
    {id: 3, text: '3'},
    {id: 4, text: '4'},
    {id: 5, text: '5'}
  ])

  useEffect(() => {
    console.log('inp2: ', inp2);
    setCreateflag(inp1.length > 0 && inp2.length)
  }, [inp1, inp2])

  const cancleCreate = () => {
    setInp1("")
    setInp2("")
    props.setCreateFlag(false)
  }

  const createNewBOardFnc = () => {
    if (createflag) {

    } else {
      return
    }
  }

  return (
    <div className="blackview">
      <div className="createbox">
        <div className="createtopline">
          <span className="txtmid">创建收藏夹</span>
          <span className="iconfont"
            onClick={() => cancleCreate()}
          >&#xe66a;</span>
        </div>
        <div className="coverbox">
          <div className="addcoverbox"
            onClick={() => setCoverChangeFlag(true)}
          ></div>
        </div>
        {
          coverChangeFlag &&
          <div className="changecoverline">
            <div className="switchbox">
              <input type="radio" className="swit1" id="tp1" name="type"/>
              <label htmlFor="tp1">默认第一张图片为封面</label>
            </div>
            <div className="switchbox">
              <input type="radio" className="swit2" id="tp2" name="type"/>
              <label htmlFor="tp2">自选图片</label>
            </div>
          </div>
        }
        <div className={inputflag === 1 || inp1.length > 0 ? "inputline inputline-active" : "inputline"}>
          <div className="inputtitle">标题</div>
          <input type="text" className="inp1"
            onFocus={() => setInputflag(1)}
            onBlur={() => setInputflag(0)}
            onChange={(e) => setInp1(e.target.value)}
            value={inp1}
          />
        </div>
        <div className={inputflag === 2 || inp2.length > 0 ? "inputline inputline-active" : "inputline"}>
          <div className="inputtitle">分区</div>
          <input type="text" className="inp1"
            onFocus={() => setInputflag(2)}
            onBlur={() => setInputflag(0)}
            onChange={(e) => setInp2(e.target.value)}
            value={inp2}
          />
          {
            inp2.length > 0 ?
            <div className="iconfont"
              style={{cursor: 'pointer'}}
              onClick={() => setInp2("")}
            >&#xe640;</div>
            :
            <div className="iconfont">&#xe624;</div>
          }
          {
            inputflag === 2 &&
            <div className="classify-selectbox">
              {
                classifylist.map(item =>
                <div className="oneselect"
                  key={item.id}
                  // onClick 会在 onBlur 之后执行
                  onMouseDown ={() => setInp2(item.text)}
                >{item.text}</div>
                )
              }
            </div>
          }
        </div>
        <div className="okline">
          <div className="canclebox"
            onClick={() => cancleCreate()}
          >取消</div>
          <div className={ createflag ? "okbox okbox-active" : "okbox"}
            onClick={() => createNewBOardFnc()}
          >创建</div>
        </div>
      </div>
    </div>
  )
})

const BoradsComponents = () => {
  const [boardlist, setBoardlist] = useState([]),
        [displaystyle, setStyle] = useState(true)
  const context = useOutletContext(),
        uid = context.uid
  const [createFlag, setCreateFlag] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getAllBoards(uid)])
      console.log(res);
      
      setBoardlist(res[0])
    }
    getData()
  }, [])
  
  return (
    <div className="allboardview">
      {
        createFlag &&
        <CreateNewBoard
          setCreateFlag = {setCreateFlag}
        />
      }
      <div className="b-lines">
        <div className="onebox">全部</div>
        <div className="onebox">全部</div>
        <div className="onebox">全部</div>
      </div>
      <div className="boards-con">
        <div className="one-board">
          <div className="innerboximg">
            <div className="imgbox">
              <div className="addbox"
                onClick={() => setCreateFlag(true)}
              >
                <span>+</span>
              </div>
            </div>
            <div className="ingobox">
              <div className="titleline">创建收藏夹</div>
              <div className="infol">创建你的收藏夹</div>
            </div>
          </div>
        </div>
        {
          boardlist.map(item => 
            <div className="one-board"
              key={item.id}
            >
              <div className="innerboximg">
                <div className="imgbox">
                  <div className="imgcoverbox"
                    onClick={(() => toThisBoard(item.id))}
                  >
                    <div className="editorimgbox">
                      <div className="iconfont icon1">&#xe685;</div>
                      <span className="spp"></span>
                      <div className="iconfont icon2">&#xe658;</div>
                    </div>
                  </div>
                  <div className="box1">
                    <img src={item.coverlist[0]} alt="" className="b1img" />
                  </div>
                  <div className="box2">
                    <div className="imgbox2">
                      <img src={item.coverlist[1]} alt="" className="b2img" />
                    </div>
                    <div className="imgbox2">
                      <img src={item.coverlist[2]} alt="" className="b2img" />
                    </div>
                  </div>
                </div>
                <div className="ingobox">
                  <div className="titleline">{item.title}</div>
                  <div className="infol">{item.collects}采集 {item.likes}关注</div>
                </div>
              </div>
            </div>
          )
        }
      </div>
      <div className="noemoeline">没有更多了~</div>
    </div>
  )
}

export default BoradsComponents
