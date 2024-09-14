import { useEffect, useState } from 'react'
import './index.scss'
import { searchUser, toFollow, toUnfollow } from '../../../api/user'
import { useParams } from 'react-router-dom'
import { touserspace } from '../../../util/fnc'

function UserS () {
  const params = useParams()
  const keyword = params.keyword
  const uid = parseInt(params.uid != null ? params.uid : -1)

  const [usersort, setUsersort] = useState(0)
  const [userlist, setUserlist] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await searchUser(keyword, uid, 0);
      console.log(res);
      
      setUserlist(res)
    }
    getData()
  },[])
  const tothisusersort = async (e) => {
    const index= parseInt(e.target.dataset.index)
    setUsersort(index)
    const res = await searchUser(keyword, uid, index);
    setUserlist(res)
  }

  const tofollow = async (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    const uid2 = parseInt(e.target.dataset.uid || e.target.parentNode.dataset.uid)
    if (uid2 === uid) {
      alert('不能对自己操作')
      return
    }
    const res = toFollow(uid2, uid)
    if (res) {
      const newarray = userlist.map((item, i) => {
        if (i === index) {
          item.fans += 1
          item.followed = !item.followed
        }
        return item
      })
      setUserlist(newarray)
      console.log(newarray);
    }    
  }

  const tounfollow = async (e) => {
    const index = parseInt(e.target.dataset.index)
    const uid2 = parseInt(e.target.dataset.uid)
    const res = toUnfollow(uid2, uid)
    if (res) {
      const newarray = userlist.map((item, i) => {
        if (i === index) {
          item.fans -= 1
          item.followed = !item.followed
        }
        return item
      })
      setUserlist(newarray)
      console.log(newarray);
    }    
  }
  return (
    <div className="userspage">
      <div className="res-sort">
          <div className="sort-line">
            <div className="srot-part">
              <div className={usersort === 0 ? "sort1 sort-active" : "sort1"} data-index={0} onClick={tothisusersort}>默认排序</div>
              <div className={usersort === 1 ? "sort1 sort-active" : "sort1"} data-index={1} onClick={tothisusersort}>粉丝数由高到低</div>
              <div className={usersort === 2 ? "sort1 sort-active" : "sort1"} data-index={2} onClick={tothisusersort}>粉丝数由低到高</div>
              <div className={usersort === 3 ? "sort1 sort-active" : "sort1"} data-index={3} onClick={tothisusersort}>Lv有高到底</div>
              <div className={usersort === 4 ? "sort1 sort-active" : "sort1"} data-index={4} onClick={tothisusersort}>Lv有低到高</div>
            </div>
          </div>
        </div>
        <div className="user-search-content">
          {
            userlist.map((item, index) =>
              <div className="one-user-serach-box">
                <img src={item.avatar} alt="" className="ousb-leftavatar"
                  data-uid={item.uid} onClick={touserspace}/>
                <div className="ousb-rightinfo">
                  <div className="ousbr-name">
                    <span data-uid={item.uid} onClick={touserspace} className='namespan'>{item.name}</span>
                    <span className="lvspan">{'Lv:' + item.lv}</span>
                  </div>
                  <div className="ousbr-infos icon iconfont">{item.fans}粉丝&#xec1e;{item.videos}个视频</div>
                  {
                    item.followed ?
                    <div className="ousbr-dountsub" data-index={index} data-uid={item.uid} onClick={tounfollow}>已关注</div>
                    :
                    <div className="ousbr-subornot" data-index={index} data-uid={item.uid} onClick={tofollow}>
                      {
                        item.uid === uid ?
                        <span>MySelf</span>
                        :
                        <span>+ 关注</span>
                      }
                    </div>
                  }
                </div>
              </div>
            )
          }
        </div>
    </div>
  )
}

export default UserS