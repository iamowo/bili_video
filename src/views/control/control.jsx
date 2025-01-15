import './scss/index.scss'
import React, { memo, useEffect } from 'react';
import { UserOutlined, HomeFilled, SettingFilled, ProductFilled } from '@ant-design/icons';
import { Menu } from "antd";
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { baseurl } from '../../api';

function Control () {
  const navigate = useNavigate()
  return (
    <div className="control-view">
      <div className="con-top">
        <div className="top-icon">
          <img src={baseurl + "/sys/picon.png"} alt="" className="logo-img"
            onClick={() => navigate("/")}
          />          
          <span>控制后台</span>
        </div>
      </div>
      <div className="btm-content">
        <div className="con-leftmenu">
          <Lmenu />
        </div>
        <div className="con-rightcont">
          <Outlet />
        </div>
      </div>
    </div>
  )
}


export default Control

const Lmenu = () => {
  const menuitems = [
    {
      type: 'group',
      children: [
        {
          key: '0',
          label: '首页',
          icon: <HomeFilled />,
        },
      ],
    },
    {
      label: '内容管理',
      icon: <ProductFilled />,
      children: [
        {
          type: 'group',
          children: [
            {
              label: '视频',
              children: [
                {
                  key: '1',
                  label: '全部视频',
                },
                {
                  key: '2',
                  label: '视频列表',
                },
                {
                  key: '3',
                  label: 'Animations',
                },
              ],
            },
            {
              label: '动态',
              children: [
                {
                  key: '4',
                  label: '全部动态',
                },
                {
                  key: '5',
                  label: '话题',
                },
              ],
            },
            {
              key: '6',
              label: '漫画',
            },
          ],
        },
      ],
    },
    {
      label: '用户管理',
      icon: <UserOutlined />,
      children: [
        {
          key: '7',
          label: '全部用户',
        },
        {
          key: '8',
          label: '用户行为统计',
        },
        {
          key: '9',
          label: '黑名单',
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      label: '系统管理',
      icon: <SettingFilled />,
      children: [
        {
          key: '10',
          label: 'banner',
        },
        {
          key: '11',
          label: '活动',
        },
        {
          key: '12',
          label: '系统通知',
        },
      ],
    }
  ];
  const navigate = useNavigate()
  const clickbtn = (e) => {
    if (e.key === '0') {
      navigate("/control")
    } else if (e.key === '1') {
      navigate("/control/videos")
    } else if (e.key === '2') {
      navigate("/control/videos")
    } else if (e.key === '3') {
      navigate("/control/videos")
    } else if (e.key === '4') {
      navigate("/control/dynamics")
    } else if (e.key === '5') {
      navigate("/control/dynamics")
    } else if (e.key === '6') {
      navigate("/control/users")
    } else if (e.key === '7') {
      navigate("/control/users")
    } else if (e.key === '8') {
      navigate("/control/banners")
    } else if (e.key === '9') {
      navigate("/control/videos")
    } else if (e.key === '10') {
      navigate("/control/banners")
    } else if (e.key === '11') {
      navigate("/control/videos")
    } else if (e.key === '12') {
      navigate("/control/videos")
    }
  }
  return (
    <div className="menubox-sc">
      <Menu 
        onClick={clickbtn}
        style={{width: '226px', borderRadius: '6px'}}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['1']}
        mode="inline"
        items={menuitems}
      />
    </div>
  )
}