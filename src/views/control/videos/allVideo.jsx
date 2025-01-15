import { useState, useEffect } from "react";
import { Menu, Space, Table, Input, Switch, Flex, Radio,
         Cascader, Form, Select, Button } from "antd";
import { getAllVideo, searchVideoByMany, getAllClassify } from "../../../api/video";
import { render } from '@testing-library/react';
import '../scss/index.scss'
import '../scss/allVideo.scss'
const { Search } = Input
const { TextArea } = Input


const AllConVideos = () => {
  const columns = [
    {
      title: 'Video',
      render: (item) => 
      <div className='tb-viewbox'>
        <img
          src={item.cover}
          alt=""
          className='tb-video-cover'
        />
        <div className="tb-video-infobox">
          <div className='tb-video-infos'>
            <div className='tb-d1'>
              <div className="td-d2">
                <span className="iconfont" style={{fontSize: '9px'}}>&#xe6b8;</span>
                <span>{item.plays}</span>
              </div>
              <div className="td-d2">
                <span className="iconfont" style={{translate: '0 1px'}}>&#xe666;</span>
                <span>{item.danmus}</span>
              </div>
            </div>
            <div className='tb-d1'>
              <span>{item.vidlong}</span>
            </div>
          </div>
        </div>
      </div>,
    },
    {
      title: 'Infos',
      render: (item) =>
        <div className="tb-video-rightinfo">
          <div className="tb-v-title">{item.title}</div>
          <div className="tb-v-inf">
            <div className="tb-v-user-line0">vid:{item.vid}</div>
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
      title: 'Userinfo',
      render: (item) => 
        <div className='tb-u-box'>
          <div className="yb-v-line1">
            <img src={item.avatar} alt="" />
            <span>uid:{item.uid}</span>
          </div>
          <div className="yb-v-line2">{item.name}</div>
        </div>
    },
    {
      title: 'classify',
      dataIndex: 'maintag',
      render: (maintag) => 
        <div className='tb-maintag'>{maintag}</div>
    },
    {
      title: 'Tgas',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) =>
        <div className='tagbox'>
          {
            tags.slice(0, 5).map(item =>
              <div className='tb-onetag'>{item}</div>
            )
          }
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
          >编辑</div>
          <div className='tb-del'
            onClick={() => {
              setViewflag(2)
              opationthis(item.vid)
            }}
          >管理</div>
        </div>
      ),
    },
  ];
  // 排序
  const opations1 = [
    {
      label: '投稿时间',
      value: '投稿时间',
    },
    {
      label: '播放',
      value: '播放',
    },
    {
      label: '弹幕',
      value: '弹幕',
    },
    {
      label: '点赞',
      value: '点赞',
    },
    {
      label: '投币',
      value: '投币',
    },
    {
      label: '收藏',
      value: '收藏',
    },
    {
      label: '转发',
      value: '转发',
    },
    {
      label: '评论',
      value: '评论',
    },
    {
      label: '时长',
      value: '时长',
    },
  ]
  // 分区
  const options2 = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
    },
  ];
  const options3 = [
    {
      label: '审核通过',
      value: '审核通过',
    },
    {
      label: '审核中',
      value: '审核中',
    },
    {
      label: '审核失败',
      value: '审核失败',
    },
    {
      label: '删除',
      value: '删除',
    }
  ];
  const [selectionType, setSelectionType] = useState('checkbox');
  const [data, setData] = useState([])
  const [keyword, setKeyword] = useState(""),
        [filterflag, setFilterflag] = useState(false),
        [sortflag, setSortflag] = useState(true),
        [filter1, setFilter1] = useState("投稿时间"),
        [filter2, setFilter2] = useState(""),
        [filter3, setFilter3] = useState("审核通过"),
        [classifys, setClassify] = useState([])

  const [viewflag ,setViewflag] = useState(0),
        [nowdata, setNowdata] = useState()

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getAllVideo(), getAllClassify()])
      // console.log(res[1]);
      setData(res[0]) 
      let tempNum = []     
      for (let i = 0; i < res[1].length; i++) {
        const temp = {
          value: res[1][i].value,
          label: res[1][i].value
        }
        tempNum.push(temp)
      }
      // console.log(tempNum);
      setClassify(tempNum)
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
    console.log(filter1, filter2, filter3);
    
    //const res = await searchVideoByMany(filter1, filter2, filter3)
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
              placeholder="搜索vid或者标题"
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
            style={{overflow: 'hidden', height: filterflag ? '85px' : '0px'}}
          >
            <div className="one-filter-line">
              <div className="ofl-text">分区</div>
              <div className="ofl-con">
              <Cascader
                options={classifys}
                placeholder="搜索分区"
                showSearch={{
                  filter,
                }}
                // onSearch={(e) => setFilter2(e.target.value)}
                onChange={(e) => {
                    if (e !== undefined) {
                      setFilter2(e[0])
                    } else {
                      setFilter2('')
                    }
                  }
                }
              />
              </div>
            </div>
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
              <span>编辑视频信息</span>
              <span className="iconfont"
                onClick={() => setViewflag(0)}
              >&#xe6bf;</span>
            </div>
            <FormBox
              videoinfo={nowdata}
              classifys={classifys}
              setViewflag={setViewflag}
            />
          </div>
        }
        {
          viewflag === 2 &&
          <div className="ov-opation">
            <div className="ov-editor-topline">
              <span>编辑视频状态</span>
              <span className="iconfont"
                onClick={() => setViewflag(0)}
              >&#xe6bf;</span>
            </div>
            <OpationBox
              setViewflag={setViewflag}
            />
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

export default AllConVideos


const FormBox = (props) => {
  const [newtitle, setNewtitle] = useState(''),
        [newIntro, setNewintro] = useState(''),
        [newClassify, setNewclassify] = useState(''),
        [newTgas, setNewtags] = useState(''),
        [newflag1, setNewflag1] = useState(false),
        [newflag2, setNewflag2] = useState(false)

  const { videoinfo, classifys, setViewflag } = props

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

  const [componentVariant, setComponentVariant] = useState('filled');
  const onFormVariantChange = ({ variant }) => {
    setComponentVariant(variant);
  };

  const handSubmit = () => {
    console.log('23333');
    const data = {
      vid: videoinfo.vid,

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
      <Form.Item
        label="标题"
        name="标题"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input
          placeholder={videoinfo.title}
        />
      </Form.Item>
      <Form.Item
        label="简介"
        name="简介"
      >
        <TextArea
          rows={4}
          resize='none'
          placeholder={videoinfo.intro}
        />
      </Form.Item>
      <Form.Item
        label="分类"
        name="分类"
      >
        <Select
          options={classifys}
          onChange={(e) => setNewclassify(e)}
        />
      </Form.Item>
      <Form.Item
        label="tags"
        name="tags"
      >
        <Input
          placeholder="标签之间请用空格分开"
        />
      </Form.Item>
      <Form.Item
        label="充电专属"
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
        label="关闭评论"
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
          onClick={handSubmit}
        >
          确定
        </Button>
      </Form.Item>
    </Form>
    </div>
  )
}

const OpationBox = (props) => {
  const [index, setIndex] = useState()
  const { setViewflag } = props
  const handleClick = () => {
    setViewflag(0)
  }
  return (
    <div className="opation-content">
      <Flex vertical gap="middle">
        <Radio.Group defaultValue="a" size="large">
          <Radio.Button value="a">审核通过</Radio.Button>
          <Radio.Button value="b">审核中</Radio.Button>
          <Radio.Button value="c">审核失败</Radio.Button>
          <Radio.Button value="d">删除</Radio.Button>
        </Radio.Group>
      </Flex>
      <div className="btn-line">
        <div className="okbtn"
          onClick={handleClick}
        >确定</div>
      </div>
    </div>
  )
}