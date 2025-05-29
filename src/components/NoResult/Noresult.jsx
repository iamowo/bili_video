import img from '../../static/assets/nodata02.png'

function Noresult () {
  return (
    <div className="noresult-box"
      style={{
          width: '100%',
          height: '300px',
          // background: `url(${baseurl}/sys/nodata02.png)`,
          background: `url(${img})`,
          backgroundPosition: 'center 50px',
          backgroundRepeat: 'no-repeat'}}>
    </div>
  )
}

export default Noresult