import { stringify } from 'qs';
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('http://localhost:3001/fetchCurrent');
}


export async function searchUsers(params){
  return request(`http://localhost:3001/searchUsers?${stringify(params)}`);
}

export async function saveOrUpdateUser(params){
  return request('http://localhost:3001/saveOrUpdateUser', {
    method: 'POST',
    body: params,
  });
}