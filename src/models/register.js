import {message} from'antd'
import { fakeRegister } from '../services/api';

export default {
  namespace: 'register',

  state: {
    result: {},
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      if(!response.ok && response.message){        
        message.error(response.message);
      }
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        result: payload,
      };
    },
  },
};
