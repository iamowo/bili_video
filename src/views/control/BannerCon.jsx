import { memo, useEffect, useRef, useState } from "react";
import "./scss/bannercon.scss";
import Banner from "../../components/Banner/Banner";
import Noresult from "../../components/NoResult/Noresult";
import {
  getBanner,
  getBannerUnselected,
  setBanner,
  addNewBanner,
  updateOneBanner,
  deleteThisBanner,
  addBannerToList
} from "../../api/banner";
import message from "../../components/notice/notice";
import React from "react";
import { ColorPicker, Space } from "antd";
import { getVideos } from "../../api/video";
import { getAnimations } from "../../api/animation";
import { getMgsss } from "../../api/mg";
import { fileToBase64 } from "../../util/fnc";

const DEFAULT_COLOR = [
  {
    color: "rgb(0, 0, 0)",
    percent: 0,
  },
  {
    color: "rgb(0, 0, 0)",
    percent: 35,
  },
  {
    color: "rgb(0, 0, 0)",
    percent: 100,
  },
];

const Bannercon = () => {
  const [playflag, setPlayflag] = useState(true);
  const [bannerlist, setBanner] = useState([]),
    [bannerlist2, setBannerlist2] = useState([]); // 未选择列表
  
  // 选择bannerlist
  const [list1index, setList1index] = useState(-1)

  const [vfalg, setVflag] = useState(-1);
  const [bannerchecked, setChecked] = useState([]);
  const [newtitle, setNewtitle] = useState(""),
    [newcolor, setNewcolor] = useState(
      "linear-gradient(to bottom, rgb(0,0,0) 0%, rgb(0,0,0) 35%, rgb(0,0,0) 100%)"
    ),
    [newCover, setNewcover] = useState(), // base64
    [coverfile, setCoverfile] = useState(), // file
    [coverUrl, setCoverurl] = useState(null), // url
    fileref = useRef();

  const [idindex, setIdindex] = useState(0),
    [idlist, setIdlist] = useState([]),
    [select, setSelect] = useState({ id: -1, type: -1, typeName: "" }),
    [selecedindex, setSelectindex] = useState(-1);
  const [nowinfo, setNowinfo] = useState({ id: -1, ind: -1 }); // 要编辑/删除的
  useEffect(() => {
    const getData = async () => {
      if (idindex === 0) {
        const res = await getVideos(0);
        console.log(res);

        setIdlist(res);
      } else if (idindex === 1) {
        const res = await getAnimations(0);
        console.log("animationlist:", res);
        setIdlist(res);
      } else if (idindex === 2) {
        setIdlist([]);
        // 获取全部活动
      } else if (idindex === 3) {
        const res = await getMgsss(0);
        console.log(res);
        setIdlist(res);
      }
    };
    getData();
  }, [idindex]);

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getBanner()]);
      console.log(res);
      setBanner(res[0]);
    };
    getData();
  }, []);

  // 添加到列表中
  const addToLis = async () => {
    const len = bannerlist.length
    const id =  bannerlist2[list1index].id
    const res = await addBannerToList(id, len)
    if (res) {
      const res2 = await getBanner()
      setBanner(res2)
    }
    setVflag(-1)
    setList1index(-1)
  }

  const inputfile = (e) => {
    const file = e.target.files[0];
    if (!file.type.includes("image/")) {
      message.open({ type: "warning", content: "此文件不为图片" });
      return;
    }
    if (file != null) {
      setCoverfile(file);
      setCoverurl(URL.createObjectURL(file));
    } else {
      message.open({ type: "info", content: "没有找到文件" });
    }
  };

  // 删除这个banner
  const cancelthisbanner = async () => {
    console.log(nowinfo);
    
    const r = await deleteThisBanner(nowinfo.ind);
    if (r) {
      const res = await getBanner()
      setBanner(res)
      setNowinfo({
        id: -1,
        ind: -1,
      });
      setVflag(-1);
    }
  };

  const addOnebanner = async () => {
    setVflag(0)
    const res = await getBannerUnselected()
    setBannerlist2(res);
  }
  // 创建新的banner
  const okbtntosend = async () => {
    if (
      select.id === -1 ||
      newtitle === "" ||
      newcolor === "" ||
      coverfile == null
    ) {
      message.open({ type: "warning", content: "缺少信息" });
      return;
    }
    fileToBase64(coverfile)
      .then(async (res) => {
        console.log(res);
        const data = {
          targetId: select.id,
          type: select.type,
          coverfile: res,
          title: newtitle,
          bgc: newcolor,
        };
        const res2 = await addNewBanner(data);
        setVflag(0);
        backData();

        const res3 = await getBannerUnselected();
        setBannerlist2(res3);
        // 变量回复初始化状态
        if (res2) {
          message.open({ type: "info", content: "创建成功", flag: true });
        }
      })
      .catch((e) => {
        console.log("error");
      });
  };

  // 恢复初始化信息
  const backData = () => {
    setNewcolor(
      "inear-gradient(to bottom, rgb(0,0,0) 0%, rgb(0,0,0) 35%, rgb(0,0,0) 100%)"
    );
    setNewtitle("");
    setCoverurl(null);
    setSelect({ id: -1, type: -1, typeName: "" });
    setSelectindex(-1);
  };
  // 切换top的类型
  const selecttopindex = (type) => {
    setIdindex(type);
    setSelectindex(-1);
  };

  const clickthis = (id, type, typeName, index) => {
    if (selecedindex !== -1) {
      setSelectindex(-1);
      setSelect({
        id: -1,
        type: -1,
        typeName: "",
      });
      return;
    }
    setSelectindex(index);
    setSelect({
      id: id,
      type: type,
      typeName: typeName,
    });
  };

  const updateBannerinfo = async () => {
    const data = {
      id: bannerlist[nowinfo.ind].id,
      title: newtitle,
    }
    console.log('new color is:', newcolor);
    
    if (newcolor !== 'linear-gradient(to bottom, rgb(0,0,0) 0%, rgb(0,0,0) 35%, rgb(0,0,0) 100%)') {
      data.bgc = newcolor
    }
    console.log(data);
    const res = await updateOneBanner(data)
    message.open({})
    setVflag(-1)
  }
  return (
    <div className="banner-view">
      <div className="bv-topbox">
        <span className="bv-tit">Banner Setting</span>
        <span className="bv-tit2">{bannerlist.length}</span>
      </div>
      <div className="bv-content">
        <div className="bv-banner-show1">
          <div className="bbs-title">example</div>
          <div className="bb-bannerbox">
            {
              bannerlist.length > 0 &&
              <Banner
                playflag={playflag}
                bannerlist = {bannerlist}
                listLenght = {bannerlist.length}
              />
            }
          </div>
          <div className="conbtn">
            {playflag ? (
              <div
                className="playbtn"
                onClick={() => {
                  setPlayflag(false);
                }}
              >
                play
              </div>
            ) : (
              <div
                className="playbtn stopb"
                onClick={() => {
                  setPlayflag(true);
                }}
              >
                stop
              </div>
            )}
          </div>
        </div>
        <div className="bv-banner-change-box">
          <div className="change-box">
            {
              bannerlist.map((item, index) => (
                <OneBanner
                  key={item.id}
                  item={item}
                  index={index}
                  listLength={bannerlist.length}
                  // 更新列表
                  onMove={(prevIndex, nextIndex) => {
                    const newList = [...bannerlist]
                    // 新元素插入到列表中
                    newList.splice(nextIndex, 0, newList.splice(prevIndex, 1)[0])
                    // 更新列表状态
                    setBanner(newList)
                  }}  
                  setVflag={setVflag}
                  setNewcolor={setNewcolor}
                  setNewtitle={setNewtitle}
                  setNowinfo={setNowinfo}
                />
              ))
            }
            <div className="one-banner">
              <div
                className="addnew-banner"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={addOnebanner}
              >
                add new one
              </div>
            </div>
          </div>
        </div>
      </div>
      {vfalg >= 0 && (
        <div className="banner-c-view">
          <div className="bcv-black"></div>
          {vfalg === 0 && (
            <div className="select-banner-box">
              <div className="sbb-top">
                <span>select</span>
                <span className="iconfont" onClick={() => setVflag(-1)}>
                  &#xe66a;
                </span>
              </div>
              <div className="select-content">
                {bannerlist2.length === 0 ? (
                  <div>
                    <Noresult />
                  </div>
                ) : (
                  <div>
                    {bannerlist2.map((item, index) => (
                      <div className="one-bn" key={item.id}>
                        <div className="hover-box"
                          style={{backgroundColor: list1index === index ? '#53b0df52' : '#ffffff00'}}
                          onClick={() => {
                            if (list1index === index) {
                              setList1index(-1)
                            } else {
                              setList1index(index)
                            }
                          }}
                        ></div>
                        <div className="box-bn2-img">
                          <img src={item.cover} alt="" className="bbi-img" />
                        </div>
                        <div className="bn2-right-info2">
                          <div className="title-bn2">{item.title}</div>
                          <div className="type-bn2">type: {item.type}</div>
                        </div>
                      </div>
                    ))}
                    <div className="one-bn">
                      <div
                        className="hover-box"
                        onClick={() => setVflag(1)}
                      ></div>
                      <div className="addbox2">
                        <div className="add2-box">+新的banner</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="select-bt-line">
                <div className="sbl-btn" onClick={() => setVflag(1)}>
                  create new one
                </div>
                <div className="sbl-btn btn2"
                  onClick={addToLis}
                >ok</div>
              </div>
            </div>
          )}
          {vfalg === 1 && (
            <div className="create-newone">
              <div className="sbb-top">
                <span>create</span>
                <span
                  className="iconfont"
                  onClick={() => {
                    setVflag(0);
                    backData();
                  }}
                >
                  &#xe66a;
                </span>
              </div>
              <div className="bannertitle">
                <input
                  type="text"
                  className="newtitle"
                  placeholder="title"
                  value={newtitle}
                  onChange={(e) => setNewtitle(e.target.value)}
                />
              </div>
              <div className="bannercover">
                <div className="addbtn" onClick={() => fileref.current.click()}>
                  <span>选择封面</span>
                </div>
                <input
                  type="file"
                  className="newcover"
                  ref={fileref}
                  accept="image/*"
                  onChange={inputfile}
                />
                {coverUrl != null && (
                  <div className="onebanner-berbox">
                    <img
                      src={coverUrl != "" ? coverUrl : ""}
                      alt=""
                      className="urlimg1"
                    />
                    <div
                      className="translate-box"
                      style={{ background: `${newcolor}` }}
                    >
                      <div className="bn-bottom">
                        <div className="title-box">
                          <div className="bn-title-line">{newtitle}</div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="hover-tochange"
                      onClick={() => fileref.current.click()}
                    >
                      change
                    </div>
                  </div>
                )}
              </div>
              <div className="select-line">
                <ColorPicker
                  defaultValue={DEFAULT_COLOR}
                  allowClear
                  showText
                  mode={["single", "gradient"]}
                  onChangeComplete={(color) => {
                    let c = color.toCssString().replace("90deg", "to bottom");
                    setNewcolor(c);
                  }}
                />
              </div>
              <div className="select-line" onClick={() => setVflag(2)}>
                <div className="sl-innerborder">
                  <span>targetId:</span>
                  {select?.id !== -1 && (
                    <span className="sp2">
                      {select.id} - {select.typeName}
                    </span>
                  )}
                </div>
              </div>
              <div className="okline">
                <div
                  className="cancelbtn"
                  onClick={() => {
                    setVflag(0);
                    backData();
                  }}
                >
                  返回
                </div>
                <div className="cancelbtn btnok" onClick={okbtntosend}>
                  确定
                </div>
              </div>
            </div>
          )}
          {vfalg === 2 && (
            <div className="seelctidbox">
              <div className="sbb-top">
                <span>create</span>
                <span
                  className="iconfont"
                  onClick={() => {
                    setVflag(0);
                    backData();
                  }}
                >
                  &#xe66a;
                </span>
              </div>
              <div className="selectbox-content">
                <div className="topselectline">
                  <div className="tl-box" onClick={() => selecttopindex(0)}>
                    <span>视频</span>
                    <div
                      className={idindex === 0 ? "activebox tlb" : "tlb"}
                    ></div>
                  </div>
                  <div className="tl-box" onClick={() => selecttopindex(1)}>
                    <span>番剧</span>
                    <div
                      className={idindex === 1 ? "activebox tlb" : "tlb"}
                    ></div>
                  </div>
                  <div className="tl-box" onClick={() => selecttopindex(2)}>
                    <span>活动</span>
                    <div
                      className={idindex === 2 ? "activebox tlb" : "tlb"}
                    ></div>
                  </div>
                  <div className="tl-box" onClick={() => selecttopindex(3)}>
                    <span>漫画</span>
                    <div
                      className={idindex === 3 ? "activebox tlb" : "tlb"}
                    ></div>
                  </div>
                </div>
                <div className="idcontent">
                  {idlist.map((item, index) => (
                    <div
                      className={
                        selecedindex === index
                          ? "oneitem oneitem-active"
                          : "oneitem"
                      }
                    >
                      {idindex === 0 && (
                        <div
                          className="videoitem"
                          key={item.vid}
                          onClick={() => clickthis(item.vid, 0, "视频", index)}
                        >
                          <div className="vd-leftcover">
                            <img src={item.cover} alt="" className="lc" />
                            <div className="timediv">{item.vidlong}</div>
                          </div>
                          <div className="vd-rightinfo">
                            <div className="vd-titleline">{item.title}</div>
                            <div className="vd-infos">
                              <div className="oneinfo">
                                <span className="iconfont">&#xe6b8;</span>
                                <span>{item.plays}</span>
                              </div>
                              <div className="oneinfo">
                                <span className="iconfont">&#xe666;</span>
                                <span>{item.danmus}</span>
                              </div>
                              <div className="oneinfo">
                                <span className="iconfont">&#xe61c;</span>
                                <span>{item.likes}</span>
                              </div>
                              <div className="oneinfo">
                                <span className="iconfont">&#xe613;</span>
                                <span>{item.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {idindex === 1 && (
                        <div
                          className="videoitem"
                          key={item.lid}
                          onClick={() => clickthis(item.aid, 1, "番剧", index)}
                        >
                          <div className="vd-leftcover">
                            <img src={item.cover} alt="" className="lc" />
                          </div>
                          <div className="vd-rightinfo">
                            <div className="vd-titleline">{item.title}</div>
                            <div className="vd-infos">
                              <div className="oneinfo">
                                <span className="iconfont">&#xe6b8;</span>
                                <span>{item.plays}</span>
                              </div>
                              <div className="oneinfo">
                                <span className="iconfont">&#xe666;</span>
                                <span>{item.dms}</span>
                              </div>
                              <div className="oneinfo">
                                <span
                                  className="iconfont"
                                  style={{ fontSize: "12px" }}
                                >
                                  &#xe630;
                                </span>
                                <span>{item.subs}</span>
                              </div>
                              <div className="oneinfo">
                                <span>共{item.chapters}集</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {idindex === 2 && (
                        <div
                          className="videoitem"
                          onClick={() => clickthis(item.vid, 2, "活动", index)}
                        >
                          <div className="vd-leftcover">
                            <img src={item.cover} alt="" className="lc" />
                            <div className="timediv">{item.vidlong}</div>
                          </div>
                          <div className="vd-rightinfo">
                            <div className="vd-titleline">{item.title}</div>
                            <div className="vd-infos">
                              <div className="oneinfo">
                                <span className="iconfont">&#xe6b8;</span>
                                <span>{item.plays}</span>
                              </div>
                              <div className="oneinfo">
                                <span className="iconfont">&#xe6b8;</span>
                                <span>{item.danmus}</span>
                              </div>
                              <div className="oneinfo">
                                <span className="iconfont">&#xe61c;</span>
                                <span>{item.likes}</span>
                              </div>
                              <div className="oneinfo">
                                <span className="iconfont">&#xe6b8;</span>
                                <span>{item.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {idindex === 3 && (
                        <div
                          className="videoitem"
                          style={{ height: "140px" }}
                          onClick={() => clickthis(item.mid, 3, "漫画", index)}
                        >
                          <div className="vd-leftcover">
                            <img src={item.cover} alt="" className="lc" />
                            <div className="timediv">{item.vidlong}</div>
                          </div>
                          <div className="vd-rightinfo">
                            <div className="vd-titleline">{item.title}</div>
                            <div className="vd-infos2">
                              <div className="onemg-line">{item.author}</div>
                              <div className="onemg-line">
                                <span>{item.mtag}</span>
                                {item.taglist != null &&
                                  item.taglist.map((tag) => <span>{tag}</span>)}
                              </div>
                              <div className="onemg-line">
                                共{item.chapters}话
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="okline">
                <div className="cancelbtn" onClick={() => setVflag(1)}>
                  返回
                </div>
                <div className="cancelbtn btnok" onClick={() => setVflag(1)}>
                  确定
                </div>
              </div>
            </div>
          )}
          {
          vfalg === 3 && (
            <div className="editorbox-banner">
              <div className="sbb-top">
                <span>editor</span>
                <span
                  className="iconfont"
                  onClick={() => {
                    setVflag(-1);
                    setNewcolor("linear-gradient(to bottom, rgb(0,0,0) 0%, rgb(0,0,0) 35%, rgb(0,0,0) 100%)")
                    setNewtitle("")
                  }}
                >
                  &#xe66a;
                </span>
              </div>
              <div className="editor-box">
                <div className="bannertitle">
                  <input
                    type="text"
                    className="newtitle"
                    placeholder="title"
                    value={newtitle}
                    onChange={(e) => setNewtitle(e.target.value)}
                  />
                </div>
                <div className="onebanner-berbox">
                  <img
                    src={bannerlist[nowinfo.ind].cover}
                    alt=""
                    className="urlimg1"
                  />
                  <div
                    className="translate-box"
                    style={{ background: `${newcolor}` }}
                  >
                    <div className="bn-bottom">
                      <div className="title-box">
                        <div className="bn-title-line">{newtitle}</div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="hover-tochange"
                    onClick={() => fileref.current.click()}
                  >
                    change
                  </div>
                </div>
                <div className="select-line">
                  <ColorPicker
                    defaultValue={DEFAULT_COLOR}
                    allowClear
                    showText
                    mode={["single", "gradient"]}
                    onChangeComplete={(color) => {
                      let c = color.toCssString().replace("90deg", "to bottom");
                      setNewcolor(c);
                    }}
                  />
                </div>
              </div>
              <div className="okline">
                <div className="cancelbtn"
                  onClick={() => {
                    setVflag(-1)
                    setNewcolor("linear-gradient(to bottom, rgb(0,0,0) 0%, rgb(0,0,0) 35%, rgb(0,0,0) 100%)")
                    setNewtitle("")
                  }}
                >
                  返回
                </div>
                <div className="cancelbtn btnok"
                  onClick={updateBannerinfo}
                >
                  确定
                </div>
              </div>
            </div>
          )}
          {vfalg === 4 && (
            <div className="deletebox-banner">
              <div className="sbb-top">
                <span>create</span>
                <span
                  className="iconfont"
                  onClick={() => {
                    setVflag(-1);
                    backData();
                  }}
                >
                  &#xe66a;
                </span>
              </div>
              <div className="dcontd">确定要删除这条？</div>
              <div className="okline">
                <div className="cancelbtn" onClick={() => setVflag(-1)}>
                  返回
                </div>
                <div className="cancelbtn btnok" onClick={cancelthisbanner}>
                  确定
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bannercon;

// 右侧一个banner
const OneBanner = memo((props) => {
  const {item, index, onMove, listLength, setVflag, setNewcolor, setNewtitle, setNowinfo} = props
  const [top, setTop] = useState(0),
        [isDragging, setIsDragging] = useState(false),
        [zIndex, setZIndex] = useState(0);

  const ref = useRef()
  useEffect(() => {
    const el = ref.current
    
    // 存储起始鼠标位置
    let startY = 0

    const mouseMove = (ev) => {
      console.log('moveing');
      
      ev.preventDefault()
      // 计算最新的top
      let lastTop = ev.clientY - startY
      setTop(lastTop)
    }

    const mouseUp = (ev) => {
      console.log('up');
      ev.preventDefault();
      document.removeEventListener("mousemove", mouseMove);
      // 重置 Top
      setTop(0);
      // 结束拖拽
      setIsDragging(false);
      setZIndex(0);
    };

    const mouseDown = (ev) => {
      console.log('down');
      ev.preventDefault();
      // 注册事件
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp, { once: true });
      // 开始拖拽
      setIsDragging(true);
      setZIndex(999);
      // 记录开始位置
      startY = ev.clientY;
    };
    el.addEventListener("mousedown", mouseDown);
  }, [])
  return (
    <div className="one-banner"
      ref={ref}
      style={{
        transform: isDragging ? `scale(1.01)` : `scale(1)`,
        top: `${top}px`,
        zIndex: zIndex.toString()
      }}
    >
      <div className="banner-coverbox">
        <img src={item.cover} alt="" />
      </div>
      <div className="banner-infos">
        <div className="banner-title">{item.title}</div>
        <div className="banner-type">
          类型:
          {item.type === 0 && (
            <span style={{ marginLeft: "5px" }}>视频</span>
          )}
          {item.type === 1 && (
            <span style={{ marginLeft: "5px" }}>番剧</span>
          )}
          {item.type === 2 && (
            <span style={{ marginLeft: "5px" }}>活动</span>
          )}
          {item.type === 3 && (
            <span style={{ marginLeft: "5px" }}>漫画</span>
          )}
        </div>
      </div>
      <div className="deletebox">
        <span
          className="iconfont ic1"
          style={{ marginBottom: "10px" }}
          onClick={() => {
            setVflag(3);
            setNewcolor(item.bgc)
            setNewtitle(item.title)
            setNowinfo({
              id: item.id,
              ind: index,
            });
          }}
        >
          &#xe631;
        </span>
        <span
          className="iconfont"
          onClick={() => {
            setVflag(4);
            setNowinfo({
              id: item.id,
              ind: index,
            });
          }}
        >
          &#xe640;
        </span>
      </div>
    </div>
  )
})
