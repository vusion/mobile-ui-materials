import { Notify } from 'vant';
export default {
  defaults({ config }, err) {
    Notify({ type: 'danger', message: err.message || err.msg || '系统繁忙' });
  },
  500({ config }, err = {}) {
    Notify({ type: 'danger', message: err.message || err.msg || '服务器内部处理出现未知错误' });
  },
  400({ config }, err = {}) {
    Notify({ type: 'danger', message: err.message || err.msg || '参数错误' });
  },
  localError(config, err) {
    Notify({ type: 'danger', message: err.message || err.msg || '客户端错误' });
  },
};
