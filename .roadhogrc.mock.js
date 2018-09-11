// import mockjs from 'mockjs';
import {
  getCharts,
  getChartDatas,
} from './mock/chart';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  'GET /api/searchCharts': {
    $desc: '获取报表列表',
    $params: {
      offset: {
        desc: '分页起始位置',
        exp: 0
      },
      pageSize: {
        desc: '分页大小',
        exp: 10
      },
      name: {
        desc: '报表名称'
      },
      createAt: {
        desc: '报表创建时间 YYYY-MM-DD HH:mm:ss',
        exp: '2018-09-11 14:53:12'
      }
    },    
    $body: (req, res) => {
      res.send({
        ok: true,
        result: {
          list: getCharts
        },
      });
    }
  },
  'POST /api/saveOrUpdateChart': {
    $desc: '保存或者修改报表',
    $params: {
      chart: {
        desc: '提交的报表设置数据',
        exp: {
          name: '报表名称',
          sql: '报表SQL',
          script: '报表Script',
          where: [
            {
              type: 'rangePicker',
              key: 'rangePick',
              label: '选择时间',
            },
            {
              type: 'select',
              key: 'groupSelect',
              label: '选择次集团',
              datas: [
                {
                  value: 1,
                  label: 'A次集团',
                },
                {
                  value: 2,
                  label: 'B次集团',
                },
                {
                  value: 3,
                  label: 'C次集团',
                },
              ],
            },
          ]
        }
      }
    },
    $body: (req, res) => {
      const { chart } = req.body;
      chart.id = 1;
      res.send({
        ok: chart ? true : false,
        message: chart ? '保存成功' : '保存失败',
        result: chart,
      });
    },
  },
  'GET /api/getChartDatas': {
    $desc: '获取报表详情',
    $params: {
      name: {
        desc: '报表对应的脚本名称'
      }
    },
    $body: (req, res) => {
      const { sql } = req.query;
      res.send({
        ok: getChartDatas[sql] ? true : false,
        message: getChartDatas[sql] ? '' : '不存在该类型数据',
        result: {
          list: getChartDatas[sql],
        },
      });
    },
  }
};

export default (noProxy ? {} : format(proxy));
