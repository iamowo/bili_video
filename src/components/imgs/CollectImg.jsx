import './scss/collect.scss'

const CollectImg = (props) => {
  const {flag} = props
  return (
    <div>
      {
        flag &&
        <div className="collectbox">
          <div className="bgbox"></div>
          <div className="col-box"></div>
        </div>
      }
    </div>
  )
}

export default CollectImg