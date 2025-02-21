import './scss/collect.scss'
import { getAllBoards, collectOneImg, createNewBoard } from '../../api/imgs';
import { useEffect, useState } from 'react';
import message from '../notice/notice';

const CollectImg = (props) => {
  const {uid, collectflag, setCollectflag, data} = props

  const [collectlist, setCollectlist] = useState([])
  const [creating, setCreating] = useState(false),        // 创建中
        [newtitle, setNewtitle] = useState("")
  useEffect(() => {
    const getData = async() => {
      const res = await getAllBoards(uid)
      setCollectlist(res)
      console.log(res);
    }
    getData()
  }, [])

  const collectThisImg = async (boardid) => {
    // 收藏， 取消收藏
    const res = await collectOneImg(uid, data.id, boardid)
    if (res) {
      // setCollectlist(await getAllBoards(uid))
      message.open({ type: 'info', content:'收藏成功', flag: true})
    } else {
      message.open({ type: 'error', content:'收藏失败', flag: true})
    }
    closeCollectBox()
  }

  const createABoard = async () => {
    const data1 = {
      uid: uid,
      imgid: data.id,
      boardid: 1
    }
    const res = await createNewBoard(data1)
    if (res) {
      setCollectlist(await getAllBoards(uid))
      message.open({ type: 'warning', content: '创建成功', flag: true})
    }
  }

  // 关闭收集页面
  const closeCollectBox = () => {
    setCollectflag(false)
  }

  return (
    <div>
      {
        collectflag &&
        <div className="collectbox">
          <div className="bgbox"
            onClick={() => setCollectflag(false)}
          ></div>
          <div className="col-box">
            <div className="leftbox">
              <div className="imgbox">
                <img src={data?.path} alt="" />
              </div>
              <div className="tagbox">
                {
                  data?.taglist.map(item =>
                    <div className="onetag">{item}</div>
                  )
                }
              </div>
            </div>
            <div className="rightbox">
              <div className="text-line">
                <span>收藏</span>
                <span className="iconfont"
                  onClick={() => setCollectflag(false)}
                >&#xe66a;</span>
              </div>
              <div className="collectb">
                <div className="one-collcet"
                  onClick={() => collectThisImg()}
                >
                  <div className="imgdiv">
                    <span className="iconfont">&#xe8c3;</span>
                  </div>
                  <div className="infodiv">
                    <div className="title">喜欢</div>
                    <div className="nums">{12}</div>
                    <div className="collcet">收集</div>
                  </div>
                </div>
                {
                  collectlist.map(item =>
                    <div className="one-collcet"
                      onClick={() => collectThisImg(item.id)}
                    >
                      <div className="imgdiv">
                        {
                          item.coverlist &&
                          <img src={item.coverlist[0]} alt="" />
                        }
                      </div>
                      <div className="infodiv">
                        <div className="title">{item.title}</div>
                        <div className="nums">{item.nums}</div>
                        <div className="collcet">收集</div>
                      </div>
                    </div>
                  )
                }
              </div>
              <div className="addnewline">
                {
                  creating ?
                  <div className="createnewbox">
                    <input type="text" className="titleinp"
                      placeholder='收藏夹名称'
                      value={newtitle}
                      onChange={(e) => setNewtitle(e.target.value)}
                    />
                    <div className="canclebox"
                      onClick={() => {
                        setNewtitle("")
                        setCreating(false)
                      }}
                    >取消</div>
                    <div className="canclebox okbox"
                      onClick={() => createABoard()}
                    >创建</div>
                  </div>
                  :
                  <div className="addone"
                    onClick={() => setCreating(true)}
                  >
                    <span className="iconfont">&#xe63e;</span>
                    <span>创建新的收藏夹</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default CollectImg