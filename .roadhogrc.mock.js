import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import {
  getActivities,
  getNotice,
  getFakeList,
  getArticles,
  getTags,
  adminMenus,
  superAdminMenus,
  getCharts,
} from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
        menus: adminMenus,
      });
      return;
    }
    if (password === '888888' && userName === 'superAdmin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
        menus: superAdminMenus,
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/searchArticle': (req, res) => {
    res.send({
      ok: true,
      result: {
        total: 305,
        list: getArticles,
      },
    });
  },
  'GET /api/searchTags': (req, res) => {
    let { pageSize, offset } = req.query;
    offset = parseInt(offset);
    pageSize = parseInt(pageSize);
    let list = [];
    if (pageSize >= getTags.length) {
      list = getTags;
    } else {
      list = getTags.slice(offset, offset + pageSize);
    }
    res.send({
      ok: true,
      result: {
        total: getTags.length,
        list,
      },
    });
  },
  'POST /api/saveOrUpdateTag': (req, res) => {
    const { tag } = req.body;
    res.send({
      ok: tag ? true : false,
      message: tag ? '保存成功' : '保存失败',
      result: {
        ...tag,
        id: 1,
      },
    });
  },
  'GET /api/searchRoles': (req, res) => {
    const { offset, pageSize } = req.query;
    res.send({
      ok: true,
      result: {
        list: [
          {
            id: 1,
            name: '普通用户',
            typeName: 'normal',
            createAt: '2018-08-20 09:18:00',
            updateAt: '2018-08-20 09:18:00',
          },
          {
            id: 2,
            name: '管理员',
            typeName: 'admin',
            createAt: '2018-08-20 09:18:00',
            updateAt: '2018-08-20 09:18:00',
          },
          {
            id: 3,
            name: '超级管理员',
            typeName: 'superAdmin',
            createAt: '2018-08-20 09:18:00',
            updateAt: '2018-08-20 09:18:00',
          },
        ],
      },
    });
  },
  'POST /api/saveOrUpdateRole': (req, res) => {
    const { role } = req.body;
    res.send({
      ok: role ? true : false,
      message: role ? '保存成功' : '保存失败',
      result: {
        ...role,
        id: 1,
      },
    });
  },
  'GET /api/searchUsers': (req, res) => {
    const { offset, pageSize } = req.query;
    res.send({
      ok: true,
      result: {
        list: [
          {
            id: 1,
            name: '用户1',
            role: 1,
            roleName: '普通用户',
            createAt: '2018-08-20 09:18:00',
            updateAt: '2018-08-20 09:18:00',
          },
          {
            id: 2,
            name: '用户2',
            role: 2,
            roleName: '管理员',
            createAt: '2018-08-20 09:18:00',
            updateAt: '2018-08-20 09:18:00',
          },
          {
            id: 3,
            name: '用户3',
            role: 3,
            roleName: '超级管理员',
            createAt: '2018-08-20 09:18:00',
            updateAt: '2018-08-20 09:18:00',
          },
        ],
      },
    });
  },
  'POST /api/saveOrUpdateUser': (req, res) => {
    const { user } = req.body;
    res.send({
      ok: user ? true : false,
      message: user ? '保存成功' : '保存失败',
      result: {
        ...user,
        id: 1,
      },
    });
  },
  'GET /api/menus': (req, res) => {
    res.send({
      ok: true,
      result: [
        {
          name: '文章管理',
          path: 'article',
          icon: 'file-text',
          children: [{ name: '文章列表', path: 'list' }, { name: '标签设置', path: 'tag' }],
        },
        {
          name: '系统设置',
          path: 'system',
          icon: 'setting',
          children: [{ name: '角色设置', path: 'role' }, { name: '用户列表', path: 'user-list' }],
        },
        {
          name: '我的',
          path: 'user',
          icon: 'user',
          children: [{ name: '个人中心', path: 'detail' }],
        },
      ],
    });
  },
  'GET /api/searchCharts': (req, res) => {
    res.send({
      ok: true,
      result: {
        list: getCharts,
      },
    });
  },
  'POST /api/saveOrUpdateChart': (req, res) => {
    const { chart } = req.body;
    res.send({
      ok: chart ? true : false,
      message: chart ? '保存成功' : '保存失败',
      result: {
        ...chart,
        id: 1,
      },
    });
  },
};

export default (noProxy ? {} : delay(proxy, 10));
