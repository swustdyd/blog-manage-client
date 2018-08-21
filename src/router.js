import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getRouterData } from './common/router';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const Login = routerData['/common/login'].component;
  const Register = routerData['/common/register'].component;
  const RegisterResult = routerData['/common/register-result'].component;
  const BasicLayout = routerData['/'].component;
  return (
      <LocaleProvider locale={zhCN}>
          <ConnectedRouter history={history}>
              <Switch>
                  <Route path="/common/login" component={Login} />
                  <Route path="/common/register" component={Register} />
                  <Route path="/common/register-result" component={RegisterResult} />
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
