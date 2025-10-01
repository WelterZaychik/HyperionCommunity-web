import request from "@/utils/request";
export default {
  getUserList() {
    return request({
      url: `/user/list`,
      method: "GET",
    });
  },
  userLogin(account, password) {
    return request({
      url: `/user/login`,
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        account: account,
      },
      data: {
        account: account,
        password: password,
      },
    });
  },
  userLogout(account) {
    return request({
      url: `/user/logout/${account}`,
      method: "GET",
    });
  },
  userRegister(user) {
    return request({
      url: `/user/add`,
      method: "post",
      data: {
        account: user.account,
        password: user.password,
        name: user.name,
        email: user.email,
        synopsis:user.synopsis
      },
    });
  },
  editUserInfo(userObj) {
    return request({
      url: `/user/revise`,
      method: "PUT",
      data: {
        account: userObj.account,
        avatar: userObj.avatar,
        email: userObj.email,
        id: userObj.id,
        name: userObj.name,
        password: userObj.password,
        phone: userObj.phone,
        synopsis: userObj.synopsis,
      },
    });
  },
  fuzzySerch(userObj){
    return request({
      url:`/user/selectSome`,
      method:"POST",
      data:{
        keyWord:userObj.keyword,
        contact:userObj.contact,
        createTime:userObj.createTime
      }
    })
  },
  deleteUserById(id){
    return request({
      url:`/user/${id}`,
      method:"DELETE"
    })
  },
  getUserById(id){
    return request({
      url:`/user/${id}`,
      method:"GET"
    })
  }
};
