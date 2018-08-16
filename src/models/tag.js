import { searchTags, saveOrUpdateTag } from '../services/api';

export default {
  namespace: 'tag',

  state: {
    list: [],
    total: 0,
    showModal: false,
  },

  effects: {
    *searchTags({payload}, { call, put}) {
      const response = yield call(searchTags, payload);
      yield put({
        type: 'saveList',
        payload: {
          list: response.result.list,
          total: response.result.total,
        },
      });
    },
    *saveOrUpdateTag({payload, resolve, reject}, { call, put }) {
      try {        
        const response = yield call(saveOrUpdateTag, payload);
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
