import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message, BackTop, Tooltip} from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import PageProgress from '../components/PageProgress';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes, getQueryPath } from '../utils/utils';
import Authorized from '../utils/Authorized';
import logo from '../assets/logo.svg';
import { formatter } from '../common/menu';
import { getRouterData } from '../common/router';
import { createTreeMenusfromFlatMenus  } from '../utils/menu';

import styles from './BasicLayout.less'

const { Content, Header, Footer } = Layout;
const { check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
// getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

@connect(({ user, global = {}, loading}) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  menuData: user.menus,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))
export default class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isMobile,
      routerData: {},
      menuData: [],
    };
  }

  getChildContext() {
    const { location } = this.props;
    const { routerData, menuData } = this.state;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(menuData, routerData),
    };
  }

  componentDidMount() {
    const { dispatch, app } = this.props;
    const token = localStorage.getItem('token');
    if(token){
      new Promise((resolve, reject) => {
        dispatch({
          type: 'user/fetchCurrent',
          resolve,
          reject,
        });
      }).then(res => {
        const {menus: flatMenus} = res.result;
        if (!flatMenus || flatMenus.length < 1) {
          message.error("用户没有访问权限");
        } else {
          const menuData = createTreeMenusfromFlatMenus(flatMenus);
          const formatMenuData = formatter(menuData);
          formatMenuData.forEach(getRedirect);
          const routerData = getRouterData(app, formatMenuData);
          this.setState({
            menuData: formatMenuData,
            routerData,
          });
          this.enquireHandler = enquireScreen(mobile => {
            this.setState({
              isMobile: mobile,
            });
          });
        }
      })
      .catch(e => {
        message.error(e.message);
      });

      dispatch({
        type: 'global/fetchNotices',
      });
    }else{
      window.location.href = getQueryPath('/#/common/login', {
        redirect: window.location.href,
      });
    }
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  getPageTitle() {
    const { location } = this.props;
    const { routerData } = this.state;
    const { pathname } = location;
    let title = 'Blog Manage';
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - ${title}`;
    }
    return title;
  }

  getBaseRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.state;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'triggerError') {
      dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
    if (key === 'userDetail') {
      window.location.href = '/#/user/detail';
    }
  };

  handleNoticeVisibleChange = visible => {
    const { dispatch } = this.props;
    if (visible) {
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      match,
      location,
    } = this.props;
    const { isMobile: mb } = this.state;
    const { routerData, menuData } = this.state;
    const baseRedirect = this.getBaseRedirect();
    const {breadcrumbNameMap} = this.getChildContext();
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          title="报表系统"
          menuData={menuData}
          collapsed={collapsed}
          location={location}
          isMobile={mb}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              location={location}
              breadcrumbNameMap={breadcrumbNameMap}
              collapsed={collapsed}
              isMobile={mb}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(match.path, routerData).map(item => (
                <Route key={item.key} path={item.path} component={item.component} />
              ))}
              {baseRedirect ? <Redirect exact from="/" to={baseRedirect} /> : null}
              <Route render={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              copyright={
                <Fragment>
                  Blog Manage Copyright <Icon type="copyright" /> DYD{' '}
                  <a href="https://github.com/swustdyd/blog-manage-client">
                    <Icon type="github" />
                  </a>
                </Fragment>
              }
            />
          </Footer>          
          <BackTop>
            <Tooltip title="回到顶部">            
              <Icon className={styles.backTopIcon} type="arrow-up" />
            </Tooltip>
          </BackTop>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => (
            // eslint-disable-next-line
            <div id="mainContainer" className={classNames(params)}>
              <PageProgress targetId="mainContainer" className={styles.pageProgress} />
              {layout}
            </div>
          )}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}
