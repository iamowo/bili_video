import { useEffect, useState } from "react"
import "./User.scss"
import { useOutletContext } from "react-router-dom"
import { getMgList, updateMgStatus } from "../../../api/mg"
import { tothismg } from '../../../util/fnc'

document.title = '观看历史'

function UserHistory() {
  const context = useOutletContext(),
        uid = context.uid
  const [books, setBooks] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getMgList(uid, 1);
      console.log(res);
      setBooks(res)
    }
    getData()
  }, [])

  const changemg = async () => {
    const data = {
      uid: uid,
      num: 0,
      type: 1,
      deleted: 1
    }
    const res = await updateMgStatus(data)
    if (res) {
      const res2 = await getMgList(uid, 0)
      setBooks(res2)
    }
  }
  return (
    <div className="content-view">
      <div className="content-title-user">
        <span className="tt-span">历史信息</span>
        <div className="right-con">
          <span onClick={changemg}>清除历史</span>
        </div>
      </div>
      <div className="user-books-content">
        {
          books.map(item =>
            <div className="one-user-book">
              <img src={item.cover} alt="" className="top-user-img"
                onClick={() => tothismg(uid, item.mid)}
              />
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

export default UserHistory