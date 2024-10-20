import { useState } from 'react'
import './emoji.scss'

function Emoji(props) {
  const [index, setIndex] = useState(0)
  const [style, setStyle] = useState([
      {id: 0, text: 'emoji', img: '😄'},
      {id: 0, text: '颜文字', img: 'O(∩_∩)O'}
    ])
  const imgs1 = [
    {id: 0, img: '😀'},
    {id: 1, img: '😄'},
    {id: 2, img: '😀'},
    {id: 3, img: '😀'},
    {id: 4, img: '😀'},
    {id: 5, img: '😀'},
    {id: 6, img: '😀'},
    {id: 7, img: '😀'},
    {id: 8, img: '😀'},
    {id: 9, img: '😀'},
    {id: 10, img: '😀'},
    {id: 11, img: '😀'},
    {id: 12, img: '😀'}
  ]
  const imgs2 = [
    {id: 0, img: 'O(∩_∩)O'},
    {id: 1, img: 'O(∩_∩)O'},
    {id: 2, img: 'O(∩_∩)O'},
    {id: 3, img: 'O(∩_∩)O'},
    {id: 4, img: 'O(∩_∩)O'},
    {id: 5, img: 'O(∩_∩)O'},
    {id: 6, img: 'O(∩_∩)O'},
    {id: 7, img: 'O(∩_∩)O'},
    {id: 8, img: 'O(∩_∩)O'},
    {id: 9, img: 'O(∩_∩)O'},
    {id: 10, img: 'O(∩_∩)O'},
    {id: 11, img: 'O(∩_∩)O'},
    {id: 12, img: 'O(∩_∩)O'}
  ]
  const [imgs, setImgs] = useState(() => imgs1)
  return (
    <div className="emoji-view-box">
      <div className="emoji-title">{style[index].text}</div>
      <div className="emoji-content">
        {
          imgs.map(item =>
            <div className="one-img"
              key={item.id}
              onClick={() => {
                props.setOneemoji(item.img)
                props.setEmojiflag(false)
              }}
            >{item.img}</div>
          )
        }
      </div>
      <div className="emoji-switch">
        {
          style.map((item, i) =>
            <div className="one-imgbox"
              key={item.id}
              style={{backgroundColor: i === index ? '#fff' : 'transparent'}}
              onClick={() => {
                setIndex(i)
                if (i === 0) {
                  setImgs(imgs1)
                } else if (i === 1) {
                  setImgs(imgs2)
                }
              }}
            >{item.img}</div>
          )
        }
      </div>
    </div>
  )
}

export default Emoji