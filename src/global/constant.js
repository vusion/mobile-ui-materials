export const CLOGIN_KEY = 'clogin';

export const NUIMS_DOMAIN_NAME = 'Nuims';

export const LOGIN_TYPES_MAP = {
    Normal: '普通',
    QZ: '轻舟',
    Ldap: 'LDAP',
    Wechat: '微信',
    Baidu: '百度',
    Github: 'Github',
    Netease: 'OpenID',
    Urs: 'Urs',
};

export const TAB_MAP = {
    Normal: `${LOGIN_TYPES_MAP.Normal}登录`,
    QZ: LOGIN_TYPES_MAP.QZ,
    Ldap: LOGIN_TYPES_MAP.Ldap,
};

export const AUTH_MAP = {
    Wechat: `${LOGIN_TYPES_MAP.Wechat}登录`,
    Github: `${LOGIN_TYPES_MAP.Github} 登录`,
    Netease: `${LOGIN_TYPES_MAP.Netease} 登录`,
    Urs: `${LOGIN_TYPES_MAP.Urs} 登录`,
};

export const BASIC_LIST = ['Normal', 'QZ', 'Urs'];

export const NO_AUTH_LIST = [...BASIC_LIST, 'Ldap'];

export const API_VERSION = '2020-06-01';
