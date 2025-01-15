import { useState, useEffect } from "react";
import { Menu, Space, Table, Input, Switch, Flex, Radio,
         Cascader, Form, Select, Button } from "antd";
import { getAllUser } from "../../../api/user";
import '../scss/index.scss'
import '../scss/AllUser.scss'
const { Search } = Input
const { TextArea } = Input

document.title = '用户管理'

const AllUser = () => {
  const columns = [
    {
      title: 'UserInfo',
      render: (item) => 
      <div className="user-box">
        <div className='tb-viewbox'>
          <img
            src={item.avatar}
            alt=""
            className='tb-video-cover'
          />
        </div>
        <div className="ot-infos">
          <div className="name-line">
            <span className="name">{item.name}</span>
            <span className="lv">LV:{item.lv}</span>
          </div>
          <div className="uidline">UID: {item.uid}</div>
          <div className="ff">
            <div className="onein">
              <span className="txt">粉丝</span>
              <span className="num">{item.fans}</span>
            </div>
            <div className="onein">
              <span className="txt">关注</span>
              <span className="num">{item.follows}</span>
            </div>
          </div>
        </div>
      </div>
    },
    {
      title: 'WorkInfos',
      render: (item) =>
        <div className="tb-video-rightinfo">
          <div className="tb-v-inf">
            <div className="tb-v-user-line0">投稿: {item.vids}</div>
            <div className="tb-v-user-line1">
              <div>
                <span className="iconfont">&#xe61c;</span>
                <span>{item.likes}</span>
              </div>
              <div>
                <span className="iconfont">&#xe617;</span>
                <span>{item.icons}</span>
              </div>
              <div>
                <span className="iconfont">&#xe630;</span>
                <span>{item.favorites}</span>
              </div>
              <div>
                <span className="iconfont">&#xe633;</span>
                <span>{item.shares}</span>
              </div>
              <div>
                <span className="iconfont" style={{fontSize: '17px'}}>&#xe6ba;</span>
                <span>{item.comments}</span>
              </div>
            </div>
          </div>
        </div>
    },
    {
      title: 'Opation',
      key: 'action',
      render: (item) => (
        <div className='tb-opbox'>
          <div className='tb-edi'
            onClick={() => {
              setViewflag(1)
              editorthis(item.vid)
              setNowdata(item)
            }}
          >设置</div>
          <div className='tb-del'
            onClick={() => {
              setViewflag(2)
              opationthis(item.vid)
            }}
          >留言</div>
        </div>
      ),
    },
  ];
  // 排序
  const opations1 = [
    {
      label: '创建时间',
      value: '创建时间',
    },
    {
      label: '粉丝',
      value: '粉丝',
    },
    {
      label: '播放数',
      value: '播放数',
    },
    {
      label: '视频数',
      value: '视频数',
    },
    {
      label: '硬币数',
      value: '硬币数',
    }
  ]
  const options3 = [
    {
      label: '全部',
      value: '全部',
    },
    {
      label: '管理员',
      value: '管理员',
    },
    {
      label: '用户',
      value: '用户',
    },
    {
      label: '封禁',
      value: '封禁',
    }
  ];
  const [selectionType, setSelectionType] = useState('checkbox');
  const [data, setData] = useState([])
  const [keyword, setKeyword] = useState(""),
        [filterflag, setFilterflag] = useState(false),
        [sortflag, setSortflag] = useState(true),
        [filter1, setFilter1] = useState("创建时间"),
        [filter3, setFilter3] = useState("全部")

  const [viewflag ,setViewflag] = useState(0),
        [nowdata, setNowdata] = useState()
  const [messagetext, setMessagetext] = useState("")

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getAllUser()])
      // console.log(res[1]);
      setData(res[0]) 
    }
    getData()
  }, [])

  const editorthis = (vid) => {
    console.log(vid);
    
  }

  const opationthis = (vid) => {

  }

  // onsearch 事件在用户按下"ENTER（回车）"
  // 按键或点击 type="search" 的 <input> 元素的 "x(搜索)" 按钮时触发。
  const searchFnc = async () => {
    console.log(filter1, filter3);
    
    //const res = await searchVideoByMany(filter1, filter3)
    //console.log(res);
    
  }

  const filter = (inputValue, path) =>
    path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

  return (
    <>
      <div className="filter-box">
        <div className="searchline">
          <div className="search-box-o">
            <Search
              placeholder="搜索uid或者名称"
              allowClear
              enterButton="Search"
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
              size="large"
              onSearch={searchFnc}
            />
          </div>
          <div className="filter-btn">
            <Switch 
              checkedChildren="过滤"
              checked={filterflag}
              onChange={() => setFilterflag(!filterflag)}
            />
          </div>
        </div>
        <div className="filter-line">
          <div className="one-filter-line">
            <div className="ofl-text">排序</div>
            <div className="ofl-con">
              <div className="ofl-sortbox">
                <Radio.Group
                  block
                  options={opations1}
                  defaultValue="投稿时间"
                  optionType="button"
                  buttonStyle="solid"
                  onChange={(e) => setFilter1(e.target.value)}
                />
              </div>
              <div className="sorf-flag">
                <Switch
                  checkedChildren="高"
                  unCheckedChildren="低"
                  checked={sortflag}
                  onChange={() => setSortflag(!sortflag)}
                />
              </div>
            </div>
          </div>
          <div
            className="ckbox-l"
            style={{overflow: 'hidden', height: filterflag ? '45px' : '0px'}}
          >
            <div className="one-filter-line">
              <div className="ofl-text">状态</div>
              <div className="ofl-con">
                <div className="ofl-status-box">
                  <Radio.Group
                    block
                    options={options3}
                    defaultValue="审核通过"
                    optionType="button"
                    buttonStyle="solid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="con-box">
        <div className="table-box">
          <Table
            style={{width: '100%', height: '100%'}}
            // rowSelection={{
            //   type: selectionType,
            //   ...rowSelection,
            // }}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>
      {/* opation view */}
      {
        viewflag > 0 &&
        <div className="opation-view">
        <div className="ov-bg"
          onClick={() => setViewflag(0)}
        ></div>
        {
          viewflag === 1 &&
          <div className="ov-deitor">
            <div className="ov-editor-topline">
              <span>设置用户账号</span>
              <span className="iconfont"
                onClick={() => setViewflag(0)}
              >&#xe6bf;</span>
            </div>
            <FormBox
              userinfo={nowdata}
              setViewflag={setViewflag}
            />
          </div>
        }
        {
          viewflag === 2 &&
          <div className="ov-opation">
            <div className="ov-editor-topline">
              <span>发送留言</span>
              <span className="iconfont"
                onClick={() => {
                  setViewflag(0)
                  setMessagetext("")
                }}
              >&#xe6bf;</span>
            </div>
            <div className="message-line">
              <div className="mb">
                <textarea name="" id="" className="messagebox"
                  value={messagetext}
                  onChange={(e) => setMessagetext(e.target.value)}
                  maxLength={300}
                ></textarea>
                <div className="mb-bt-line">
                  <span className="num">{messagetext.length}/300</span>
                </div>
              </div>
            </div>
            <div className="message-okline">
              <div className="okbtn">发送</div>
            </div>
          </div>
        }
      </div>
      }
    </>
  )
}

// rowSelection object indicates the need for row selection
// const rowSelection = {
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   getCheckboxProps: (record) => ({
//     disabled: record.name === 'Disabled User',
//     // Column configuration not to be checked
//     name: record.name,
//   }),
// };

export default AllUser


const FormBox = (props) => {
  const [newtitle, setNewtitle] = useState(''),
        [newIntro, setNewintro] = useState(''),
        [newClassify, setNewclassify] = useState(''),
        [newTgas, setNewtags] = useState(''),
        [newflag1, setNewflag1] = useState(false),
        [newflag2, setNewflag2] = useState(false)

  const { userinfo, setViewflag } = props

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 14,
      },
    },
  };
  const opations4 = [
    {
      label: '用户',
      value: '用户',
    },
    {
      label: '审核',
      value: '审核',
    },
    {
      label: '上传',
      value: '上传',
    },
    {
      label: '管理',
      value: '管理',
    },
  ]

  const [componentVariant, setComponentVariant] = useState('filled');
  const onFormVariantChange = ({ variant }) => {
    setComponentVariant(variant);
  };

  const handSubmit = () => {
    console.log('23333');
    const data = {
      uid: userinfo.uid,

    }
    
  }
  return (
    <div className="editopcontent">
    <Form
     layout="horizontal"
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 20,
      }}
    >
      <div className="infoline">
        <div className="avatar-box">
          <img src={userinfo.avatar} alt="" className="avatar" />
        </div>
        <div className="user-name">
          <div className="namel">{userinfo.name}</div>
          <div className="infol">
            {
              userinfo.permissions === 0 &&
              <span>用户</span>
            }
            {
              userinfo.permissions === 1 &&
              <span>审核</span>
            }
            {
              userinfo.permissions === 2 &&
              <span>上传</span>
            }
            {
              userinfo.permissions === 3 &&
              <span>管理</span>
            }
          </div>
        </div>
      </div>
      <Form.Item
        label="权限"
        name="权限"
      >
        <div className="ofl-sortbox">
          <Radio.Group
            block
            options={opations4}
            defaultValue="投稿时间"
            optionType="button"
            buttonStyle="solid"
            // onChange={(e) => setFilter1(e.target.value)}
          />
        </div>
      </Form.Item>
      <Form.Item
        label="会员"
        valuePropName="checked"
      >
        <Switch
          value={newflag1}
          onChange={() => setNewflag1(!newflag1)}
          checkedChildren="是"
          unCheckedChildren="否"
        />
      </Form.Item>
      <Form.Item
        label="封禁"
        valuePropName="checked"
      >
        <Switch
          value={newflag2}
          onChange={() => setNewflag2(!newflag2)}
          checkedChildren="开"
          unCheckedChildren="关"
        />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 11,
          span: 10,
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          style={{backgroundColor: '#32aeec'}}
          onClick={handSubmit}
        >
          确定
        </Button>
      </Form.Item>
    </Form>
    </div>
  )
}