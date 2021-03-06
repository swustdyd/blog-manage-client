import { getCurrentUser, searchUsers, saveOrUpdateUser } from '../api/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    showModal: false,
  },

  effects: {
    *fetchCurrent({ resolve, reject }, { call, put }) {
      try {
        const response = yield call(getCurrentUser);
        if (response.ok) {
          const { user } = response.result;
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
    *searchUsers({ payload, resolve, reject }, { call, put }) {
      try {
        const response = yield call(searchUsers, payload);
        if (response.ok) {
          if (resolve) {
            resolve(response);
          }
          yield put({
            type: 'saveList',
            payload: response.result.list,
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
        currentUser: {
          ...state.currentUser,
          ...action.payload,
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
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
