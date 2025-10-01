import request from "@/utils/request";

// 查询分类列表
export default {
  getVideoPath(videoId) {
    return request({
      url: `/upload/getVideoPath/${videoId}`,
      method: "GET",
    });
  },
};
