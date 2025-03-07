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
      key: '1',
      label: '首页',
      icon: <HomeFilled />,
    },
    {
      key: '2',
      label: '内容管理',
      icon: <ProductFilled />,
      children: [
        {
          key: '21',
          label: '视频',
          children: [
            {
              key: '211',
              label: '全部视频',
            },
            {
              key: '212',
              label: '视频列表',
            },
            {
              key: '213',
              label: 'Animations',
            },
          ],
        },
        {
          key: '22',
          label: '动态',
          children: [
            {
              key: '221',
              label: '全部动态',
            },
            {
              key: '222',
              label: '话题',
            },
          ],
        },
        {
          key: '23',
          label: '漫画',
        }
      ],
    },
    {
      key: '3',
      label: '用户管理',
      icon: <UserOutlined />,
      children: [
        {
          key: '31',
          label: '全部用户',
        },
        {
          key: '32',
          label: '用户行为统计',
        },
        {
          key: '33',
          label: '黑名单',
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: '系统管理',
      icon: <SettingFilled />,
      children: [
        {
          key: '41',
          label: '轮播管理',
          children: [
            {
              key: '411',
              label: '视频',
            },
            {
              key: '412',
              label: '漫画',
            }
          ]
        },
        {
          key: '42',
          label: '活动',
        },
        {
          key: '43',
          label: '系统通知',
        },
      ],
    }
  ];
  const navigate = useNavigate()
  const clickbtn = (e) => {
    if (e.key === '1') {
      navigate("/control")
    } else if (e.key === '211') {
      navigate("/control/videos")
    } else if (e.key === '212') {
      navigate("/control/videos")
    } else if (e.key === '213') {
      navigate("/control/videos")
    } else if (e.key === '221') {
      navigate("/control/dynamics")
    } else if (e.key === '222') {
      navigate("/control/dynamics")
    } else if (e.key === '223') {
      navigate("/control/users")
    } else if (e.key === '23') {
      navigate("/control/users")
    } else if (e.key === '31') {
      navigate("/control/users")
    } else if (e.key === '32') {
      navigate("/control/videos")
    } else if (e.key === '411') {
      navigate("/control/banners")
    } else if (e.key === '411') {
      navigate("/control/videos")
    } else if (e.key === '42') {
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