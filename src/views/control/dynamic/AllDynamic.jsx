import '../scss/AllDynamic.scss'
import { Menu, Space, Table, Input, Switch, Flex, Radio,
  Cascader, Form, Select, Button } from "antd";
import { useState, useEffect } from 'react';
import { getAllDynamic } from '../../../api/dynamic';


const { Search } = Input

const AllDynamic = () => {
  const [data, setData] = useState(),
        [keyword, setKeyword] = useState(''),
        [filterflag, setFilterflag] = useState(false),
        [filter1, setFilter1] = useState(),
        [sortflag, setSortflag] = useState(false),
        [filter2, setFilter2] = useState(),
        [viewflag, setViewflag] = useState(0),
        [nowdata, setNowdata] = useState()

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getAllDynamic()])
      console.log(res[0]);
      setData(res[0]) 
      // let tempNum = []     
      // for (let i = 0; i < res[1].length; i++) {
      //   const temp = {
      //     value: res[1][i].value,
      //     label: res[1][i].value
      //   }
      //   tempNum.push(temp)
      // }
      // console.log(tempNum);
    }
    getData()
  }, [])

  const searchFnc = () => {

  }

  const editorthis = (vid) => {
    console.log(vid);
    
  }

  const opationthis = (vid) => {

  }


  const filter = (inputValue, path) =>
    path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

  const columns = [
    {
      title: 'Dynamic',
      render: (item) => 
      <div className='tb-viewbox'>
        123
      </div>,
    },
    {
      title: 'Infos',
      render: (item) =>
        <div className="tb-video-rightinfo">
          <div className="tb-v-title">{item.title}</div>
          <div className="tb-v-inf">
            <div className="tb-v-user-line0">did:{item.id}</div>
            <div className="tb-v-user-line1">
              <div>
                <span className="iconfont">&#xe61c;</span>
                <span>{item.likes}</span>
              </div>
              <div>
                <span className="iconfont">&#xe6ba;</span>
                <span>{item.comments}</span>
              </div>
              <div>
                <span className="iconfont">&#xe633;</span>
                <span>{item.shares}</span>
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
      title: 'Topical',
      dataIndex: 'topical',
      render: (topical) => 
        {
          topical != null ?
          <div className='tb-maintag'>{topical}</div>
          :
          <div className='tb-maintag'>No</div>
        }
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
      label: '发布时间',
      value: '发布时间',
    },
    {
      label: '点赞',
      value: '点赞',
    },
    {
      label: '评论',
      value: '评论',
    },
    {
      label: '分享',
      value: '分享',
    }
  ]
  const options3 = [
    {
      label: '发布',
      value: '发布',
    },
    {
      label: '删除',
      value: '删除',
    }
  ];
  return (
    <>
      <div className="filter-box">
        <div className="searchline">
          <div className="search-box-o">
            <Search
              placeholder="搜索标题"
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
                  defaultValue="发布时间"
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
              <div className="ofl-text">话题</div>
              <div className="ofl-con">
              <Cascader
                placeholder="搜索话题"
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
      {/* {
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
      } */}
    </>
  )
}

export default AllDynamic