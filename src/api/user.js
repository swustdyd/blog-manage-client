import { stringify } from 'qs';
import request from '../utils/request';
import {Urls} from './config'

/**
 * 账号登录
 * @param {*} params 
 */
export async function accountLogin(params) {
  return request(Urls.LOGIN, {
    method: 'POST',
    body: params,
  });
}

/**
 * 用户注册
 * @param {*} params 
 */
export async function register(params) {
  return request(Urls.REGISTER, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取当前用户
 */
export async function getCurrentUser() {
  return request(Urls.GET_CURRENT_USER);
}

/**
 * 搜索用户
 * @param {*} params 
 */
export async function searchUsers(params) {
  return request(`${Urls.SEARCH_USERS}?${stringify(params)}`);
}

/**
 * 保存或者修改用户
 * @param {*} params 
 */
export async function saveOrUpdateUser(params) {
  return request(Urls.SAVE_OR_UPDATE_USER, {
    method: 'POST',
    body: params,
  });
}
