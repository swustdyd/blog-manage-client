import { routerRedux } from 'dva/router';
import { searchCharts, saveOrUpdateChart, getChartDatas } from '../services/api';

export default {
  namespace: 'chart',

  state: {
    list: [],
    showModal: false,
    currentChart: {},
  },

  effects: {
    *searchCharts({ payload }, { call, put }) {
      const response = yield call(searchCharts, payload);
      yield put({
        type: 'saveList',
        payload: response.result.list,
      });
    },
    *getChartDatas({ payload }, {select, call, put }) {
      const response = yield call(getChartDatas, payload);
      const currentChart = yield select(state => state.chart.currentChart);
      yield put({
        type: 'setCurrentChart',
        payload: {...currentChart, listData: response.result.list},
      });
    },
    *saveOrUpdateChart({ payload, resolve, reject }, { call, put }) {
      try {
        const response = yield call(saveOrUpdateChart, payload);
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
    *viewChartSearch({payload}, {put}){      
      const {chart} = payload;
      yield put({
        type: 'setCurrentChart',
        payload: chart,
      });
      yield put(routerRedux.push('/chart/search'));
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    setCurrentChart(state, action){
      return{
        ...state,
        currentChart: action.payload,
      }
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
