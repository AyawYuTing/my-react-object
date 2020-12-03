import request from 'umi-request';
import { stringify } from 'qs';

export interface LoginParamsType {
  // userName: string;
  pwd: string;
  mobile: string;
  // captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  // /api/login/account
  return request('/api/ajaxLogin', {
    method: 'POST',
    body:stringify(params)
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
