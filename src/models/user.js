import { query as queryUsers, queryCurrent, searchUsers, saveOrUpdateUser } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    showModal: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *fetchCurrent({ resolve, reject }, { call, put }) {
      try {
        const response = yield call(queryCurrent);
        if (response.ok) {
          const { menus, user } = response.result;
          if (menus) {
            localStorage.setItem('user-menus', response.result.menus);
          }
          if (resolve) {
            resolve(response);
          }
          yield put({
            type: 'saveCurrentUser',
            payload: user,
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
    *searchUsers({ payload }, { call, put }) {
      const response = yield call(searchUsers, payload);
      yield put({
        type: 'saveList',
        payload: response.result.list,
      });
    },
    *saveOrUpdateUser({ payload, resolve, reject }, { call, put }) {
      try {
        const response = yield call(saveOrUpdateUser, payload);
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
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
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
