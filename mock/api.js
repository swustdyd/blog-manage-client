import { parse } from 'url';

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];
const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const avatars2 = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/uVZonEtjWwmUZPBQfycs.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const desc = [
  '那是一种内在的东西， 他们到达不了，也无法触及的',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
];

const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];

export function fakeList(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      owner: user[i % 10],
      title: titles[i % 8],
      avatar: avatars[i % 8],
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
      status: ['active', 'exception', 'normal'][i % 3],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % 8],
      href: 'https://ant.design',
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      subDescription: desc[i % 5],
      description:
        '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      star: Math.ceil(Math.random() * 100) + 100,
      like: Math.ceil(Math.random() * 100) + 100,
      message: Math.ceil(Math.random() * 10) + 10,
      content:
        '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
        },
      ],
    });
  }

  return list;
}

export function getFakeList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  const count = params.count * 1 || 20;

  const result = fakeList(count);

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export const getNotice = [
  {
    id: 'xxx1',
    title: titles[0],
    logo: avatars[0],
    description: '那是一种内在的东西，他们到达不了，也无法触及的',
    updatedAt: new Date(),
    member: '科学搬砖组',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx2',
    title: titles[1],
    logo: avatars[1],
    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    updatedAt: new Date('2017-07-24'),
    member: '全组都是吴彦祖',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx3',
    title: titles[2],
    logo: avatars[2],
    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    updatedAt: new Date(),
    member: '中二少女团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx4',
    title: titles[3],
    logo: avatars[3],
    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
    updatedAt: new Date('2017-07-23'),
    member: '程序员日常',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx5',
    title: titles[4],
    logo: avatars[4],
    description: '凛冬将至',
    updatedAt: new Date('2017-07-23'),
    member: '高逼格设计天团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx6',
    title: titles[5],
    logo: avatars[5],
    description: '生命就像一盒巧克力，结果往往出人意料',
    updatedAt: new Date('2017-07-23'),
    member: '骗你来学计算机',
    href: '',
    memberLink: '',
  },
];

export const getActivities = [
  {
    id: 'trend-1',
    updatedAt: new Date(),
    user: {
      name: '曲丽丽',
      avatar: avatars2[0],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-2',
    updatedAt: new Date(),
    user: {
      name: '付小小',
      avatar: avatars2[1],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-3',
    updatedAt: new Date(),
    user: {
      name: '林东东',
      avatar: avatars2[2],
    },
    group: {
      name: '中二少女团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-4',
    updatedAt: new Date(),
    user: {
      name: '周星星',
      avatar: avatars2[4],
    },
    project: {
      name: '5 月日常迭代',
      link: 'http://github.com/',
    },
    template: '将 @{project} 更新至已发布状态',
  },
  {
    id: 'trend-5',
    updatedAt: new Date(),
    user: {
      name: '朱偏右',
      avatar: avatars2[3],
    },
    project: {
      name: '工程效能',
      link: 'http://github.com/',
    },
    comment: {
      name: '留言',
      link: 'http://github.com/',
    },
    template: '在 @{project} 发布了 @{comment}',
  },
  {
    id: 'trend-6',
    updatedAt: new Date(),
    user: {
      name: '乐哥',
      avatar: avatars2[5],
    },
    group: {
      name: '程序员日常',
      link: 'http://github.com/',
    },
    project: {
      name: '品牌迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
];

function renderTemplate(num, template, callback) {
  const tags = [];
  for (let i = 0; i < num; i += 1) {
    tags.push(callback(template, i));
  }
  return tags;
}

const tagTemplate = {
  id: 1,
  name: 'tag1',
  description: 'test tag describtion',
  createAt: '2018-10-25 12:56:30',
  updateAt: '2018-10-25 12:56:30',
  color: '#333',
};

const tagColors = [
  '#CC9999',
  '#666699',
  '#FF9900',
  '#0099CC',
  '#CCCC99',
  '#CC3399',
  '#99CC00',
  '#FF6666',
  '#3399CC',
  '#CC6600',
  '#999999',
  '#CCCC33',
  '#FF9933',
  '#009933',
  '#0099CC',
  '#CCCCCC',
  '#FF6666',
  '#FF6600',
  '#009966',
  '#CC6633',
  '#FFCC99',
  '#CC6600',
  '#CC0066',
  '#009999',
  '#FFCC33',
];

export const getTags = renderTemplate(tagColors.length, tagTemplate, (template, index) => {
  const id = index + 1;
  return {
    ...template,
    id,
    name: `标签${id}`,
    description: `标签${id}描述`,
    color: tagColors[index],
  };
});

const articleTemplate = {
  id: 0,
  title: 'test title',
  views: 1,
  content: 'Ant Design, a design language for background applications, is refined by Ant UED Team',
  tags: getTags.slice(0, 3),
  createAt: '2018-10-25 12:56:30',
  updateAt: '2018-10-25 12:56:30',
};

export const getArticles = renderTemplate(6, articleTemplate, (template, index) => {
  const id = index + 1;
  return { ...template, id, title: `文章${id}标题` };
});

export const adminMenus = [
  {
    name: '文章管理',
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
];

export const superAdminMenus = [
  {
    name: '文章管理',
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
];

const types = ['input', 'select', 'radio', 'checkbox', 'datePicker', 'rangePicker'];
const sqls = ['data1', 'data2', 'data3'];
function getData1(num){
  const data1 = [];
  for (let i = 0; i < num; i += 1) {
    data1.push({
      '房租': 1200 + i * 20,
      '水电费': 300 + i * 2,
      '交通费': 200 + i * 2,
      '伙食费': 900 + i * 5,
      '日用品数': 300 + i * 5,
      // '总费用': 2900 + i * 34, 
    })
  }
  return data1;
}
export const getChartDatas = {
  data1: getData1(12),
  data2: getData1(12),
  data3: getData1(12),
}
const scriptForChart = `function (list){
  if(list && list.length){
    const options = [];
    const legends = ['一月', '二月', '三月', '四月','五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    const keys = Object.keys(list[0]);
    const series = [];
    keys.forEach(key => {
      const serie = {
        name: key,
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: [],
      };
      list.forEach(row => {
        serie.data.push(row[key]);
      })
      series.push(serie);
    })
    options.push({
      title: {
        text: '深圳一年最低生活费趋势（单位：元）'
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        top: 'bottom',
        data: keys
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: legends.slice(0, list.length),
      },
      yAxis: {
          type: 'value',
      },
      series,
    })

    // 一月份
    const pieSeriesData = [];
    keys.forEach(key => {
      pieSeriesData.push({
        name: key,
        value: list[0][key],
      })
    })
    options.push({
      watermarker: true,
      title: {
        text: '深圳一月份最低生活费组成（单位：元）'
      },
      tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
          top: 'middle',
          orient: 'vertical',
          x: 'left',
          data: keys 
      },
      series: [
          {
              name:'消费类型',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              stack: 'chart',
              label: {
                  normal: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      show: true,
                      textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              data: pieSeriesData
          }
      ]
  })
    return options;
  }else{
    throw new Error('数据不能为空');
  }
}`

const scripts = {
  data1: scriptForChart,
  data2: scriptForChart,
  data3: scriptForChart,
};
const getValues = (num) => {
  const values = [];
  for (let i = 0; i < num; i += 1) {
    values.push({
      value: i + 1,
      label: `选项${i + 1}`,
    })      
  }
  return values;
};

const chartSearchItemTemplate = {
  name: '报表',
  sql: 'test sql',
  script: 'test script',
  where: [],
};

export const getCharts = renderTemplate(3, chartSearchItemTemplate, (template, index) => {
  const id = index + 1;
  const sql = sqls[Math.floor(Math.random() * sqls.length)];
  const script = scripts[sql];
  return {
    ...template,
    id,
    sql,
    script: script.toString(),
    name: `报表${id}`,
    where: renderTemplate(3, {}, (templateSub, indexSub) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const idSub = indexSub + 1;
      return {       
        type,
        key: `key${idSub}`,
        label: `搜索项${idSub}`,
        datas: type === 'input' ? `默认输入${idSub}...` : getValues(3),
        value: null,
      }
    }),
  }
});



export default {
  getNotice,
  getActivities,
  getFakeList,
};
