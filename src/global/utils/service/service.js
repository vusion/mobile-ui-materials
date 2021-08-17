import { isObj } from '@/global/utils/utils';

export default (request) => {
    return (api, mainRequestInfo = {}) => {
        let serviceMap = {};
        if (isObj(api)) {
            serviceMap = Object.keys(api).reduce((pre, cur) => {
                const requestInfo = api[cur];
                pre[cur] = (params = {}) => {
                    const { method = 'get' } = requestInfo;
                    const lowerMethod = String(method).toLowerCase();
                    const reqInfoList = ['config', 'headers'];
                    reqInfoList.forEach((ri) => {
                        if (params[ri]) {
                            requestInfo[ri] = { ...params[ri] };
                            delete params[ri];
                        }
                    });
                    // 特殊处理 get/post，可不用输入 query/body
                    if (params.query || params.body) {
                        return request({ ...requestInfo, ...mainRequestInfo, ...params });
                    } else if (lowerMethod === 'get') {
                        return request({ ...requestInfo, ...mainRequestInfo, query: { ...params } });
                    } else if (lowerMethod === 'post') {
                        return request({ ...requestInfo, ...mainRequestInfo, body: { ...params } });
                    } else {
                        return request({ ...requestInfo, ...mainRequestInfo, ...params });
                    }
                };
                return pre;
            }, {});
        } else {
            throw new Error('api 格式有误！');
        }
        return serviceMap;
    };
};
