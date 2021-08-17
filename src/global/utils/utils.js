import { stringify } from 'qs';

export function isType(type) {
    return function (obj) {
        return (
            obj !== null
            && (Array.isArray(type) ? type : [type]).some(
                (t) => Object.prototype.toString.call(obj) === `[object ${t}]`,
            )
        );
    };
}

export const isObj = isType('Object');

export const getObj = (obj) => (isObj(obj) ? obj : {});

export const getArr = (arr) => (Array.isArray(arr) ? arr : []);

export const translateDataToTree = (
    data,
    parentValue = undefined,
    parentKey,
    itemKey,
) => {
    const tree = [];
    let temp;
    data.forEach((item) => {
        if (item[parentKey] === parentValue) {
            temp = translateDataToTree(data, item[itemKey], parentKey, itemKey);
            if (temp.length > 0) {
                item.children = temp;
            }
            tree.push(item);
        }
    });
    return tree;
};

export const getConfig = (key, defaultValue = null) => {
    const config = window.__CONFIG__ || {};
    if (!key)
        return config;
    return config[key] === undefined ? defaultValue : config[key];
};

export const setConfig = (config = {}) => {
    window.__CONFIG__ = config;
}

export const getTenant = () => {
    const hostArr = location.host.split('.');
    const len = hostArr.length;
    return len > 3
        ? hostArr[0]
        : 'defaultTenant'; // 默认租户配置为 defaultTenant
};

export const getUrsLoginHref = (referrer) => {
    const { protocol, origin, host } = location;
    const hostArr = host.split('.');
    const len = hostArr.length;
    const ursOrigin = len < 3
        ? `console.${host}`
        : `console.${hostArr[len - 3]}.${hostArr[len - 2]}.${hostArr[len - 1]}`;
    const ursLoginHref = `${protocol}//${ursOrigin}/login`;

    const defaultReferrer = `${origin}/cbs`;
    return `${ursLoginHref}?referrer=${encodeURIComponent(referrer || defaultReferrer)}`;
};

export const isPromise = (func) => {
    return func && typeof func.then === 'function';
};

export const formatContentType = (contentType, data) => {
    const map = {
        'application/x-www-form-urlencoded'(data) {
            return stringify(data);
        },
    };
    return (map[contentType] && map[contentType](data)) || data;
};
