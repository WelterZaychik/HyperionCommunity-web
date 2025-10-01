import request from "@/utils/request";

export default {
  getResourceList(id) {
    return request({
      url: `/resource/getResource/${id}`,
      method: "get",
    });
  },
  getAllResourceTag(id) {
    return request({
      url: `/resource/getAllResourceTag`,
      method: "get",
    });
  },
};
