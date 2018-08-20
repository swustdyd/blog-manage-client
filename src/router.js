import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import { getQueryPath } from './utils/utils';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
  // const routerData = getRouterData(app);
  // const UserLayout = routerData['/user'].component;
  // const BasicLayout = routerData['/'].component;
  // return (
  //   <LocaleProvider locale={zhCN}>
  //     <ConnectedRouter history={history}>
  //       <Switch>
  //         <Route path="/user" component={UserLayout} />
  //         <AuthorizedRoute
  //           path="/"
  //           render={props => <BasicLayout {...props} />}
  //           authority={['admin', 'user']}
  //           redirectPath={getQueryPath('/user/login', {
  //             redirect: window.location.href,
  //           })}
  //         />
  //       </Switch>
  //     </ConnectedRouter>
  //   </LocaleProvider>
  // );
  return <RouterConfigAsync history={history} app={app} />;
}

export default RouterConfig;

class RouterConfigAsync extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routerData: null,
    };
  }

  componentDidMount() {
    const { app } = this.props;
    getRouterData(app).then(routerData => {
      this.setState({
        routerData,
      });
    });
  }

  getRouterConfig = (history, app, routerData) => {
    const UserLayout = routerData['/user'].component;
    const BasicLayout = routerData['/'].component;
    return (
      <LocaleProvider locale={zhCN}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/user" component={UserLayout} />
            <AuthorizedRoute
              path="/"
              render={props => {
                return <BasicLayout {...props} />;
              }}
              authority={['admin', 'user']}
              redirectPath={getQueryPath('/user/login', {
                redirect: window.location.href,
              })}
            />
          </Switch>
        </ConnectedRouter>
      </LocaleProvider>
    );
  };

  render() {
    const { history, app } = this.props;
    const { routerData } = this.state;
    return routerData ? this.getRouterConfig(history, app, routerData) : <div>加载中...</div>;
  }
}
