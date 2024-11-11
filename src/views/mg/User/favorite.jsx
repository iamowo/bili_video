import "./User.scss"
import { useEffect, useState } from "react"
import { getMgList, updateMgStatus  } from "../../../api/mg"
import { tothismg } from '../../../util/fnc'
import { useOutletContext } from "react-router-dom"

function UserFavorite() {
  const context = useOutletContext(),
        uid = context.uid
  console.log('context is:', context);
  
  const [books, setBooks] = useState([])
  const [editorflag, setEditorflag] = useState(false)
  const [editornum, setEditornum] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getMgList(uid, 0);
      setBooks(res)
      setEditornum(new Array(res.length).fill(false))
    }
    getData()
    document.title = '漫画收藏'
  }, [])

  const todelete = async () => {
    const mids = []
    editornum.forEach((item, index) => {
      if (item) {
        mids.push(books[index].mid)
      }
    })
    if (mids.length === 0) {
      alert('未选中')
      return
    }
    const data = {
      uid: uid,
      midlist: mids,
      type: 0,
      deleted: 1,
      num: 0
    }    
    const res = await updateMgStatus(data)
    if (res) {
      const res2 = await getMgList(uid, 0);
      setBooks(res2)
      setEditornum(new Array(res.length).fill(false))
    }
    setEditorflag(false)
  }

  const changenums = (index) => {    
    const newarray = editornum.map((item, ind) => {
      if (ind === index) {
          return !item
      } else {
        return item
      }
      }
    )    
    setEditornum(newarray)
  }
  return (
    <div className="content-view">
      <div className="content-title-user">
        <span className="tt-span">我的收藏</span>
        {
          editorflag ?
          <div className="right-con">
            <div className="deletebtn2"
              onClick={todelete}
            >确认删除</div>
            <div className="cancle-top-btn2"
              onClick={() => {
                setEditorflag(false)
                setEditornum(new Array(editornum.length).fill(false))
              }}
            >取消</div>
          </div>
          :
          <div className="right-con">
            <span onClick={() => setEditorflag(true)}>编辑</span>
          </div>
        }
      </div>
      <div className="user-books-content">
        {
          books.map((item, index) =>
            <div className="one-user-book">
              <div className="imgbox-user">
                {
                  editorflag &&
                  <div className="mask-imgbox"
                    onClick={() => changenums(index)}
                  >
                    <input type="checkbox" id="ckbox"
                      checked={editornum[index]}
                      value={editornum[index]}
                      onChange={() => changenums(index)}
                    />
                  </div>
                }
                <img src={item.cover} alt="" className="top-user-img"
                  onClick={() => tothismg(uid, item.mid)}
                />
              </div>
              <div className="bottom-user-infos">
                <div className="bui-title"
                  onClick={() => tothismg(uid, item.mid)}
                >{item.title}</div>
                <div className="bui-chapters">
                  {
                    item.done === 1 ?
                    <span>已完结,一共{item.chapters}章</span>
                    :
                    <span>连载中,更新至{item.chapters}章</span>
                  }
                </div>
              </div>
            </div>     
          )
        }
      </div>
    </div>
  )
}

export default UserFavorite