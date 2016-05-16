angular.module('starter.services_user', [])

.factory('user_data', function() {
  var user = {};
  return {
    getData: function() {
      return user;
    },
    Update: function(data) {
      user = data;
      console.log(user);
    }
  };
});
