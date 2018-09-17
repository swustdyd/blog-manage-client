import { HOST, PORT } from '../../config';

export const Urls = {
  GET_CURRENT_USER: 'fetchCurrent',
  SEARCH_USERS: 'searchUsers',
  SAVE_OR_UPDATE_USER: 'saveOrUpdateUser',
  LOGIN: 'login',
  REGISTER: 'register',
  SEARCH_ARTICLES: 'searchArticle',
  SAVE_OR_UPDATE_ARTICLE: 'saveOrUpdateArticle',
  SEARCH_TAGS: 'searchTags',
  SAVE_OR_UPDATE_TAG: 'saveOrUpdateTag',
  SEARCH_ROLES: 'searchRoles',
  SAVE_OR_UPDATE_ROLE: 'saveOrUpdateRole',
  SEARCH_CHARTS: {
    path: '/api/searchCharts',
    unRebuild: true,
  },
  GET_CHART_DATAS: {
    path: '/api/getChartDatas',
    unRebuild: true,
  },
  SAVE_OR_UPDATE_CHART: {
    path: '/api/saveOrUpdateChart',
    unRebuild: true,
  },
  SEARCH_MENUS: 'searchMenus',
  GET_ALL_MENUS: 'getAllMenus',
  SAVE_OR_UPDATE_MENU: 'saveOrUpdateMenu',
  GET_ALL_ROUTES: 'getAllApis',
  SEARCH_ROUTES: 'searchRoutes',
  QUERY_NOTICES: {
    path: '/api/queryNotices',
    unRebuild: true,
  },
};

for (const key in Urls) {
  if (Object.hasOwnProperty.call(Urls, key)) {
    const url = Urls[key];
    if (url.unRebuild) {
      Urls[key] = Urls[key].path;
    } else {
      Urls[key] = `${HOST}:${PORT}/${url}`;
    }
  }
}
