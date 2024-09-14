import "./maintag.scss"
import Topnav from "../../components/Topnav/Topnav"
import { useEffect, useState } from "react"
import { getAllMainTag } from "../../api/video"

function AllMaintag() {
  const [tags, setTgs] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getAllMainTag()
      console.log(res);
      setTgs(res)
    }
    getData()
  },[])

  const tothistag = (e) => {
    const maintag = e.target.dataset.maintag || e.target.parentNode.dataset.maintag
    window.open(`/channels/${maintag}`, "blank")
  }
  return (
    <div className="more-view-box">
      <Topnav />
      <div className="centertag-view">
        <div className="cv-title">ALL tags</div>
        <div className="cv-content">
          {
            tags.map(item =>
              <div className="onetagas" key={item.maintag} data-maintag={item.maintag} onClick={tothistag}>
                <span className="lspop">{item.maintag}</span>
                <span className="rspop">{item.num}</span>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default AllMaintag