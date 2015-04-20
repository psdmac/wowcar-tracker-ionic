angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $rootScope) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.getDevice = function() {
    var localStorage = window.localStorage;
    var deviceInfo = localStorage.getItem('deviceInfo');
    if (!deviceInfo) {
      $location.path('/app/setting');
    } else {
      $rootScope.deviceInfo = angular.fromJson(deviceInfo);
    }
  }
  $scope.getDevice();
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('SettingCtrl', ['$scope','$http','$rootScope', function($scope, $http, $rootScope){
  $scope.lists = [];
  
  $http.get('https://towing.firebaseio.com/devices.json')
  .then(function(res) {
    console.log(res.data);
    angular.forEach(res.data, function(value) {
      $scope.lists.push(value);
    });
  })
  $scope.change = function(info) {
    console.log(info);
    var localStorage = window.localStorage;
    localStorage.setItem('deviceInfo', angular.toJson(info))
    $rootScope.deviceInfo = info;
  }
  $scope.init = function() {
    console.log('init');
    $scope.car = {};
    var localStorage = window.localStorage;
    var deviceInfo = localStorage.getItem('deviceInfo');
    
    if (!deviceInfo) {
      $scope.car = {};
    } else {
      $scope.car = {};
      $scope.car.info = angular.fromJson(deviceInfo);
      $scope.deviceInfo = $scope.car.info;
    }
  }
  $scope.init();
}])


.directive('markerSave', ['$http', '$timeout','$rootScope', function($http, $timeout, $rootScope){
  return {
    link: function($scope, iElm, iAttrs, controller) {
      $timeout(function() {
        app.initialize();
        console.log('initialize...');
      }, 0);
      console.log('directive');
      $scope.setCenter = function(location) {
        if ($scope.followCenter) {
          app.map.panTo(new google.maps.LatLng(location.latitude, location.longitude));
        }
      }
      $scope.lastTimeStamp = 0;
      $scope.savePosition = function(location) {
        console.log(JSON.stringify(location));
        $scope.setCenter(location);
        var data = {
        datapoints:
          [{
            dataChnId: "tracker_wowcar_id", 
            timestamp: new Date().getTime(),
            values: {
              latitude: location.latitude, 
              longitude: location.longitude, 
              altitude: location.altitude
            }
          }]
        };
        if ((data.datapoints[0].timestamp - $scope.lastTimeStamp) >= 5000) {
          $scope.lastTimeStamp = data.datapoints[0].timestamp;
          if (!$rootScope.deviceInfo) {

          } else {
            console.log($rootScope.deviceInfo.key);
            console.log($rootScope.deviceInfo.id);
            $http.defaults.headers.common['deviceKey'] = $rootScope.deviceInfo.key  
            $http.post('https://api.mediatek.com/mcs/v2/devices/'+ $rootScope.deviceInfo.id +'/datapoints',data)
            .success(function(data){
            // your content ...
              console.log(JSON.stringify(data));
            })
            .error(function(data){
            // your content ...  
              console.log(JSON.stringify(data))
            });
          }
        }
      }
    }
  };
}]);
