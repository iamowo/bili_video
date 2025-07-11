import { useEffect, useState } from 'react'
import '../scss/UserSpace/setting.scss'
import { changeSetting, getSetting } from '../../../api/user'
import { useOutletContext, useParams } from 'react-router-dom'

function Setting () {
  const context = useOutletContext()
  const hisuid = context.hisuid
  // ⭐ context 中的信息刷新之后会丢失
  // const fatherdata = useOutletContext()
  // const isme = fatherdata.isme
  // const usersetting = fatherdata.usersetting
  useEffect(() => {
    const getData = async () => {
      const res = await getSetting(hisuid)
      console.log(res);
      setSet11([
        res.favlist,
        res.followlist,
        res.likerecently,
        res.fanslist
      ])
      setSet12([
        res.birthday,
        res.donate
      ])
    }
    getData()
  }, [])
  const [setlist1, setSSetlist1] = useState([
    {id: 0, title: "公开我的收藏"},
    {id: 1, title: "公开关注列表"},
    {id: 2, title: "公开最近点赞视频"},
    {id: 3, title: "公开粉丝列表"},
  ])
  const [set11, setSet11] = useState([0, 0, 0, 0])
  const [setlist2, setSSetlist2] = useState([
    {id: 0, title: "公开生日"},
    {id: 1, title: "公开充电信息"}
  ])
  const [set12, setSet12] = useState([0,0])

  // ⭐ !0 === true   !1 === false
  const changeset1 = async (e) => {
    const index = parseInt(e.target.dataset.index)
    const newset = set11.map((item, i) => {
      if (i === index) {
        if (item === 0) return 1
        else return 0
      }
      return item
    })
    setSet11(newset)
    const data = {
      uid: hisuid,
      favlist: newset[0],
      followlist: newset[1],
      likerecently: newset[2],
      fanslist: newset[3]
    }
    const res = await changeSetting(data)
    if (res) {
      const res2 = await getSetting(hisuid)
      setSet11([
        res2.favlist,
        res2.followlist,
        res2.likerecently,
        res2.fanslist
      ])
    }
  }

  const changeset2 = async (e) => {
    const index = parseInt(e.target.dataset.index)
    const newset = set12.map((item, i) => {
      if (i === index) {
        if (item === 0) return 1
        else return 0
      }
      return item
    })
    setSet12(newset)
    const data = {
      uid: hisuid,
      birthday: newset[0],
      donate: newset[1]
    }
    const res = await changeSetting(data)
    if (res) {
      const res2 = await getSetting(hisuid)
      setSet12([
        res2.birthday,
        res2.donate
      ])
    }
  }

  const [sort1, setSort1] = useState([
    {id: 1, title: "1"},
    {id: 2, title: "2"},
    {id: 3, title: "3"},
    {id: 4, title: "4"},
    {id: 5, title: "5"},
    {id: 6, title: "6"},
  ])
  // 拖拽索引
  const [draggedIndex, setDraggedIndex] = useState(null),
        [isDragging, setIsDragging] = useState(false);

   const handleDragStart = (index) => {
    setDraggedIndex(index);
    setIsDragging(true);
  }

   const handleDragOver = (index) => {
    console.log("index: ", index);
    
    if (draggedIndex === null) return;

    const newSort1 = [...sort1];
    const draggedItem = newSort1[draggedIndex];

    // Remove the dragged item from its original position
    newSort1.splice(draggedIndex, 1);
    // Insert the dragged item at the new position
    newSort1.splice(index, 0, draggedItem);

    setSort1(newSort1);
    setDraggedIndex(index);
  }

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setIsDragging(false);
  }

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
                  <div className={set11[index] === 0 ? "one-checkdiv box-active" : "one-checkdiv"}>
                    <div className="active-round"></div>
                  </div>
                  {
                    set11[index] === 0 ?
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
                  <div className={set12[index] === 0 ? "one-checkdiv box-active" : "one-checkdiv"}>
                    <div className="active-round"></div>
                  </div>
                  {
                    set12[index] === 0 ?
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
            <div
                draggable
                className={`one-sort-box ${index === sort1.length - 1 ? 'nobottom' : ''} ${
                  index === draggedIndex && isDragging ? 'dragging' : ''
                }`}
                key={item.id}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleDragOver(index);
                }}
                onDragEnd={handleDragEnd}
                style={{
                  transform: index === draggedIndex ? 'scale(1.05)' : 'none', // 拖拽时放大效果
                }}
              >
              <span className="left-titel">{item.title}</span>
              <span className="iconfont">&#xe658;</span>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Setting