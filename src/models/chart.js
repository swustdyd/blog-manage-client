import { searchCharts, saveOrUpdateChart } from '../services/api';

export default {
  namespace: 'chart',

  state: {
    list: [],
    showModal: false,
  },

  effects: {
    *searchCharts({ payload }, { call, put }) {
      const response = yield call(searchCharts, payload);
      yield put({
        type: 'saveList',
        payload: response.result.list,
      });
    },
    *saveOrUpdateChart({ payload, resolve, reject }, { call, put }) {
      try {
        const response = yield call(saveOrUpdateChart, payload);
        if (response.ok) {
          if (resolve) {
            resolve(response);
          }
          yield put({
            type: 'hideModal',
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
      };
    },
    hideModal(state) {
      return {
        ...state,
        showModal: false,
      };
    },
    showModal(state) {
      return {
        ...state,
        showModal: true,
      };
    },
  },
};
