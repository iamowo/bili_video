import './at.scss'
import { useEffect, useState } from 'react'
import { getFollow, getFans } from '../../api/user'

function At(props) {
  const uid = parseInt(props.uid)
  const [ulist, setUlist] = useState([])

  useEffect(() => {
    const getData = async () => {
      console.log('uid is:', uid);
      const res = await Promise.all([getFollow(uid), getFans(uid)])
      const temp = res[0].concat(res[1])
      console.log(temp);
      setUlist(temp.filter((item, index, self) => self.indexOf(item) === index))
    }
    getData()
  },[])
  return (
    <div className="at-box-view">
      <div className="at-title">选择你想@的人</div>
      <div className="at-content">
        {
          ulist.map(item => 
            <div className="one-select-user"
              key={item.uid}
              onClick={() => {
                props.setAtflag(false)
                props.setAtuser(item)
              }}
            >
              <div className="left-usert-avatar">
                <img src={item.avatar} alt="" className='user-img'/>
              </div>
              <div className="right-user-info">
                <div className="user-name">{item.name}</div>
                <div className="user-fans">{item.fans}</div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default At