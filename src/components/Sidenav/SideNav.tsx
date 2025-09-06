/* eslint-disable @typescript-eslint/no-explicit-any */
import Icon, * as IconObj from '@ant-design/icons'
import { NavLink } from '@components/Common/NavLink'
import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader'
// import sidenavData from '@constants/menuData.json'
import { Layout, Menu, Tag } from 'antd'
import { delay } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useDevice from 'src/hook/useDevice'
import { type AppThunkDispatch, type RootState } from 'src/store'
import { fetchSideNav } from 'src/store/slice/navMenuSlice'
const { Sider } = Layout
const IMAGE_BASE_PATH = '';

interface PropTypes {
  trigger?: null
  collapsed: boolean
  setOpenDrawer: (param: boolean) => void
  sidenavWidth?: number
  collapseWidth?: number
}

const SideNav = ({trigger, collapsed, sidenavWidth, collapseWidth, setOpenDrawer}: PropTypes): JSX.Element => {
  const dispatch = useDispatch<AppThunkDispatch>()
  const menuState = useSelector((state: RootState) => state.menu)
  const {isMobileDevice} = useDevice()
  const router = useRouter()

  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    const path = router.asPath.split('/')[1]
    setCurrentPath(path)
  })

  useEffect(() => {
    void dispatch(fetchSideNav())
  }, [dispatch])

  // console.log("menu==", menuState)

  const renderDynamicIcon = (icon: any): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const iconComp = (IconObj as any)[icon]
    return icon != null ? <Icon component={iconComp as React.ForwardRefExoticComponent<any>} /> : <></>
  }

  const logoObj = {
    url: collapsed ? "/images/LMC_icon.png" : "/images/LMC_logo.webp",
    width: collapsed ? 50 : 240,
    height: collapsed ? 50 : 70,
    alt: collapsed ? "Brand Image Icon" : "Brand Logo",
  };

  return (
    <Sider
      trigger={null}
      width={sidenavWidth}
      collapsedWidth={collapseWidth}
      collapsible
      collapsed={collapsed}
      className="min-height-100vh fix-sidebar border-right"
    >
      <div className="logo justify-content-center">
        <Link href={'/'}>
          <img
            src={logoObj.url}
            alt={logoObj.alt}
            width={logoObj.width}
            height={logoObj.height}
          />
        </Link>
        {/* <div style={{background: '#ddd', height: '60px', margin: '15px'}}></div> */}
      </div>
      {menuState.loading ? (
        <div className="mx-3">
          <TableContentLoaderWithProps
            verticalGap={80}
            columnWidth={[10, "5", 85]}
            rowCounts={12}
            rowHeight={230}
            radius={50}
          />
        </div>
      ) : (
        <Menu
          className="menu-height"
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[currentPath]}
        >
          {menuState.data.map((obj) => (
            <Menu.Item
              key={obj.key}
              onClick={() =>
                isMobileDevice && delay(() => setOpenDrawer(false), 1000)
              }
              icon={renderDynamicIcon(obj.icon)}
            >
              <NavLink href={obj.path}>
                <div className="d-flex justify-content-between align-items-center">
                  {obj.title}
                  {obj?.notification != null ? (
                    <Tag color="#B06AB3" className="m-0">
                      {obj?.notification}
                    </Tag>
                  ) : null}
                </div>
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      )}
    </Sider>
  );
}

export default SideNav
