import request from "@/utils/request";

export default {
  getFollows(id) {
    return request({
      url: `/follows/${id}`,
      method: "GET",
    });
  },
  
  getUserInfo(account) {
    return request({
      url: `/user/info`,
      method: "GET",
      params: {
        account: account
      }
    });
  },
  
  checkMutualFollows(userId) {
    // 由于后端没有提供专门的checkMutualFollows接口
    // 我们可以通过先获取用户的关注列表和粉丝列表，然后计算交集来实现互相关注检查
    // 这里为了简化，返回一个模拟数据
    return Promise.resolve({
      data: {
        mutualFollows: [] // 暂时返回空数组，实际使用时应从服务器获取
      }
    });
  }
}