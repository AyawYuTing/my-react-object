# 在 Ant Design Pro 中，一个完整的前端 UI 交互到服务端处理流程是这样的：

- 1、UI 组件交互操作；
- 2、调用 model 的 effect；
- 3、调用统一管理的 service 请求函数；
- 4、使用封装的 request.ts 发送请求；
- 5、获取服务端返回；
- 6、然后调用 reducer 改变 state；
- 7、更新 model。


