import {
  createBrowserRouter
} from "react-router-dom";

import VideoHome from "../views/VideoViews/VideoHome";
import VideoPage from "../views/VideoViews/VideoPage";

// userspace
import UserMainVideo from "../views/VideoViews/UserSpace/UserMainVideo";
import Dynamic from "../views/VideoViews/UserSpace/dynamic";
import Videosandartical from "../views/VideoViews/UserSpace/video/vanda";
import Artical from "../views/VideoViews/UserSpace/video/article";
import Videos from "../views/VideoViews/UserSpace/video/videos";
import UserHome from "../views/VideoViews/UserSpace/UserHome"
import Search from "../views/VideoViews/UserSpace/search/search";
import SearchVideo from "../views/VideoViews/UserSpace/search/searchvideo";
import SearchDynamic from "../views/VideoViews/UserSpace/search/searchDynamic";
import Favlist from "../views/VideoViews/UserSpace/favlist"
import UserAnimation from "../views/VideoViews/UserSpace/UserAnimation"
import Setting from "../views/VideoViews/UserSpace/setting"
import FollowAndFan from "../views/VideoViews/UserSpace/followandfan/followandfan";
import Follow from "../views/VideoViews/UserSpace/followandfan/follow";
import Fan from "../views/VideoViews/UserSpace/followandfan/fan";
import Sum from "../views/VideoViews/UserSpace/sum/sum";
import Allvideos from "../views/VideoViews/UserSpace/sum/allvide";

// rank
import VideoRank from "../views/VideoViews/VideoRank";

// dynamic
import Blog from "../views/VideoViews/Blog";
import BlogDetail from "../views/VideoViews/BlogDetail";

// history
import VideoHistory from "../views/VideoViews/VideoHistory";

// message
import Message from "../views/MessageView/message";
import Whisper from "../views/MessageView/default/whisper";
import Replay from "../views/MessageView/replay/replay"
import At from "../views/MessageView/at/at"
import Love from "../views/MessageView/love/love"
import Config from "../views/MessageView/config/config"
import System from "../views/MessageView/system/system"

// 搜索
import All from "../views/search/all";
import SearchM from "../views/search/search";
import VideoSe from "../views/search/vidoe";
import AnimaS from "../views/search/anima";
import LivingS from "../views/search/living";
import Liveall from "../views/search/liveAll";
import Liveroom from "../views/search/liveRoom";
import Liveuser from "../views/search/liveUser";
import UserS from "../views/search/user";

// 上传
import Upload from "../views/upload/upload";
import Uphome from "../views/upload/uphome/uphome";
import Upcenter from "../views/upload/upcenter/upcentr";
import Vdieocontrol from "../views/upload/upcontroller/videocontrol";
import Upvideo2 from "../views/upload/upvideo2/upvideo2";
import Upmg from "../views/upload/upmg/Upmg";
import UpImgs from "../views/upload/upimgs/UpImgs";
import Mgcontrol from "../views/upload/upcontroller/mgcontrol";

// control
import Control from "../views/control/control";
import AllConVideos from "../views/control/allVideo";
import ControlHome from "../views/control/home";
import AllDynamic from "../views/control/AllDynamic";
import Bannercon from "../views/control/BannerCon";
import AllUser from "../views/control/AllUser";

// live
import Livinghoom from "../views/living/livinghome/livinghoow";
import Livingroom from "../views/living/livingroom/livingroow";

// account
import Account from "../views/Account/Account"
import AccountHome from "../views/Account/home";
import AccountAvatar from "../views/Account/myavatar";
import AccountInfo from "../views/Account/myinfo";
import Upavatar from "../views/Account/upavatar"
import LiveRoom from "../views/search/liveRoom";

// adudit
import Audit from "../views/Audit/audit";

// maintag
import Maintag from "../views/VideoViews/maintag";
import AllMaintag from "../views/VideoViews/moreview";

// topical
import Topical from "../views/VideoViews/topical";

// error
import Error from "../views/404/error"

// animation
import AnimationPage from "../views/VideoViews/animationPage";

// mg
import Mghome from "../views/mg/Home/Home"
import Chapter from "../views/mg/Chapter/Chapter";
import Detail from "../views/mg/Detail/Detai";
import Type from "../views/mg/Type/Type";
import Ranking from "../views/mg/Ranking/Rnaking";
import Searchmg from "../views/mg/Search/Search"
import Usermg from '../views/mg/User/User'
import UserMain from "../views/mg/User/main"
import UserHistory from "../views/mg/User/history"
import UserFavorite from "../views/mg/User/favorite"

// test
import Test from "../views/testV/test";

// imgsspace
import ImgHome from "../views/ImgSpace/ImgHome"
import ImgDetail from "../views/ImgSpace/ImgDetail";
import ImgUserSpace from "../views/ImgSpace/user/ImgUserSpace";
import BoradsComponents from "../views/ImgSpace/user/boards";
import CollectsComponents from "../views/ImgSpace/user/collects";

// 重定向组件(<AuthRoute> <XXXXX /> </AuthRoute>)
import AuthRoute from "../util/AuthRouter";
import ImgBorder from "../views/ImgSpace/ImgBorder";

const router = createBrowserRouter([
  {
    path: '/',
    element: <VideoHome />
  },
  {
    // :uid?, 表示uid可选择 :vid必选
    path: '/video/:vid/:uid?',
    element: <VideoPage />
  },
  {
    path: '/:uid/',
    element: <UserMainVideo />,
    children: [
      {
        // 默认二级路由
        index: true,
        element: <UserHome />
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
        element: <Search />,
        children: [
          {
            index: true,
            path: 'video/:keyword',
            element: <SearchVideo />
          },
          {
            path: 'dynamic/:keyword',
            element: <SearchDynamic />
          }
        ]
      },
      {
        // 不带fid时默认收藏夹
        path: 'favlist/:fid?',
        element: <Favlist />
      },
      {
        path: 'anima',
        element: <UserAnimation />
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
    path: '/img',
    element: <ImgHome />,
    children: [
      {
        path: 'img/:imgid',
        element: <ImgDetail />
      },
    ]
  },
  {
    path: '/board/:boardid',
    element: <ImgBorder />
  },
  {
    path: '/userimg/:uid?',
    element: <ImgUserSpace />,
    children: [
      {
        index: true,
        // path: 'boards/',
        element: <BoradsComponents />
      },
      {
        path: 'collects',
        element: <CollectsComponents />
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
    element: <VideoRank />
  },
  {
    path: '/dynamicM/:uid',
    element: <Blog />
  },
  {
    path: '/dydetail/:did/:uid?',
    element: <BlogDetail />
  },
  {
    path: '/watched/:uid',
    element: <VideoHistory />
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
        path: "manager/mg",
        element: <Mgcontrol />
      },
      {
        path: "upvideo2",
        element: <Upvideo2 />
      },
      {
        path: 'uploadmg',
        element: <Upmg />
      },
      {
        path: 'upimg',
        element: <UpImgs />
      }
    ]
  },
  // control
  {
    path: '/control',
    element: <Control />,
    children: [
      {
        index: true,
        element: <ControlHome />
      },
      {
        path: 'videos',
        element: <AllConVideos />
      },
      {
        path: 'dynamics',
        element: <AllDynamic />
      },
      {
        path: 'banners',
        element: <Bannercon />
      },
      {
        path: 'users',
        element: <AllUser />
      }
    ]
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
    path: '/manga',
    element: <Mghome />,
  },
  {
    path: 'userspace/:uid',
    element: <Usermg />,
    children: [
      {
        index: true,
        element: <UserMain />
      },
      {
        path: "history",
        element: <UserHistory />
      },
      {
        path: "favorite",
        element: <UserFavorite />
      }
    ]
  },
  {
    path: 'animationpage/:uid',
    element: <AnimationPage />
  },
  {
    path: 'searchmg/:keyword',
    element: <Searchmg />
  },
  {
    path: "classify",
    element: <Type />
  },
  {
    path: "chapter/:mid",
    element: <Chapter />
  },
  {
    path: "detail/:mid/:number",
    element: <Detail />
  },
  {
    path: 'mgranking',
    element: <Ranking />
  },
  {
    path: 'topical/:topical',
    element: <Topical />
  },
  {
    path: 'test',
    element: <Test />
  },
  {
    path: '*',
    element: <Error />
  }
])

export default router