import { stringify } from 'qs';
import request from '../utils/request';
import {Urls} from './config'

export async function searchArticle(options) {
  return request(`${Urls.SEARCH_ARTICLES}?${stringify(options)}`);
}

export async function saveOrUpdateArticle(params) {
  return request(Urls.SAVE_OR_UPDATE_ARTICLE, {
    method: 'POST',
    body: params,
  });
}

export async function searchTags(options) {
  return request(`${Urls.SEARCH_TAGS}?${stringify(options)}`);
}

export async function saveOrUpdateTag(params) {
  return request(Urls.SAVE_OR_UPDATE_TAG, {
    method: 'POST',
    body: params,
  });
}

export async function searchRoles(params) {
  return request(`${Urls.SEARCH_ROLES}?${stringify(params)}`);
}

export async function saveOrUpdateRole(params) {
  return request(Urls.SAVE_OR_UPDATE_ROLE, {
    method: 'POST',
    body: params,
  });
}

export async function searchCharts(params) {
  return request(`${Urls.SEARCH_CHARTS}?${stringify(params)}`);
}

export async function getChartDatas(params) {
  return request(`${Urls.GET_CHART_DATAS}?${stringify(params)}`);
}

export async function saveOrUpdateChart(params) {
  return request(Urls.SAVE_OR_UPDATE_CHART, {
    method: 'POST',
    body: params,
  });
}

export async function getAllMenus() {
  return request(Urls.GET_ALL_MENUS);
}

export async function searchMenus(params) {
  return request(`${Urls.SEARCH_MENUS}?${stringify(params)}`);
}

export async function saveOrUpdateMenu(params) {
  return request(Urls.SAVE_OR_UPDATE_MENU, {
    method: 'POST',
    body: params,
  })
}

export async function getAllRoutes() {
  return request(Urls.GET_ALL_ROUTES);
}

export async function searchRoutes(params) {
  return request(`${Urls.SEARCH_ROUTES}?${stringify(params)}`)
}
