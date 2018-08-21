import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getRouterData } from './common/router';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const CommonLayout = routerData['/common'].component;
  const BasicLayout = routerData['/'].component;
  return (
      <LocaleProvider locale={zhCN}>
          <ConnectedRouter history={history}>
              <Switch>
                  <Route path="/common" component={CommonLayout} />
                  <Route
                    path="/"
                    render={props => {
                      return <BasicLayout app={app} {...props} />;
                    }}
                  />
              </Switch>
          </ConnectedRouter>
      </LocaleProvider>
  );
}
export default RouterConfig;
