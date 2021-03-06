import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export function getRouterData(app, menus = []) {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/article/list': {
      component: dynamicWrapper(app, ['article', 'tag'], () =>
        import('../routes/Article/SearchArticle')
      ),
    },
    '/article/tag': {
      component: dynamicWrapper(app, ['tag'], () => import('../routes/System/TagList')),
    },
    '/system/role': {
      component: dynamicWrapper(app, ['role'], () => import('../routes/System/RoleList')),
    },
    '/system/userList': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/System/UserList')),
    },
    '/system/menu': {
      component: dynamicWrapper(app, ['menu'], () => import('../routes/System/MenuList')),
    },
    '/chart/setting': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Chart/Setting')),
    },  
    '/chart/view': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Chart/ChartSearch')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/other/mockApi': {
      component: dynamicWrapper(app, [], () => import('../components/MockApi')),
    },
    '/other/serverApi': {
      component: dynamicWrapper(app, ['api'], () => import('../routes/Other/ServerApi')),
    },
    '/other/socket': {
      component: dynamicWrapper(app, ['api'], () => import('../routes/Other/SocketTest')),
    },
    '/common': {
      component: dynamicWrapper(app, [], () => import('../layouts/CommonLayout')),
    },
    '/common/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/Common/Login')),
    },
    '/common/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/Common/Register')),
    },
    '/common/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/Common/RegisterResult')),
    },  
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(menus);
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (
      menuKey ||
      path === '/' ||
      path.indexOf('exception') !== -1 ||
      path.indexOf('common') !== -1
    ) {
      menuItem = menuData[menuKey] || {};

      // base on menu config
      let router = routerConfig[path];

      // If you need to configure complex parameter routing,
      // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
      // eg . /list/:type/user/info/:id
      router = {
        ...router,
        name: router.name || menuItem.name,
        authority: router.authority || menuItem.authority,
        hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
      };
      routerData[path] = router;
    }
  });
  return routerData;
}
