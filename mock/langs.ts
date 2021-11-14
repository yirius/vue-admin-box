export default [
  {
    url: `/mock/langs`,
    method: 'post',
    response: ({ body }) => {
      return {
        code: 1,
        data: {
          'zh-cn': {
            system: {
              title: "Thinker Admin Box"
            }
          },
          'en': {
            system: {
              title: "Thinker Admin Box"
            }
          }
        },
        msg: ''
      };
    }
  },
]