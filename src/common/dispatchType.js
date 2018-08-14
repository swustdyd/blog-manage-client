const dispatchType = {
    Article: {
        SearchArticle: 'article/searchArticle',
        SaveOrUpdateArticle: 'article/saveOrUpdateArticle',
        DeleteArticle: 'article/deleteArticle',
    },
    Tag: {
        SaveOrUpdateTag: 'tag/saveOrUpdateTag',
        DeleteTag: 'tag/deleteTag',
    },
    User: {
        SaveOrUpdateTag: 'user/saveOrUpdateTag',
        DeleteUser: 'user/deleteUser',
    },
    Role: {
        SaveOrUpdateRol: 'role/saveOrUpdateRole',
        DeleteRole: 'role/deleteRole',
    },
}

export default dispatchType;