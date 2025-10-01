import request from "@/utils/request";
export default {
  getTopicList() {
    return request({
      url: `/topic/list`,
      method: "GET",
    });
  },
  fuzzyQueryTopic(topicDto) {
    return request({
      url: `/topic/selectsome`,
      method: "POST",
      data: {
        keyWord: topicDto.keyWord,
        startTime: topicDto.startTime,
        endTime: topicDto.endTime,
        tagId: topicDto.tagId,
        isVideo: topicDto.isVideo,
      },
    });
  },
  delTopicById(tid) {
    return request({
      url: `/topic/${tid}`,
      method: "DELETE",
    });
  },
  getTopicDetail(id) {
    return request({
      url: `/topic/detail/${id}`,
      method: "GET",
    });
  },
  isTop(id,top) {
    return request({
      url: `/topic/isTop/${id}/${top}`,
      method: "GET",
    });
  },
};
