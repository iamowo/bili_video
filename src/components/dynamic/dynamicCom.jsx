import "./dynamic.scss";
import { useState, useEffect, memo } from "react";
import { todynamic, touserspace, tovideo } from "../../util/fnc";
import {
  addDynamicLike,
  addTopicalWatchs,
  sendDynamic,
  getDyanmciList,
} from "../../api/dynamic";
import Comments from "../comments/comments";
import At from "../At/at";
import Emoji from "../emoji/emoji";
import message from "../notice/notice";
import { HeightLightKw } from "../../util/fnc";

// 动态组件
const DynamicCom = memo((props) => {
  const { item, index, userinfo, keyword } = props;
  const did = item.id;
  const uid = userinfo.uid; // 搜索关键字
  const [opationfalg, setOPationfalg] = useState(0); // 1 转发   2 评论
  const [nowdyindex, setNowdyindex] = useState(-1); // 当前所点击的，一次之打开一个
  const [controlflag, setControlflag] = useState(false);
  const [ourcomments, OutComments] = useState(0); // 评论数量

  const [inpshare, setInpshare] = useState("");

  const [oneemoji, setOneemoji] = useState(""),
    [emojiflag, setEmojiflag] = useState(false);

  // 转发
  const handleShare = (e) => {
    const index = parseInt(
      e.target.dataset.index || e.target.parentNode.dataset.index
    );
    if (opationfalg === 1) {
      setNowdyindex(-1);
      setOPationfalg(0);
      setInpshare("");
      return;
    }
    setNowdyindex(index);
    setOPationfalg(1);
  };

  // 评论
  const handleComment = (e) => {
    const index = parseInt(
      e.target.dataset.index || e.target.parentNode.dataset.index
    );
    if (opationfalg === 2) {
      setNowdyindex(-1);
      setOPationfalg(0);
      setInpshare("");
      return;
    }
    setNowdyindex(index);
    setOPationfalg(2);
  };

  // 放大一张图片
  const openimg = (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    e.preventDefault();
  };

  // 点赞
  const likethisdynamic = async (did) => {
    console.log(item.uid);
    const data = {
      did: did,
      uid: uid,
      hisuid: item.uid,
      type: 1,
    };
    const res = await addDynamicLike(data);
    // 更新列表
    if (item.liked) {
      // 取消收藏
      if (res && props.setDylist !== undefined && props.setDylist !== null) {
        props.setDylist(
          props.dylist.map((dy) => {
            if (dy.id === did) {
              dy.liked = false;
              dy.likes -= 1;
            }
            return dy;
          })
        );
      }
    } else {
      if (res && props.setDylist !== undefined && props.setDylist !== null) {
        props.setDylist(
          props.dylist.map((dy) => {
            if (dy.id === did) {
              dy.liked = true;
              dy.likes += 1;
            }
            return dy;
          })
        );
      }
    }
  };

  // 发送emoji
  useEffect(() => {
    if (oneemoji !== "") {
      setInpshare(inpshare + oneemoji);
      setOneemoji("");
    }
  }, [oneemoji]);

  // 发送动态
  const senddynamic = async (dytype) => {
    if (inpshare.length === 0) {
      message.open({ type: "error", content: "内容不能为空" });
      return;
    }
    // dytype === 0 动态（图文类型的）
    // dytype === 1 是转发的视频
    // dytype === 2 是转发的动态
    // dytype === 3 是发视频是后自动发送的动态
    const data = {
      uid: uid,
      type: dytype === 0 || dytype === 2 ? 2 : 1,
      content: inpshare,
      vordid: did,
    };
    const thisdid = await sendDynamic(data);
    if (thisdid) {
      message.open({ type: "info", content: "转发动态成功", flag: true });
    }
    const newlist = await getDyanmciList(uid, 1);
    props.setDylist(newlist);

    setNowdyindex(-1);
    setOPationfalg(0);
  };

  return (
    <div key={item.id} className="one-dynamic-box">
      <div className="TTP">
        <img src={item.avatar} alt="" className="left-user-avatar"
          data-uid={item.uid}
          onClick={touserspace}
        />
        <div className="right-user-conetnt">
          <div className="right-infod1">
            <div className="boxinfo1">
              <div className="dy-ibe-name-line">
                <span
                  data-uid={item.uid}
                  onClick={touserspace}
                >{item.name}</span>
              </div>
              <div className="data-infos">
                <span className="time-span">{item.time.slice(0, 10)}</span>
                {item.type === 3 && (
                  <span className="ts-right-sp">投稿了视频</span>
                )}
              </div>
              {item.topical !== null && (
                <div className="topical-line">
                  <div
                    className="this-topical-box"
                    onClick={async () => {
                      await addTopicalWatchs(-1, item.topical);
                      window.open(`/topical/${item.topical}`, "blank");
                    }}
                  >
                    <div className="icon iconfont">
                      &#xe63d;
                      <span>#</span>
                    </div>{" "}
                    {item.topical}
                  </div>
                </div>
              )}
            </div>
            <div className="boxinfo2">
              <span
                className="icon iconfont"
                onClick={() => setControlflag(true)}
              >
                &#xe653;
              </span>
              {controlflag && (
                <div className="controlbox">
                  {uid === item.uid ? (
                    <span
                      className="consp1"
                      onClick={() => {
                        setControlflag(false);
                        props.setDeletaflag(true);
                        props.setDeletedid(item.id);
                      }}
                    >
                      删除动态
                    </span>
                  ) : (
                    <span className="consp1">举报</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="content-out-box">
            <div
              className="user-dy-contnet"
              data-did={item.id}
              onClick={todynamic}
            >
              {keyword !== undefined &&
              keyword !== null &&
              keyword?.length > 0 ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: HeightLightKw(item.content, keyword, "span", 0),
                  }}
                ></span>
              ) : (
                <span>{item.content}</span>
              )}
            </div>
            {item.type === 0 && item.imgs[0] != null && (
              <div
                className="user-send-img-box"
                data-did={item.id}
                onClick={todynamic}
              >
                {
                item.imgs.map((item2) => (
                  <img
                    key={item2}
                    src={item2}
                    alt=""
                    className="one-sss-img"
                    data-did={item.id}
                    onClick={todynamic}
                  />
                ))}
              </div>
            )}
          </div>
          {item.type === 1 && (
            <div className="video-type-box">
              <div className="vtb-inner-video-box">
                <div className="vtb-title-line">
                  <div className="left-userinfo">
                    <img
                      src={item.video.avatar}
                      alt=""
                      className="vtb-lu-cover"
                      data-uid={item.video.uid}
                      onClick={touserspace}
                    />
                    <span
                      className="vtb-lu-name"
                      data-uid={item.video.uid}
                      onClick={touserspace}
                    >
                      {item.video.name}
                    </span>
                    <span className="vtb-lu-text">投稿的视频</span>
                  </div>
                  <div className="right-sub-info">
                    <span className="icon iconfont">&#xe643;</span>
                    <span className="rbi-addsub">关注</span>
                  </div>
                </div>
                <div
                  className="vtb-video-box1"
                  onClick={() => {
                    window.open(`/video/${item.vid}`, "_blank");
                  }}
                >
                  <div className="left-img-vtb-img">
                    <img
                      src={item.video.cover}
                      alt=""
                      className="livu-img"
                      data-vid={item.video.vid}
                      onClick={tovideo}
                    />
                  </div>
                  <div className="left-info-vtb">
                    <div
                      className="liv-title"
                      data-vid={item.video.vid}
                      onClick={tovideo}
                    >
                      {item.video.vid}
                    </div>
                    <div className="liv-intro">{item.video.intro}</div>
                    <div className="liv-infos-d">
                      <div className="one-info-livbox">
                        <span className="icon iconfont">&#xe6b8;</span>
                        <span className="oio-nums">{item.video.plays}</span>
                      </div>
                      <div className="one-info-livbox">
                        <span className="icon iconfont">&#xe666;</span>
                        <span className="oio-nums">{item.video.danmus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {item.type === 2 && (
            <div
              className="dynamic-type-box"
              onClick={() => window.open(`/dydetail/${item.dy2.id}`, "_blank")}
            >
              <div className="dtb-inner-box">
                <div className="vtb-title-line">
                  <div className="left-userinfo">
                    <img
                      src={item.dy2.avatar}
                      alt=""
                      className="vtb-lu-cover"
                      data-uid={item.dy2.uid}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/${item.dy2.uid}`, "_blank");
                      }}
                    />
                    <span
                      className="vtb-lu-name"
                      data-uid={item.dy2.uid}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/${item.dy2.uid}`, "_blank");
                      }}
                    >
                      {item.dy2.name}
                    </span>
                    <span className="vtb-lu-text">的动态</span>
                  </div>
                  <div className="right-sub-info">
                    <span className="icon iconfont">&#xe643;</span>
                    <span className="rbi-addsub">关注</span>
                  </div>
                </div>
                <div className="dtb-content-box">{item.dy2.content}</div>
                <div className="dtb-imgs">
                  {item.dy2.imgs.map((oneimg) => (
                    <img 
                      key={oneimg}
                      src={oneimg}
                      alt="" className="oneimg-dy2" />
                  ))}
                </div>
              </div>
            </div>
          )}
          {item.type === 3 && (
            <div
              className="my-send-video"
              onClick={() => {
                window.open(`/video/${item.vid}`, "_blank");
              }}
            >
              <div className="left-send-my-avatr">
                <img src={item.video.cover} alt="" className="lsma-avatar" />
              </div>
              <div className="right-send-my-info">
                <div className="rsyi-title">{item.video.title}</div>
                <div className="rsyi-intro">{item.video.intro}</div>
                <div className="rsyi-infos">
                  <div className="rsyi-div">
                    <span
                      className="icon iconfont"
                      style={{ fontSize: "13px" }}
                    >
                      &#xe6b8;
                    </span>
                    <span className="rsyi-text">{item.video.plays}</span>
                  </div>
                  <div className="rsyi-div">
                    <span className="icon iconfont">&#xe666;</span>
                    <span className="rsyi-text">{item.video.danmus}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="dy-opation-b">
            <div
              className="one-opation-a"
              data-index={index}
              onClick={handleShare}
              style={{
                color:
                  opationfalg === 1 && nowdyindex === index
                    ? "#32AEEC"
                    : "#9499A0",
              }}
            >
              <span className="icon iconfont">&#xe633;</span>
              {item.shares > 0 ? (
                <span className="iconnum">{item.shares}</span>
              ) : (
                <span className="iconnum">转发</span>
              )}
            </div>
            <div
              className="one-opation-a"
              data-index={index}
              onClick={handleComment}
              style={{
                color:
                  opationfalg === 2 && nowdyindex === index
                    ? "#32AEEC"
                    : "#9499A0",
              }}
            >
              <span className="icon iconfont">&#xe648;</span>
              {item.comments > 0 ? (
                <span className="iconnum">{item.comments}</span>
              ) : (
                <span className="iconnum" data-index={index}>
                  {item.comments > 0 ? (
                    <span>{item.comments}</span>
                  ) : (
                    <span>评论</span>
                  )}
                </span>
              )}
            </div>
            <div
              className={
                item.liked ? "one-opation-a one-active" : "one-opation-a"
              }
              onClick={() => likethisdynamic(item.id)}
            >
              <span className="icon iconfont">&#xe61c;</span>
              {item.likes > 0 ? (
                <span className="iconnum">{item.likes}</span>
              ) : (
                <span className="iconnum">
                  {item.likes > 0 ? (
                    <span>{item.likes}</span>
                  ) : (
                    <span>点赞</span>
                  )}
                </span>
              )}
            </div>
          </div>
          {
            // 转发
            opationfalg === 1 && nowdyindex === index && (
              <div className="share-box">
                <img
                  src={userinfo.avatar}
                  alt=""
                  className="left-share-avatar"
                />
                <div className="right-share-box">
                  <div className="send-part">
                    <div className="titleline">转发{item.name}的动态~</div>
                    <textarea
                      className="texta2"
                      value={inpshare}
                      onChange={(e) => setInpshare(e.target.value)}
                      maxLength={400}
                    ></textarea>
                  </div>
                  <div
                    className="bottom-opation-part"
                    style={{
                      translate: inpshare.length > 0 ? "0 0" : "0 -50px",
                    }}
                  >
                    <div className="left-con-box">
                      <div className="at-box1">
                        <span
                          className="icon iconfont"
                          onClick={() => {
                            setEmojiflag(!emojiflag);
                            console.log("????");
                          }}
                        >
                          &#xe667;
                        </span>
                        {emojiflag && (
                          <div className="emojibox">
                            <Emoji
                              oneemoji={oneemoji}
                              setOneemoji={setOneemoji}
                              setEmojiflag={setEmojiflag}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="right-numandsend">
                      <div className="numspan">{inpshare.length}/400</div>
                      <div
                        className="snedspan"
                        onClick={() => senddynamic(item.type)}
                      >
                        发送
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
      {
        // 评论
        opationfalg === 2 && nowdyindex === index && (
          <div className="comment-box">
            <div className="commentbox-dy">
              <Comments
                did={item.id}
                uid={uid}
                hisuid={item.uid}
                userinfo={userinfo}
                commentType = {1}
                OutComments={OutComments}
              />
            </div>
            <div className="bottom-line">没有更多了~</div>
          </div>
        )
      }
    </div>
  );
});

export default DynamicCom;
