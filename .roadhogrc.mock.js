import mockjs from 'mockjs';
import {
  getCharts,
  getChartDatas,
} from './mock/chart';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
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
  'GET /api/getChartDatas': (req, res) => {
    const { sql } = req.query;
    res.send({
      ok: getChartDatas[sql] ? true : false,
      message: getChartDatas[sql] ? '' : '不存在该类型数据',
      result: {
        list: getChartDatas[sql],
      },
    });
  },
};

export default (noProxy ? {} : delay(proxy, 10));
