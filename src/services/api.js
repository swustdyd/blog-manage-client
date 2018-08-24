import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('http://localhost:3001/login', {
    method: 'POST',
    body: params,
  });
}

export async function accountLogin(params) {
  return request('http://localhost:3001/login', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('http://localhost:3001/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
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

export async function getMenus() {
  return request('/api/menus');
}
