import { } from '../api/user';

export default {
  namespace: 'menu',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    *getAllMenus({ resolve, reject }, { call, put }) {
      try {
        const response = yield call(queryCurrent);
        if (response.ok) {
          const { list } = response.result;
          if (resolve) {
            resolve(response);
          }
          yield put({
            type: 'saveList',
            payload: list,
          });
        } else if (reject) {
          reject(response);
        }
      } catch (e) {
        if (reject) {
          reject(e);
        }
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
        total: action.payload.length,
      };
    },
  },
};
