import {
  createBrowserRouter
} from "react-router-dom";

import Home from "../views/home/HomePage"
import Video from '../views/video/Video'

// userspace
import User from "../views/user/user";
import Dynamic from "../views/user/dynamic/dynamic";
import Videosandartical from "../views/user/video/vanda";
import Artical from "../views/user/video/article";
import Videos from "../views/user/video/videos";
import Mainhome from "../views/user/main/main";
import Search from "../views/user/search/search";
import Favlist from "../views/user/favlist/favlist"
import Anima from "../views/user/anima/anima"
import Setting from "../views/user/setting/setting"
import FollowAndFan from "../views/user/followandfan/followandfan";
import Follow from "../views/user/followandfan/follow";
import Fan from "../views/user/followandfan/fan";
import Sum from "../views/user/sum/sum";
import Allvideos from "../views/user/sum/allvide";

// rank
import Rank from "../views/rank/rank";

// dynamic
import DynamicM from "../views/dynamic/dynamic";
import Dydetail from "../views/dynamic/detail";

// history
import History from "../views/history/history";

// message
import Message from "../views/message/message";
import Whisper from "../views/message/default/whisper";
import Replay from "../views/message/replay/replay"
import At from "../views/message/at/at"
import Love from "../views/message/love/love"
import Config from "../views/message/config/config"
import System from "../views/message/system/system"

// 搜索
import All from "../views/search/all/all";
import SearchM from "../views/search/search";
import VideoSe from "../views/search/video/vidoe";
import AnimaS from "../views/search/anima/anima";
import LivingS from "../views/search/living/living";
import Liveall from "../views/search/living/liveAll";
import Liveroom from "../views/search/living/liveRoom";
import Liveuser from "../views/search/living/liveUser";
import UserS from "../views/search/user/user";

// 上传
import Upload from "../views/upload/upload";
import Uphome from "../views/upload/uphome/uphome";
import Upcenter from "../views/upload/upcenter/upcentr";
import Control from "../views/control/control";
import Vdieocontrol from "../views/upload/upcontroller/videocontrol";
import Upvideo2 from "../views/upload/upvideo2/upvideo2";

// live
import Livinghoom from "../views/living/livinghome/livinghoow";
import Livingroom from "../views/living/livingroom/livingroow";

// account
import Account from "../views/account/index"
import AccountHome from "../views/account/others/home";
import AccountAvatar from "../views/account/others/myavatar";
import AccountInfo from "../views/account/others/myinfo";
import Upavatar from "../views/account/others/upavatar"
import LiveRoom from "../views/search/living/liveRoom";

// adudit
import Audit from "../views/audit/audit";

// maintag
import Maintag from "../views/maintag/maintag";
import AllMaintag from "../views/maintag/moreview";

// error
import Error from "../views/404/error"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    // :uid?, 表示uid可选择 :vid必选
    path: '/video/:vid/:uid?',
    element: <Video />
  },
  {
    path: '/:uid/',
    element: <User />,
    children: [
      {
        // 默认二级路由
        index: true,
        element: <Mainhome />
      },
      {
        path: 'dynamic',
        element: <Dynamic />
      },
      {
        path: '',
        element: <Videosandartical />,
        children: [
          {
            // index: true,
            path: 'videos',
            element: <Videos />
          },
          {
            path: 'artical',
            element: <Artical />
          }
        ]
      },
      {
        path: 'search',
        element: <Search />
      },
      {
        // 不带fid时默认收藏夹
        path: 'favlist/:fid?',
        element: <Favlist />
      },
      {
        path: 'anima',
        element: <Anima />
      },
      {
        path: 'setting',
        element: <Setting />
      },
      {
        path: 'fans',
        element: <FollowAndFan />,
        children: [
          {
            path:'follow',
            element: <Follow />
          },
          {
            path:'fan',
            element: <Fan />
          }
        ]
      },
      {
        path: 'channel',
        element: <Sum />,
      },
      {
        path: 'channel/detail/:listid',
        element: <Allvideos />,
      }  
    ]
  },
  {
    path: '/channels/:maintag',
    element: <Maintag />
  },
  {
    path: '/alltag',
    element: <AllMaintag />
  },
  {
    path: '/rank/:type?',
    element: <Rank />
  },
  {
    path: '/dynamicM/:uid',
    element: <DynamicM />
  },
  {
    path: '/dydetail/:did/:uid?',
    element: <Dydetail />
  },
  {
    path: '/watched/:uid',
    element: <History />
  },
  {
    path: '/:uid',
    element: <Message />,
    children: [
      {
        path: 'whisper/:hisuid?',
        element: <Whisper />
      },
      {
        path: 'replay',
        element: <Replay />
      },
      {
        path: 'at',
        element: <At />
      },
      {
        path: 'love',
        element: <Love />
      },
      {
        path: 'config',
        element: <Config />
      },
      {
        path: 'system',
        element: <System />
      }
    ]
  },
  {
    // path: '/all/:keyword/:uid?',
    parh: '/',
    element: <SearchM />,
    children: [
      {
        path: 'all/:keyword/:uid?',
        index: true,
        element: <All />
      },
      {
        path: 'videose/:keyword/:uid?',
        element: <VideoSe />
      },
      {
        path: 'animas/:keyword/:uid?',
        element: <AnimaS />
      },
      {
        path: '',
        element: <LivingS />,
        children: [
          {
            index: true,
            path: "lives/:keyword/:uid?",
            element: <Liveall />
          },
          {
            path: "lives/liver/:keyword/:uid?",
            element: <Liveuser />
          },
          {
            path: "lives/liveroom/:keyword/:uid?",
            element: <Liveroom />
          }
        ]
      },
      {
        path: 'users/:keyword/:uid?',
        element: <UserS />
      }
    ]
  },
  {
    path: '/:uid/platform',
    element: <Upload />,
    children: [
      {
        // index: true,
        path: 'upload/:type',
        element: <Upcenter />
      },
      {
        path: 'home',
        element: <Uphome />
      },
      {
        path: "manager/video",
        element: <Vdieocontrol />
      },
      {
        path: "upvideo2",
        element: <Upvideo2 />
      }
    ]
  },
  {
    path: '/control',
    element: <Control />
  },
  // living
  {
    path: '/livehome',
    element: <Livinghoom />
  },
  {
    path: '/:lid/live',
    element: <Livingroom />
  },
  {
    path: '/:uid/account',
    element: <Account />,
    children: [
      {
        index: true,
        path: 'home',
        element: <AccountHome />
      },
      {
        path: 'info',
        element: <AccountInfo />
      },
      {
        path: 'avatar/set',
        element: <AccountAvatar />
      },
      {
        path: 'avatar/update',
        element: <Upavatar />
      }
    ]
  },
  {
    path: '/audit',
    element: <Audit />
  },
  {
    path: '*',
    element: <Error />
  }
])

export default router