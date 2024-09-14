1. 父元素有transtoram filter perspective属性，例如translate。。的话，子元素fixed不会依据浏览器固定，而是父元素

2.父元素高度是自适应的， 子元素想要scroll-y吗要给父元素加上overfollow： hidden


array.map ： array.map (item => xxx )   // 不用带return
              array.map (item => { return :xxx })  // 要写return

ref={}  和 style{{}} 不同时使用


出现滚动条导致页面抖动
1. overscroll-y: scroll  滚动条一直保存
2. 给父元素加上，一般是body
   padding-left: calc(100vw - 100%);  or
      margin-left: calc(100vw - 100%);



    // 阻止事件冒泡
    e.stopPropagation() // 这是阻止事件的冒泡方法，不让事件向documen上蔓延，但是默认事件任然会执行，当你掉用这个方法的时候，如果点击一个连接，这个连接仍然会被打开。
    e.preventDefault() // 这是阻止默认事件的方法，调用此方法是，连接不会被打开，但是会发生冒泡，冒泡会传递到上一层的父元素