import axios from 'axios';
import { isPromise, formatContentType } from '@/global/utils/utils';
import { API_VERSION } from '@/global/constant';
import token from '@/global/utils/storage/token';
import errHandles from './errHandles';
import service from './service';

export const request = function (requestInfo) {
    const {
        path = '/nuims',
        method = 'get',
        baseURL = '',
        body = {},
        headers = {},
        query = {},
        config = {},
        Action = '',
        Version = API_VERSION,
    } = requestInfo;

    if (baseURL && !baseURL.startsWith('http')) {
        throw new Error('set baseURL only support cross domain');
    }

    // 非登录接口注入 token
    const Authorization = token.get();
    if (Action !== 'Login' && Authorization) {
        headers.Authorization = Authorization;
    }

    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    const req = axios({
        params: { Action, Version, ...query },
        baseURL,
        method,
        url: path,
        data: formatContentType(headers['Content-Type'], body),
        headers,
        withCredentials: !baseURL,
    });
    return req
        .then((res = {}) => {
            const { data = {}, status, headers = {} } = res || {};
            if ((status + '').startsWith('2')) {
                const { Authorization, authorization } = headers;
                if (Authorization || authorization) {
                    token.set(Authorization || authorization);
                }

                return data;
            }
            return Promise.reject({
                status,
                message: data.Message,
            });
        })
        .catch((err) => {
            let handleOut;

            if (err.request) {
                const { responseText, status } = err.request;
                let message;
                try {
                    message = JSON.parse(responseText).Message;
                } catch (error) {
                    message = responseText;
                }
                err = {
                    status,
                    message,
                };
                // 统一处理 token 失效
                if (String(status) === '403' && message === 'Token is invalid') {
                    location.href = '/login';
                    throw err;
                }
            }

            if (!config.noAlert) {
                if (err.status) {
                    const handle = errHandles[err.status] || errHandles.defaults;

                    handleOut = handle.bind(this)(
                        {
                            config,
                            baseURL,
                            url: path,
                            method,
                            body,
                            headers,
                        },
                        err,
                    );
                } else if (err.status === undefined && !config.noLocalError) {
                    handleOut = errHandles.localError.bind(this)(err);
                }

                if (isPromise(handleOut))
                    return handleOut;
            }

            throw err;
        });
};

export default service(request);
