import React, { Fragment } from 'react';
import { Link, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './CommonLayout.less';
import logo from '../assets/logo.svg';
import { getRoutes } from '../utils/utils';

class CommonLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Blog Manage';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Blog Manage`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
        <DocumentTitle title={this.getPageTitle()}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.top}>
                        <div className={styles.header}>
                            <Link to="/">
                                <img alt="logo" className={styles.logo} src={logo} />
                                <span className={styles.title}>Blog Manage</span>
                            </Link>
                        </div>
                        <div className={styles.desc}>Blog Manage 博客后台管理系统</div>
                    </div>
                    <Switch>
                        {getRoutes(match.path, routerData).map(item => (
                            <Route
                              key={item.key}
                              path={item.path}
                              component={item.component}
                              exact={item.exact}
                            />
                        ))}
                        {/* <Route render={NotFound} /> */}
                    </Switch>
                </div>
                <GlobalFooter
                    copyright={
                        <Fragment>
                          Blog Manage Copyright <Icon type="copyright" /> DYD <a href="https://github.com/swustdyd/blog-manage-client"><Icon type="github" /></a>
                        </Fragment>
                    }
                />
            </div>
        </DocumentTitle>
    );
  }
}

export default CommonLayout;
