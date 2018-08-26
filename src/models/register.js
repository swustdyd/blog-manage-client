import { message } from 'antd';
import { register } from '../services/api';

export default {
  namespace: 'register',

  state: {
    result: {},
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(register, payload);
      if (!response.ok && response.message) {
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
