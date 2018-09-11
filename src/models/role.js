import { searchRoles, saveOrUpdateRole } from '../api';

export default {
  namespace: 'role',

  state: {
    list: [],
    total: 0,
    showModal: false,
  },

  effects: {
    *searchRoles({payload = {}}, { call, put }) {
      const response = yield call(searchRoles, payload);
      yield put({
        type: 'saveList',
        payload: {
          list: response.result.list,
          total: response.result.total,
        },
      });
    },
    *saveOrUpdateRole({payload = {}, resolve, reject}, { call, put }) {
      try {
        const response = yield call(saveOrUpdateRole, payload);
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
          reject(e)
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
