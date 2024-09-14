import { useState } from 'react'
import './setting.scss'

function Setting () {
  const [setlist1, setSSetlist1] = useState([
    {id: 0, title: "公开我的收藏"},
    {id: 1, title: "公开关注列表"},
    {id: 2, title: "公开最近点赞视频"},
    {id: 3, title: "公开粉丝列表"},
  ])
  const [set11, setSet11] = useState([
    true, true, false, true
  ])

  const [setlist2, setSSetlist2] = useState([
    {id: 0, title: "公开生日"},
    {id: 1, title: "公开充电信息"}
  ])

  const [set12, setSet12] = useState([
    true, true, false, true
  ])

  const changeset1 = (e) => {
    const index = parseInt(e.target.dataset.index)
    console.log(index);
    setSet11(set11.map((item, i) => {
      if (i === index) {
        return !item
      }
      return item
    }))
  }

  const changeset2 = (e) => {
    const index = parseInt(e.target.dataset.index)
    console.log(index);
    setSet12(set12.map((item, i) => {
      if (i === index) {
        return !item
      }
      return item
    }))
  }

  const [sort1, setSort1] = useState([
    {id: 1, title: "1"},
    {id: 2, title: "2"},
    {id: 3, title: "3"},
    {id: 4, title: "4"},
    {id: 5, title: "5"},
    {id: 6, title: "6"},
  ])
  return (
    <div className="setting-view">
      <div className="setting-title">
        <span>隐私设置</span>
      </div>
      <div className="setting-conetnte1">
        <div className="sc-box1">
          {
            setlist1.map((item, index) =>
            <div className="one-setting-line" key={item.id}>
              <span className="textspan">{item.title}</span>
              <div className="right-div-sp">
                <label for="ckbox" onClick={changeset1}>
                  <input type="checkbox" id='ckbox' checked={set11[index]} data-index={index}/>
                  <div className={set11[index] ? "one-checkdiv box-active" : "one-checkdiv"}>
                    <div className="active-round"></div>
                  </div>
                  {
                    set11[index] ?
                    <span className="text2">公开</span>
                    :
                    <span className="text2">隐藏</span>
                  }
                </label>
              </div>
            </div>
            )
          }
        </div>
        <div className="sc-box1">
          {
            setlist2.map((item, index) =>
            <div className="one-setting-line" key={item.id}>
              <span className="textspan">{item.title}</span>
              <div className="right-div-sp">
                <label for="ckbox" onClick={changeset2}>
                  <input type="checkbox" id='ckbox' checked={set12[index]} data-index={index}/>
                  <div className={set12[index] ? "one-checkdiv box-active" : "one-checkdiv"}>
                    <div className="active-round"></div>
                  </div>
                  {
                    set12[index] ?
                    <span className="text2">公开</span>
                    :
                    <span className="text2">隐藏</span>
                  }
                </label>
              </div>
            </div>
            )
          }
        </div>
      </div>
      <div className="setting-title">
        <span>排序设置</span>
      </div>
      <div className="changesortbox1">
        {
          sort1.map((item, index) => 
            <div draggable className={index === sort1.length - 1 ? "one-sort-box nobottom" : "one-sort-box"} key={item.id}>
              <span className="left-titel">{item.title}</span>
              <span className="icon iconfont">1</span>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Setting