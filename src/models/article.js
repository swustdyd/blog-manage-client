import { searchArticle, saveOrUpdateArticle } from '../services/api';

export default {
  namespace: 'article',

  state: {
    list: [],
    total: 0,
    hasMore: true,
    showModal: false,
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
    *loadMorArticle(options, {call, put}) {
      const response = yield call(searchArticle);
      yield put({
        type: 'apendList',
        payload: {
          list: response.result.list,
          total: response.result.total,
        },
      });
    },
    *saveOrUpdateArticle({payload, resolve, reject}, {call, put}) {
      try {        
        const response = yield call(saveOrUpdateArticle, payload);
        if(response.ok){
          if(resolve){
            resolve(response);
          }
          yield put({
            type: 'hideModal',
          });
        }else if(reject){
          reject(response);
        }
      } catch (e) {
        if(reject){
          reject(e);
        }
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload.list,
        hasMore: action.payload.list.length > 0,
        total: action.payload.total,
      };
    },
    apendList(state, action) {
      state.list.push(...action.payload.list)
      return {
        ...state,
        list: state.list,
        hasMore: action.payload.list.length > 0,
        total: action.payload.total,
      };
    },
    showModal(state){
      return {
        ...state,
        showModal: true,
      };
    },
    hideModal(state){
      return {
        ...state,
        showModal: false,
      };
    },
  },
};
