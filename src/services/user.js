import { stringify } from 'qs';
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}


export async function searchUsers(params){
  return request(`/api/searchUsers?${stringify(params)}`);
}

export async function saveOrUpdateUser(params){
  return request('/api/saveOrUpdateUser', {
    method: 'POST',
    body: params,
  });
}