import service from '@/global/utils/service';

const api = {
  Login: {
    method: 'POST',
    Action: 'Login',
  },
  GetTenantLoginTypes: {
    method: 'GET',
    Action: 'GetTenantLoginTypes',
  },
};

export default service(api);
