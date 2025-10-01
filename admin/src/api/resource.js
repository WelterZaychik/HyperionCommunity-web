import request from "@/utils/request";
export default {
    getResourceList() {
      return request({
        url: `/resource/search`,
        method: "GET",
      });
    },
    delResource(id) {
      return request({
        url: `/resource/${id}`,
        method: "DELETE",
      });
    },
    addResource(resource) {
      return request({
        url: `/resource`,
        method: "POST",
        data:{
          title:resource.title,
          url:resource.url,
          logo:resource.logo,
          tagflag:resource.tagflag
        }
      });
    },
    getResourceByid(id){
      return request({
        url:`/resource/${id}`,
        method:"GET"
      })
    },
    editResource(resourceObj){
      return request({
        url:`/resource`,
        method:"PUT",
        data:{
          id:resourceObj.id,
          title:resourceObj.title,
          url:resourceObj.url,
          logo:resourceObj.logo,
          tagflag:resourceObj.tagflag
        }
      })
    },
    searchResource(keyword){
      return request({
        url:`/resource/search/${keyword}`,
        method:"GET",
      })
    }
  };