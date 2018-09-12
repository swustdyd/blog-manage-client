import { getAllRoutes } from '../api';

export default {
  namespace: 'api',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    *getAllRoutes({ resolve, reject }, { call, put }) {
      try {
        const response = yield call(getAllRoutes);
        if (response.ok) {
          const { list } = response.result;
          if (resolve) {
            resolve(response);
          }else{
            yield put({
              type: 'saveList',
              payload: list,
            });
          }
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
