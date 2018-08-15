import { searchTags } from '../services/api';

export default {
  namespace: 'tag',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    *searchTags({payload}, { call, put }) {
      const response = yield call(searchTags, payload);
      yield put({
        type: 'saveList',
        payload: {
          list: response.result.list,
          total: response.result.total,
        },
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload.list,
        total: action.payload.total,
      };
    },
  },
};
