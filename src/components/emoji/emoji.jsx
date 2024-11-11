import { useState } from 'react'
import './emoji.scss'

function Emoji(props) {
  const [index, setIndex] = useState(0)
  const [style, setStyle] = useState([
      {id: 0, text: 'emoji', img: '😄'},
      {id: 1, text: '颜文字', img: 'O(∩_∩)O'}
    ])
  const imgs1 = [
    {id: 0, img: '😀'},
    {id: 1, img: '😄'},
    {id: 2, img: '😁'},
    {id: 3, img: '😆'},
    {id: 4, img: '😅'},
    {id: 5, img: '🤣'},
    {id: 6, img: '😂'},
    {id: 7, img: '🙂'},
    {id: 8, img: '🙃'},
    {id: 9, img: '😊'},
    {id: 10, img: '😇'},
    {id: 11, img: '🥰'},
    {id: 12, img: '😍'},
    {id: 13, img: '😗'},
    {id: 14, img: '😋'},
    {id: 15, img: '🤪'},
    {id: 16, img: '🤗'},
    {id: 17, img: '🤭'},
    {id: 18, img: '🤢'},
    {id: 19, img: '🤮'},
    {id: 20, img: '😎'},
    {id: 21, img: '🤓'},
    {id: 22, img: '😨'},
    {id: 23, img: '😓'},
    {id: 24, img: '💩'},
    {id: 25, img: '😨'},
    {id: 26, img: '🐮'},
    {id: 27, img: '🍺'},
    {id: 28, img: '✋'},
    {id: 29, img: '✌️'},
    {id: 30, img: '🐒'},
    {id: 31, img: '🐵'},
    {id: 32, img: '🐶'},
    {id: 33, img: '🐷'},
    {id: 34, img: '🐖'},
    {id: 35, img: '🐀'},
    {id: 36, img: '🐰'},
    {id: 37, img: '🐭'},
    {id: 38, img: '🐸'},
    {id: 39, img: '🐲'},
    {id: 40, img: '🥵'},
    {id: 41, img: '🌞'},
    {id: 42, img: '👌'},
    {id: 43, img: '🤏'},
    {id: 44, img: '🫰'},
    {id: 45, img: '🤟'},
    {id: 46, img: '🖕'},
    {id: 47, img: '👇'},
    {id: 48, img: '🫵'},
    {id: 49, img: '👍'},
    {id: 50, img: '👎'},
  ]
  const imgs2 = [
    {id: 0, img: 'O(∩_∩)O'},
    {id: 1, img: '@(｡･o･)@'},
    {id: 2, img: '@(o･ｪ･)@'},
    {id: 3, img: '( 。＿ 。）'},
    {id: 4, img: '( ´_ゝ`)✎'},
    {id: 5, img: '|ω・）'},
    {id: 6, img: '|･ω･｀)'},
    {id: 7, img: '(´･_･`)'},
    {id: 8, img: '•﹏•'},
    {id: 9, img: '◑▂◐'},
    {id: 10, img: '눈_눈'},
    {id: 11, img: '＼（＾▽＾）／'},
    {id: 12, img: 'ᕕ( ᐛ )ᕗ'},
    {id: 13, img: '(☄⊙ω⊙)☄'},
    {id: 14, img: 'w(ﾟДﾟ)w'},
    {id: 15, img: '（〃｀ 3′〃）'},
    {id: 16, img: 'U•ェ•*U'},
    {id: 17, img: 'o( =•ω•= )m'},
    {id: 18, img: '(￣_,￣ )'},
    {id: 19, img: '＜（＾－＾）＞'},
    {id: 20, img: '(ง •_•)ง'}
  ]
  const [imgs, setImgs] = useState(() => imgs1)
  return (
    <div className="emoji-view-box">
      <div className="emoji-title">{style[index].text}</div>
      <div className="emoji-content">
        {
          imgs.map(item =>
            <div className={index === 0 ?"one-img" : "one-img2"}
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
              onClick={(e) => {
                e.stopPropagation()
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