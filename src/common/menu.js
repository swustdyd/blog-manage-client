import { isUrl } from '../utils/utils';

export const menuData = [
  {
    name: '操作日志',
    icon: 'file-text',
    path: 'article',
    children: [
      {
        name: '文章统计',
        path: 'chart',
      },
      {
        name: '文章列表',
        path: 'list',
      },
      {
        name: '标签设置',
        path: 'tag',
      },
    ],
  },
  {
    name: '系统设置',
    icon: 'setting',
    path: 'system',
    children: [
      {
        name: '角色设置',
        path: 'role',
      },
      {
        name: '用户列表',
        path: 'user-list',
      },
    ],
  },
  {
    name: '我的',
    icon: 'user',
    path: 'user',
    children: [
      {
        name: '个人中心',
        path: 'detail',
      },
    ],
  },
  {
    name: '报表管理',
    icon: 'bar-chart',
    path: 'chart',
    children: [
      {
        name: '报表设置',
        path: 'setting',
      },
      {
        name: '报表搜索页',
        path: 'search',
        hideInMenu: true,
      },
    ],
  },
];

export function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export async function getMenuData() {
  const menus = localStorage.getItem('user-menus');
  if (!menus) {
    return [];
  } else {
    return JSON.parse(menus);
  }
}
