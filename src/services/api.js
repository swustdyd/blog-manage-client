import { stringify } from 'qs';
import request from '../utils/request';

export async function accountLogin(params) {
  return request('http://localhost:3001/login', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request('http://localhost:3001/register', {
    method: 'POST',
    body: params,
  });
}

export async function searchArticle(options) {
  return request(`http://localhost:3001/searchArticle?${stringify(options)}`);
}

export async function saveOrUpdateArticle(params) {
  return request('http://localhost:3001/saveOrUpdateArticle', {
    method: 'POST',
    body: params,
  });
}

export async function searchTags(options) {
  return request(`http://localhost:3001/searchTags?${stringify(options)}`);
}

export async function saveOrUpdateTag(params) {
  return request('http://localhost:3001/saveOrUpdateTag', {
    method: 'POST',
    body: params,
  });
}

export async function searchRoles(params) {
  return request(`http://localhost:3001/searchRoles?${stringify(params)}`);
}

export async function saveOrUpdateRole(params) {
  return request('http://localhost:3001/saveOrUpdateRole', {
    method: 'POST',
    body: params,
  });
}

export async function searchCharts(params) {
  return request(`/api/searchCharts?${stringify(params)}`);
}

export async function getChartDatas(params) {
  return request(`/api/getChartDatas?${stringify(params)}`);
}

export async function saveOrUpdateChart(params) {
  return request('/api/saveOrUpdateChart', {
    method: 'POST',
    body: params,
  });
}
