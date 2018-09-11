import { getAllMenus, saveOrUpdateMenu, searchMenus } from '../api';

export default {
  namespace: 'menu',

  state: {
    list: [],
    total: 0,
    showModal: false,
  },

  effects: {
    *searchMenus({payload, resolve, reject }, { call, put }) {
      try {
        const response = yield call(searchMenus, payload);
        if (response.ok) {
          const { list } = response.result;
          if (resolve) {
            resolve(response);
          }else{
            yield put({
              type: 'saveList',
              payload: list,
            });
          }
        } else if (reject) {
          reject(response);
        }
      } catch (e) {
        if (reject) {
          reject(e);
        }
      }
    },

    *getAllMenus({ resolve, reject }, { call, put }) {
      try {
        const response = yield call(getAllMenus);
        if (response.ok) {
          const { list } = response.result;
          if (resolve) {
            resolve(response);
          }else{
            yield put({
              type: 'saveList',
              payload: list,
            });
          }
        } else if (reject) {
          reject(response);
        }
      } catch (e) {
        if (reject) {
          reject(e);
        }
      }
    },

    *saveOrUpdateMenu({ payload, resolve, reject }, { call, put }) {
      try {
        const response = yield call(saveOrUpdateMenu, payload);
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
