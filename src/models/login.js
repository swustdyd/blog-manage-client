import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { message } from 'antd';
import { accountLogin } from '../services/api';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);        
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: true,
        },
      });
      // Login successfully
      if (response.ok) {
        // reloadAuthorized();
        if(response.menus){
          localStorage.setItem('user-menus', JSON.stringify(response.menus))
        }
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }else{
        message.error(response.message);
      }      
    },
    *logout(_, { put }) {
      localStorage.removeItem('user-menus')
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(
        routerRedux.push({
          pathname: '/common/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
