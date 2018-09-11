export function treeMenusToTree(menus, basePath = ''){
  const tree = [];
  menus.forEach(menu => {
    const node = {
      ...menu,
      title: menu.name,
      key: `${basePath ? `${basePath}/` : ''}${menu.path}`,
      value: `${menu.id}`,
    };
    if (menu.children && menu.children.length > 0) {
      node.children = treeMenusToTree(menu.children, menu.path);
    }
    tree.push(node);
  });
  return tree;
};

export function selectedTreeToTreeMenus(tree){
  const menus = [];
  tree.forEach(node => {
    const paths = node.key.split('/');
    if (node.children && node.children.length > 0) {
      const childrenMenus = selectedTreeToTreeMenus(node.children);
      if (childrenMenus.length > 0) {
        const menu = {
          ...node,
          name: node.title,
          path: paths[paths.length - 1],
          children: childrenMenus,
        };
        menus.push(menu);
      }
    } else if (node.selected) {
      menus.push({
        ...node,
        name: node.title,
        path: paths[paths.length - 1],
      });
    }
  });
  return menus;
};

export function getCheckedKeyFromTreeMenus(menus = [], basePath){
  const checkedKeys = [];
  menus.forEach(menu => {
    if (menu.children && menu.children.length > 0) {
      checkedKeys.push(...getCheckedKeyFromTreeMenus(menu.children, menu.path));
    } else {
      checkedKeys.push(`${basePath ? `${basePath}/` : ''}${menu.path}`);
    }
  });
  return checkedKeys;
};

export function createTreeMenusfromFlatMenus(flatMenus = [], rootMenuParentId = 0){
  const treeMenus = [];
  let childrenMenus = flatMenus.filter(item => {
    return item.parentMenu === rootMenuParentId
  })
  childrenMenus = childrenMenus.sort((a, b) => a.orderNo > b.orderNo )
  childrenMenus.forEach( menu => {
    const children = createTreeMenusfromFlatMenus(flatMenus, menu.id);
    const newMenu = {
      ...menu,
      children,
    }
    treeMenus.push(newMenu)
  })
  return treeMenus;
}

export function createFlatMenusFromTreeMenus(treeMenus = []){
  const flatMenus = [];
  treeMenus.forEach((menu, index) => {
    flatMenus.push({
      ...menu,
      orderNo: index,
    });
    if(menu.children && menu.children.length > 0){
      flatMenus.push(...createFlatMenusFromTreeMenus(menu.children));
    }
  })
  return flatMenus;
}

export function selectedTreeToFlatMenus(tree){
  const menus = [];
  tree.forEach(node => {
    const paths = node.key.split('/');
    if (node.children && node.children.length > 0) {
      const childrenMenus = selectedTreeToFlatMenus(node.children);
      if (childrenMenus.length > 0) {
        const menu = {
          ...node,
          name: node.title,
          path: paths[paths.length - 1],
        };
        menus.push(menu);
        menus.push(...childrenMenus);
      }
    } else if (node.selected) {
      menus.push({
        ...node,
        name: node.title,
        path: paths[paths.length - 1],
      });
    }
  });
  return menus;
};