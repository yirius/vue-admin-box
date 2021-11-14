import { MockMethod } from 'vite-plugin-mock'
const users = [
  { name: 'admin', password: '123456', token: 'admin', info: {
    username: '系统管理员'
  }},
  { name: 'editor', password: '123456', token: 'editor', info: {
      username: '编辑人员'
  }},
  { name: 'test', password: '123456', token: 'test', info: {
      username: '测试人员'
  }},
]
export default [
  {
    url: `/mock/user/login`,
    method: 'post',
    response: ({ body }) => {
      const user = users.find(user => {
        return body.name === user.name && body.password === user.password
      })
      if (user) {
        return {
          code: 1,
          data: {
            id: 1,
            username: "231",
            'Access-Token': user.token,
          },
        };
      } else {
        return {
          code: 0,
          data: {},
          msg: '用户名或密码错误'
        };
      }
      
    }
  },
  {
    url: `/mock/user/info`,
    method: 'post',
    response: ({ body }) => {
      const { token } = body
      const info = users.find(user => {
        return user.token === token
      }).info
      if (info) {
        return {
          code: 1,
          data: info,
        };
      } else {
        return {
          code: 0,
          data: {},
          msg: '无访问权限'
        };
      }
      
    }
  },
  {
    url: `/mock/user/out`,
    method: 'post',
    response: () => {
      return {
        code: 1,
        data: {},
        msg: 'success'
      };
    }
  },
  {
    url: `/mock/user/passwordChange`,
    method: 'post',
    response: () => {
      return {
        code: 1,
        data: {},
        msg: 'success'
      };
    }
  },
] as MockMethod[]