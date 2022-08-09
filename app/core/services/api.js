export default ($http) => {
  const service = {
    list: () => {
      const promise = $http({
        method: 'get',
        url: '/api/stuff/',
      });

      return promise;
    },
  };

  return service;
};
