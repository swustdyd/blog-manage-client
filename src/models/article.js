import { searchArticle } from '../services/api';

export default {
  namespace: 'article',

  state: {
    list: [],
    total: 0,
    hasMore: true,
  },

  effects: {
    *searchArticle(options, { call, put }) {
      const response = yield call(searchArticle);
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
      state.list.push(...action.payload.list);
      return {
        ...state,
        // list: state.list.push(...action.payload.list),
        hasMore: action.payload.list.length > 0,
        total: action.payload.total,
      };
    },
  },
};
