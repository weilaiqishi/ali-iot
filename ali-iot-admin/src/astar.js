function AStar(map2d, startPoint, endPoint) {
  // passTag的可行走标记（若地图数据!=passTag即为障碍）
  let tag = 1;

  let Node = function(point, endPoint, g) {
    //描述AStar中的节点
    let tG = g || 0;
    return {
      point: point, //节点的坐标
      father: null, //父节点
      g: tG, //G值，g值在用到的时候会重新算
      h: (Math.abs(endPoint.x - point.x) + Math.abs(endPoint.y - point.y)) * 10, //计算H值
    };
  };

  return {
    map2d: map2d,
    startPoint: startPoint,
    endPoint: endPoint,
    passTag: tag,
    openList: [], //开启表
    closeList: [], //关闭表

    //获得openList中F值最小的节点
    getMinNode: function() {
      let currentNode = this.openList[0];
      for (let node of this.openList) {
        if (node.g + node.h < currentNode.g + currentNode.h) currentNode = node;
      }
      return currentNode;
    },

    //判断point是否在关闭表中
    pointInCloseList: function(point) {
      for (let node of this.closeList) {
        if (node.point.eq(point)) return true;
      }
      return false;
    },

    //判断point是否在开启表中
    pointInOpenList: function(point) {
      for (let node of this.openList) {
        if (node.point.eq(point)) return node;
      }
      return null;
    },

    //判断终点是否在关闭表中
    endPointInCloseList: function() {
      for (let node of this.closeList) {
        if (node.point.eq(this.endPoint)) return node;
      }
      return null;
    },
    //搜索节点周围的点
    searchNear: function(minF, offsetX, offsetY) {
      //越界检测
      if (
        minF.point.x + offsetX < 0 ||
        minF.point.x + offsetX > this.map2d.w - 1 ||
        minF.point.y + offsetY < 0 ||
        minF.point.y + offsetY > this.map2d.h - 1
      )
        return null;
      //如果是障碍就忽略
      if (
        this.map2d.data[minF.point.x + offsetX][minF.point.y + offsetY] !==
        this.passTag
      )
        return null;
      //如果在关闭表中就忽略
      let currentPoint = Point(minF.point.x + offsetX, minF.point.y + offsetY);
      if (this.pointInCloseList(currentPoint)) return null;
      //设置单位花费
      let step = 0;
      if (offsetX === 0 || offsetY === 0) step = 10;
      else step = 14;
      //如果不在openList中，就把它加入openList
      let currentNode = this.pointInOpenList(currentPoint);
      if (currentNode == null) {
        currentNode = Node(currentPoint, this.endPoint, minF.g + step);
        currentNode.father = minF;
        this.openList.push(currentNode);
        return null;
      }
      //如果在openList中，判断minF到当前点的G是否更小
      if (minF.g + step < currentNode.g) {
        currentNode.g = minF + step;
        currentNode.father = minF;
      }
    },

    //开始寻路
    start: function() {
      //1.将起点放入开启列表
      let startNode = Node(this.startPoint, this.endPoint);
      this.openList.push(startNode);
      //2.主循环逻辑
      while (true) {
        //找到F值最小的节点
        let minF = this.getMinNode();
        //把这个点加入closeList中，并且在openList中删除它
        this.closeList.push(minF);
        let index = this.openList.indexOf(minF);
        this.openList.splice(index, 1);
        //搜索这个节点的上下左右节点
        this.searchNear(minF, 0, -1);
        this.searchNear(minF, 0, 1);
        this.searchNear(minF, -1, 0);
        this.searchNear(minF, 1, 0);
        // 判断是否终止
        let point = this.endPointInCloseList();
        if (point) {
          //如果终点在关闭表中，就返回结果
          let cPoint = point;
          let pathList = [];
          while (true) {
            if (cPoint.father) {
              pathList.push(cPoint.point);
              cPoint = cPoint.father;
            } else {
              return pathList.reverse();
            }
          }
        }
        //开启表为空
        if (this.openList.length === 0) return null;
      }
    },
  };
}

function mapInit(w, h) {
  // 二维数组
  // 参数num用来生成全是num的数组
  let data = [];
  let default_num = 0;
  for (let x = 0; x < w; x++) {
    let temp = [];
    for (let y = 0; y < h; y++) {
      temp.push(default_num);
    }
    data.push(temp);
  }
  return {
    w: w,
    h: h,
    data: data
  };
}

function Point(x, y) {
  //点
  return {
    x: x,
    y: y,
    // 用于判断点是否在某表中
    eq: function(other) {
      return this.x === other.x && this.y === other.y;
    },
  };
}

export default {
  AStar,
  mapInit,
  Point
};
