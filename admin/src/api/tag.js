import request from "@/utils/request";
export default {
  getTagList() {
    return request({
      url: `/tag`,
      method: "GET",
    });
  },
  searchTag(keyword) {
    return request({
      url: `/tag/${keyword}`,
      method: "GET",
    });
  },
  addTag(content) {
    return request({
      url: `/tag`,
      method: "POST",
      data: {
        content:content
      },
    });
  },
  delTag(id) {
    return request({
      url: `/tag/${id}`,
      method: "DELETE",
    });
  },
};
