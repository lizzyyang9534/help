angular.module('starter.controllers', [])

.constant('serverIP', '')

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.value('mapp', 'yoyoimmappoutside')

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $http, $state, $ionicHistory, $localstorage, API, ionicMaterialInk, mapp, $compile) {
  //mapp='yoyoimmapp';
  console.log(mapp);
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  //api server ip
  if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
    serverIP = API.client;
  } else {
    serverIP = API.local;
  }
  /*if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(pos) {
    catchpos = pos.coords.latitude + "," + pos.coords.longitude;
    console.log("HIHIHIhere");
  }, function(error) {
    alert('Unable to catch location: ' + error.message);
  });
}*/
  // Create the modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal1 = modal;
  });

  $ionicModal.fromTemplateUrl('templates/forgetPassword.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;
  });

  $ionicModal.fromTemplateUrl('templates/editmember.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal5 = modal;
  });

  $ionicModal.fromTemplateUrl('templates/incident.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal3 = modal;
  });

  $ionicModal.fromTemplateUrl('templates/help.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal4 = modal;
  });
  $ionicModal.fromTemplateUrl('templates/notificate.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal6 = modal;
  });

  // Triggered in the modal to close it
  $scope.closeRegister = function() {
    $scope.modal1.hide();
  };
  $scope.closeForget = function() {
    $scope.modal2.hide();
  };
  $scope.closeEditMember = function() {
    $scope.modal5.hide();
  };
  $scope.closeIncident = function() {
    $scope.modal3.hide();
  };
  $scope.closeHelp = function() {
    $scope.modal4.hide();
  };
  $scope.closeNotificate = function() {
    $scope.modal6.hide();
  };

  // Open the modal
  $scope.register = function() {
    $scope.modal1.show();
  };
  $scope.forgetPassword = function() {
    $scope.modal2.show();
  };
  $scope.editMember = function() {
    $scope.modal5.show();
  };
  $scope.notificate = function() {
    $scope.modal6.show();
  };
  $scope.incident = function() {
    var incident_data = $localstorage.getObject('incident_data');
    var helpers = [];
    var helpers_list = [];
    var incident_number = $("#" + event.currentTarget.id + " span").text();
    //console.log(incident_number);

    $scope.incident.number = incident_data[incident_number].number;
    $scope.incident.title = incident_data[incident_number].title;
    $scope.incident.helper = incident_data[incident_number].helper;
    $scope.incident.level = incident_data[incident_number].level;
    $scope.incident.category = incident_data[incident_number].category;
    $scope.incident.date = incident_data[incident_number].date;
    $scope.incident.illust = incident_data[incident_number].illust;
    $scope.incident.status = incident_data[incident_number].status;
    $scope.incident.rating = incident_data[incident_number].rating;
    helpers = incident_data[incident_number].helpers;

    for (i = 0; i < helpers.length; i++) {
      var helper = {};
      helper.text = helpers[i];
      helper.value = helpers[i];
      //console.log(helper);
      helpers_list.push(helper);
    }
    $scope.helpers_list = helpers_list;
    $scope.data = {
      choice: ''
    };

    $scope.modal3.show();
  };
  $scope.help = function(help_number) {
    var help_data = $localstorage.getObject('help_data');
    var help_number = $("#" + event.currentTarget.id + " span").text();
    //console.log(help_data[help_number]);

    $scope.help.number = help_data[help_number].number;
    $scope.help.title = help_data[help_number].title;
    $scope.help.ID = help_data[help_number].ID;
    $scope.help.level = help_data[help_number].level;
    $scope.help.category = help_data[help_number].category;
    $scope.help.date = help_data[help_number].date;
    $scope.help.illust = help_data[help_number].illust;
    $scope.help.status = help_data[help_number].status;
    $scope.help.rating = help_data[help_number].rating;

    $scope.modal4.show();
  };

  // Form data for the login modal
  $scope.loginData = {};
  $scope.user_view = $localstorage.getObject('user_data');

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(login_form) {
      // 通過驗證
      console.log(serverIP);
      if (login_form.$valid) {
        $http.post(serverIP + "/api/login.php", {
            'account': $scope.loginData.username,
            'password': $scope.loginData.password
          })
          .success(function(data, status, headers, config) {
            //console.log('Doing login', $scope.loginData);
            //console.log(data);
            $scope.user = data;

            if (data == "error") {
              $ionicPopup.alert({
                title: "無法登入",
                template: "帳號或密碼錯誤！"
              });
            } else if ($scope.user.result == "login") {
              $localstorage.setObject('user_data', {
                account: $scope.user.account,
                password: $scope.user.password,
                name: $scope.user.name,
                cellphone: $scope.user.cellphone,
                email: $scope.user.email,
                //location: $scope.user.location,
                contact_name: $scope.user.contact_name,
                contact_cel: $scope.user.contact_cel,
                points: $scope.user.points
              });

              //console.log($localstorage.get('user_data'));
              /*$ionicPopup.alert({
                title: "登入成功"
              });*/

              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $state.go("app.home");
            }
          });
      } else {
        // 未通過驗證
        $ionicPopup.alert({
          title: "請輸入帳號及密碼！"
        });
      }
    }
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system

  $scope.home = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go("app.home");
  }

  $scope.logout = function() {
    $state.go("app.logout");
  }

  ionicMaterialInk.displayEffect();
})

.controller('HomeCtrl', function($scope, $ionicHistory, $state, ionicMaterialInk, $localstorage, $ionicPopup, $timeout, $ionicPlatform, $location) {
  var check_login = $localstorage.getObject('user_data');
  if (check_login.account == null) {
    //console.log("haven't login");
    $state.go("app.login");
  }

  $ionicHistory.clearHistory();
  /*
    $ionicPlatform.onHardwareBackButton(function() {
      if ($location.path() === "/app/home") {
        var confirmPopup = $ionicPopup.confirm({
          title: 'withU',
          template: "是否確定要離開應用程式?",
          cancelText: '取消',
          okText: '確定'
        });

        confirmPopup.then(function(res) {
          if (res) {
            console.log('You are sure');
            ionic.Platform.exitApp();
          } else
            console.log('You are not sure');
        });
      } else {
        $ionicHistory.goBack();
      }
    }, 100);
  */
  $scope.helpMe = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go("app.addincident");
  }

  $scope.doRefresh = function() {
    $timeout(function() {
      console.log("refresh");
    }, 1000)
  }

  $scope.centerOnMe = function() {


    /*if (!$scope.map) {
      console.log("set centeronme xxxxQQ")
      return;
    }*/

    $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
    $state.go("app.map");

  }

  $scope.helpOthers = function() {
    $state.go("app.map");

  }


  $scope.callMom = function() {

    window.open('tel:' + check_login.contact_cel, '_system');
  }

  ionicMaterialInk.displayEffect();
})

.controller('RegisterCtrl', function($scope, $ionicPopup, $http, ionicMaterialInk) {
  $scope.insertdata = function() {
    if ($scope.register_form.$valid) {
      // 通過驗證
      $http.post(serverIP + "/api/register.php", {
          'account': $scope.account,
          'passwd': $scope.passwd,
          'name': $scope.name,
          'cel': $scope.cel,
          'email': $scope.email,
          'location': $scope.location,
          'contact_name': $scope.contact_name,
          'contact_cel': $scope.contact_cel
        })
        .success(function(data, status, headers, config) {
          //console.log(data);
          if (data == "exist") {
            $ionicPopup.alert({
              title: "註冊失敗",
              template: "已有相同的帳號！"
            });
          } else if (data == "email_exist") {
            $ionicPopup.alert({
              title: "註冊失敗",
              template: "此Email已註冊過！"
            });
          } else if (data == "register_successfully") {
            $scope.account = null;
            $scope.passwd = null;
            $scope.passwd_check = null;
            $scope.name = null;
            $scope.cel = null;
            $scope.email = null;
            $scope.location = null;
            $scope.contact_name = null;
            $scope.contact_cel = null;
            $scope.register_form.$setPristine();
            $ionicPopup.alert({
              title: "註冊成功！"
            });
            $scope.closeRegister();
          } else {
            $ionicPopup.alert({
              title: "發生錯誤！"
            });
          }
        });
    } else {
      // 未通過驗證
      $ionicPopup.alert({
        title: "請輸入完整資料！"
      });
    }
  }
  ionicMaterialInk.displayEffect();
})

.controller('ForgetPasswordCtrl', function($scope, $http, $ionicPopup, $ionicLoading, ionicMaterialInk) {
  $scope.forgetSubmit = function() {
    if ($scope.forget_form.$valid) {
      // Setup the loader
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      $http.post(serverIP + "/api/forgetPassword.php", {
          'email': $scope.email
        })
        .success(function(data, status, headers, config) {
          $ionicLoading.hide();
          if (data == "none") {
            $ionicPopup.alert({
              title: "無此Email註冊之帳號"
            });
          } else if (data == "done") {
            $scope.email = null;
            $scope.addincident_form.$setPristine();
            $ionicPopup.alert({
              title: "成功",
              template: "已發送至您的信箱，請前往確認！"
            });
          } else {
            $ionicPopup.alert({
              title: "發生錯誤"
            });
          }
        });
    } else {
      $ionicPopup.alert({
        title: "請輸入Email！"
      });
    }
  }
  ionicMaterialInk.displayEffect();
})

.controller('MemberCtrl', function($scope, $http, $ionicLoading, $state, $timeout, $localstorage, $ionicPopup, ionicMaterialInk, $ionicHistory) {
  var user_data = $localstorage.getObject('user_data');
  $scope.initialize = function() {
    var user_data = $localstorage.getObject('user_data');
    $scope.account = user_data.account;
    $scope.password = user_data.password;
    $scope.name = user_data.name;
    $scope.cellphone = user_data.cellphone;
    $scope.email = user_data.email;
    $scope.contact_name = user_data.contact_name;
    $scope.contact_cel = user_data.contact_cel;

    $scope.account_edit = user_data.account;
    $scope.passwd_edit = user_data.password;
    $scope.name_edit = user_data.name;
    $scope.cel_edit = user_data.cellphone;
    $scope.email_edit = user_data.email;
    $scope.contact_name_edit = user_data.contact_name;
    $scope.contact_cel_edit = user_data.contact_cel;
  }
  $scope.initialize();

  $scope.updateData = function() {
    if ($scope.edit_form.$valid) {
      //console.log($scope.contact_name_edit + "," + $scope.contact_cel_edit);
      // 通過驗證
      $http.post(serverIP + "/api/editMember.php", {
          'account': $scope.account_edit,
          'passwd': $scope.passwd_edit,
          'name': $scope.name_edit,
          'cel': $scope.cel_edit,
          'email': $scope.email_edit,
          'contact_name': $scope.contact_name_edit,
          'contact_cel': $scope.contact_cel_edit
        })
        .success(function(data, status, headers, config) {
          var new_user_data = data;
          console.log(new_user_data);

          $localstorage.setObject('user_data', new_user_data);
          $scope.closeEditMember();
          $scope.doRefresh();
        });
    } else {
      // 未通過驗證
      $ionicPopup.alert({
        title: "請完整輸入資料！"
      });
    }
  }

  $scope.doRefresh = function() {
    console.log('Refreshing!');
    $timeout(function() {
      $http.post(serverIP + "/api/getMemberData.php", {
          'account': user_data.account
        })
        .success(function(data, status, headers, config) {
          var new_user_data = data;
          $localstorage.setObject('user_data', new_user_data);
        })
      $scope.initialize();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }

  ionicMaterialInk.displayEffect();
})

.controller('IncidentCtrl', function($scope, $http, $ionicPopup, $state, $localstorage, ionicMaterialInk, $ionicHistory) {
  $scope.default_date = new Date();
  //$scope.default_time = new HOUR_SECOND(Date());
  //$scope.default_time = new Time();

  var catchpos = "none";
  var user_data = $localstorage.getObject('user_data');

  navigator.geolocation.getCurrentPosition(function(pos) {
    catchpos = pos.coords.latitude + "," + pos.coords.longitude;

  }, function(error) {
    alert('Unable to catch location: ' + error.message);
  });

  $scope.addincident = function() {
    if ($scope.location == 'Current') {
      console.log("current:" + catchpos);
    } else {
      catchpos = $scope.location;
      console.log("city:" + catchpos);
    }
    console.log(catchpos);
    $http.post(serverIP + "/api/addincident.php", {
        'id': user_data.account,
        'level': $scope.level,
        'category': $scope.category,
        'title': $scope.title,
        'illust': $scope.illust,
        'date': $scope.date,
        'location': catchpos
      })
      .success(function(data, status, headers, config) {
        console.log("data insert successfully " + catchpos);
        $scope.level = null;
        $scope.category = null;
        $scope.title = null;
        $scope.illust = null;
        $scope.date = null;
        $scope.location = null;
        $scope.addincident_form.$setPristine();

        $ionicPopup.alert({
          title: "新增事件成功！",
        });
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go("app.map", {}, {
          reload: true
        }); //導到正確位置
      });
  }
  ionicMaterialInk.displayEffect();
})

.controller('IncidentViewCtrl', function($scope, $http, $ionicPopup, $state, $localstorage, $window, ionicMaterialInk) {
  var user_data = $localstorage.getObject('user_data');
  $scope.rating = function(rating_option) {
    var confirmPopup = $ionicPopup.confirm({
      title: '確認評分',
      template: "確定要送出評分給您的幫助者?",
      cancelText: '取消',
      okText: '確認'
    });

    confirmPopup.then(function(res) {
      if (res) {
        console.log('You are sure');
        var num = $("#current_incident_number").text();
        var helper = $("#current_incident_helper").text();
        $http.post(serverIP + "/api/rating.php", {
            'number': num,
            'rating': rating_option,
            'helper': helper
          })
          .success(function(data, status, headers, config) {
            //console.log(data);
            user_data.points = data;
            var new_user_data = user_data;
            //$localstorage.setObject('user_data', new_user_data);

            $scope.closeIncident();
            $window.location.reload(true);
          })
      } else
        console.log('You are not sure');
    });
  }

  $scope.cancelIncident = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '取消事件',
      template: "確定要取消該事件?",
      cancelText: '否',
      okText: '是'
    });

    confirmPopup.then(function(res) {
      if (res) {
        console.log('You are sure');
        var num = $("#current_incident_number").text();
        $http.post(serverIP + "/api/cancelIncident.php", {
            'number': num
          })
          .success(function(data, status, headers, config) {
            console.log(data);

            $scope.closeIncident();
            $window.location.reload(true);
          })
      } else
        console.log('You are not sure');
    });
  }

  $scope.matchHelper = function() {
    var choice = $("#helper_choice").text();
    var confirmPopup = $ionicPopup.confirm({
      title: '與Helper配對',
      template: "確定要讓" + choice + "協助您?",
      cancelText: '否',
      okText: '是'
    });

    confirmPopup.then(function(res) {
      if (res) {
        console.log('You are sure');
        var num = $("#current_incident_number").text();
        $http.post(serverIP + "/api/matchHelper.php", {
            'number': num,
            'helper': choice
          })
          .success(function(data, status, headers, config) {
            console.log(data);

            $scope.closeIncident();
            $window.location.reload(true);
          })
      } else
        console.log('You are not sure');
    });
  }

  ionicMaterialInk.displayEffect();
})

.controller('IncidentHistoryCtrl', function($scope, $http, $compile, $localstorage, $ionicPopup, ionicMaterialInk, $timeout) {
  var user_data = $localstorage.getObject('user_data');
  var all_incident = [];
  var incidents = [];
  var incident_matching = [];
  var incident_askRating = [];
  var incident_unsolved = [];
  var incident_noHelper = [];
  var incident_solved = [];

  $scope.initialize = function() {
    $scope.current_status = "matching";
    $http.post(serverIP + "/api/IncidentHistory.php", {
        'account': user_data.account
      })
      .success(function(data, status, headers, config) {
        incident_history = data;
        //console.log(incident_history);
        incidents = [];
        incident_matching = [];
        incident_askRating = [];
        incident_unsolved = [];
        incident_noHelper = [];
        incident_solved = [];

        for (i = 0; i < incident_history.length; i++) {
          var incident = {};
          incident.number = incident_history[i].number;
          incident.title = incident_history[i].title;
          incident.illust = incident_history[i].illust;
          incident.status = incident_history[i].status;

          if (incident.status == "matching")
            incident_matching.push(incident);
          else if (incident.status == "ask rating")
            incident_askRating.push(incident);
          else if (incident.status == "unsolved")
            incident_unsolved.push(incident);
          else if (incident.status == "no helper")
            incident_noHelper.push(incident);
          else if (incident.status == "solved")
            incident_solved.push(incident);

          all_incident[incident.number] = incident_history[i];
        }
        $scope.incidents = incident_matching;
        $scope.data = {
          choice: ''
        };

        $localstorage.setObject('incident_data', all_incident);
      })
  }
  $scope.initialize();

  $scope.incidentStatus = function(incident_status) {
    var status_choice = incident_status;
    $scope.current_status = status_choice;
    //console.log(status_choice);

    if (status_choice == "matching")
      $scope.incidents = incident_matching;
    else if (status_choice == "ask rating")
      $scope.incidents = incident_askRating;
    else if (status_choice == "unsolved")
      $scope.incidents = incident_unsolved;
    else if (status_choice == "no helper")
      $scope.incidents = incident_noHelper;
    else if (status_choice == "solved")
      $scope.incidents = incident_solved;

    $("div.tabs a").removeClass("active");
    $("#" + event.currentTarget.id).addClass("active");
  }

  $scope.doRefresh = function() {
    console.log('Refreshing!');
    $timeout(function() {
      $http.post(serverIP + "/api/getMemberData.php", {
          'account': user_data.account
        })
        .success(function(data, status, headers, config) {
          var new_user_data = data;
          $localstorage.setObject('user_data', new_user_data);
        })
      $scope.initialize();
      $("div.tabs a").removeClass("active");
      $("#incident_status_matching").addClass("active");
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }
  ionicMaterialInk.displayEffect();
})

.controller('HelpViewCtrl', function($scope, $http, $ionicPopup, $state, $localstorage, $window, ionicMaterialInk) {
  $scope.solveIncident = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: '完成事件',
      template: "確定已完成該事件?",
      cancelText: '否',
      okText: '是'
    });

    confirmPopup.then(function(res) {
      if (res) {
        console.log('You are sure');
        var num = $("#current_incident_number").text();
        $http.post(serverIP + "/api/solveIncident.php", {
            'number': num
          })
          .success(function(data, status, headers, config) {
            console.log(data);

            $scope.closeIncident();
            $window.location.reload(true);
          })
      } else
        console.log('You are not sure');
    });
  }
})

.controller('HelpHistoryCtrl', function($scope, $http, $compile, $localstorage, $ionicPopup, ionicMaterialInk, $timeout) {
  var user_data = $localstorage.getObject('user_data');
  var help_list = [];
  var help_matching = [];
  var help_askRating = [];
  var help_unsolved = [];
  var help_solved = [];

  $scope.initialize = function() {
    var all_help = [];
    $scope.points = user_data.points;
    $scope.current_status = "matching";

    $http.post(serverIP + "/api/helpHistory.php", {
        'account': user_data.account
      })
      .success(function(data, status, headers, config) {
        help_history = data;
        help_list = [];
        help_matching = [];
        help_askRating = [];
        help_unsolved = [];
        help_solved = [];
        //console.log(help_history.length);

        if (help_history.length > 0) {
          for (i = 0; i < help_history.length; i++) {
            var help = {};
            help.number = help_history[i].number;
            help.title = help_history[i].title;
            help.illust = help_history[i].illust;
            help.status = help_history[i].status;

            if (help.status == "matching")
              help_matching.push(help);
            else if (help.status == "ask rating")
              help_askRating.push(help);
            else if (help.status == "unsolved")
              help_unsolved.push(help);
            else if (help.status == "solved")
              help_solved.push(help);

            all_help[help.number] = help_history[i];
          }
        } else {
          $('#none_record').show();
        }
        $scope.help_list = help_matching;
        $scope.data = {
          choice: ''
        };

        $localstorage.setObject('help_data', all_help);
      })

  }
  $scope.initialize();

  $scope.helpStatus = function(help_status) {
    var status_choice = help_status;
    $scope.current_status = status_choice;
    //console.log(help_status);

    if (status_choice == "matching")
      $scope.help_list = help_matching;
    else if (status_choice == "ask rating")
      $scope.help_list = help_askRating;
    else if (status_choice == "unsolved")
      $scope.help_list = help_unsolved;
    else if (status_choice == "solved")
      $scope.help_list = help_solved;

    $("div.tabs a").removeClass("active");
    $("#" + event.currentTarget.id).addClass("active");
  }

  $scope.doRefresh = function() {
    $timeout(function() {
      $http.post(serverIP + "/api/getMemberData.php", {
          'account': user_data.account
        })
        .success(function(data, status, headers, config) {
          var new_user_data = data;
          //console.log(new_user_data);
          $localstorage.setObject('user_data', new_user_data);
          $scope.points = new_user_data.points;
        })
      $scope.initialize();
      $("div.tabs a").removeClass("active");
      $("#help_status_matching").addClass("active");
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }
  ionicMaterialInk.displayEffect();
})

.controller('ShopCtrl', function($scope, $http, $ionicLoading, $compile, $state, $timeout, $ionicPopup, $localstorage, ionicMaterialInk) {
  var user_data = $localstorage.getObject('user_data');
  var coupons = [];
  var coupons_category1 = [];
  var coupons_category2 = [];
  var coupons_category3 = [];
  var coupons_category4 = [];
  var coupons_category5 = [];

  $http.post(serverIP + "/api/getMemberData.php", {
      'account': user_data.account
    })
    .success(function(data, status, headers, config) {
      var new_user_data = data;
      //console.log(new_user_data);
      $localstorage.setObject('user_data', new_user_data);
      $scope.points = new_user_data.points;
    })

  $scope.initialize = function() {
    $scope.points = user_data.points;
    $scope.current_category = 1;
    coupons_category1 = [];
    coupons_category2 = [];
    coupons_category3 = [];
    coupons_category4 = [];
    coupons_category5 = [];

    $http.post(serverIP + "/api/shop.php", {
        'account': user_data.account
      })
      .success(function(data, status, headers, config) {
        var allCoupon = data;

        for (i = 0; i < allCoupon.length; i++) {
          var coupon = {};
          coupon.id = allCoupon[i].coupon_id;
          coupon.name = allCoupon[i].coupon_name;
          coupon.category = allCoupon[i].coupon_category;
          coupon.description = allCoupon[i].coupon_description;
          coupon.price = allCoupon[i].coupon_price;
          if (coupon.category == 1)
            coupons_category1.push(coupon);
          else if (coupon.category == 2)
            coupons_category2.push(coupon);
          else if (coupon.category == 3)
            coupons_category3.push(coupon);
          else if (coupon.category == 4)
            coupons_category4.push(coupon);
          else if (coupon.category == 5)
            coupons_category5.push(coupon);
        }

        $scope.coupons = coupons_category1;
        $scope.data = {
          choice: ''
        };
      })
  }
  $scope.initialize();
  $scope.couponCategory = function(category) {
    var catagory_choice = category;
    $scope.current_category = catagory_choice;

    if (catagory_choice == 1)
      $scope.coupons = coupons_category1;
    else if (catagory_choice == 2)
      $scope.coupons = coupons_category2;
    else if (catagory_choice == 3)
      $scope.coupons = coupons_category3;
    else if (catagory_choice == 4)
      $scope.coupons = coupons_category4;
    else if (catagory_choice == 5)
      $scope.coupons = coupons_category5;

    $("div.tabs a").removeClass("active");
    $("#" + event.currentTarget.id).addClass("active");
  }


  $scope.buyCoupon = function() {
    var user_data = $localstorage.getObject('user_data');
    var coupon_id = $("#" + event.currentTarget.id + " div.couponId").text();
    var coupon_price = parseInt($("#" + event.currentTarget.id + " span.couponPrice").text());
    //console.log(coupon_id + "," + coupon_price + "/I have:" + user_data.points);

    if (user_data.points >= coupon_price) {
      var confirmPopup = $ionicPopup.confirm({
        title: '兌換折價券',
        template: "確定要兌換此折價券?",
        cancelText: '取消',
        okText: '確認'
      });

      confirmPopup.then(function(res) {
        if (res) {
          var new_points = user_data.points - coupon_price;
          //console.log(new_points);
          $http.post(serverIP + "/api/buyCoupon.php", {
              'account': user_data.account,
              'coupon_id': coupon_id,
              'points': new_points
            })
            .success(function(data, status, headers, config) {
              //console.log(data);
              var deducted_points = data;
              var new_user_data = user_data;
              new_user_data.points = deducted_points;
              //console.log(new_user_data);
              $localstorage.setObject('user_data', new_user_data);
              $scope.doRefresh();
            })
          $ionicPopup.alert({
            title: "成功兌換折價券！<br/>請至 我的折價券 頁面查看",
          });
        } else
          console.log('You are not sure');
      });
    } else {
      $ionicPopup.alert({
        title: "您的積分不足！快去幫助別人吧！",
      });
    }
  }

  $scope.doRefresh = function() {
    $timeout(function() {
      $http.post(serverIP + "/api/getMemberData.php", {
          'account': user_data.account
        })
        .success(function(data, status, headers, config) {
          var new_user_data = data;
          console.log(new_user_data);
          $localstorage.setObject('user_data', new_user_data);
          $scope.points = new_user_data.points;
        })
      $scope.initialize();
      $("div.tabs a").removeClass("active");
      $("#couponCategory1").addClass("active");
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }
  ionicMaterialInk.displayEffect();
})

.controller('MyCouponCtrl', function($scope, $http, $ionicLoading, $compile, $state, $timeout, $ionicPopup, $localstorage, ionicMaterialInk) {
  var user_data = $localstorage.getObject('user_data');
  var coupons = [];
  var coupons_category1 = [];
  var coupons_category2 = [];
  var coupons_category3 = [];
  var coupons_category4 = [];
  var coupons_category5 = [];


  $scope.initialize = function() {
    $scope.current_category = 1;
    coupons_category1 = [];
    coupons_category2 = [];
    coupons_category3 = [];
    coupons_category4 = [];
    coupons_category5 = [];

    $http.post(serverIP + "/api/getMemberCoupons.php", {
        'account': user_data.account
      })
      .success(function(data, status, headers, config) {
        var allCoupon = data;
        console.log(allCoupon);

        for (i = 0; i < allCoupon.length; i++) {
          var coupon = {};
          coupon.member_coupon_id = allCoupon[i].member_coupon_id;
          coupon.id = allCoupon[i].coupon_id;
          coupon.name = allCoupon[i].coupon_name;
          coupon.category = allCoupon[i].coupon_category;
          coupon.description = allCoupon[i].coupon_description;
          coupon.price = allCoupon[i].coupon_price;
          if (coupon.category == 1)
            coupons_category1.push(coupon);
          else if (coupon.category == 2)
            coupons_category2.push(coupon);
          else if (coupon.category == 3)
            coupons_category3.push(coupon);
          else if (coupon.category == 4)
            coupons_category4.push(coupon);
          else if (coupon.category == 5)
            coupons_category5.push(coupon);
        }

        $scope.mycoupons = coupons_category1;
        $scope.data = {
          choice: ''
        };
      })
  }
  $scope.initialize();
  $scope.couponCategory = function(category) {
    var catagory_choice = category;
    $scope.current_category = catagory_choice;

    if (catagory_choice == 1)
      $scope.mycoupons = coupons_category1;
    else if (catagory_choice == 2)
      $scope.mycoupons = coupons_category2;
    else if (catagory_choice == 3)
      $scope.mycoupons = coupons_category3;
    else if (catagory_choice == 4)
      $scope.mycoupons = coupons_category4;
    else if (catagory_choice == 5)
      $scope.mycoupons = coupons_category5;

    $("div.tabs a").removeClass("active");
    $("#" + event.currentTarget.id).addClass("active");
  }

  $scope.useCoupon = function() {
    var my_coupon_id = $("#" + event.currentTarget.id + " div.myCouponId").text();
    //console.log(event.currentTarget.id + "," + my_coupon_id);

    var confirmPopup = $ionicPopup.confirm({
      title: '使用折價券',
      template: "確定要兌換此折價券?<br/>●請向店員出示此畫面●<br/>●並由店員按下確認鍵●",
      cancelText: '取消',
      okText: '確認'
    });

    confirmPopup.then(function(res) {
      if (res) {
        $http.post(serverIP + "/api/useCoupon.php", {
            'account': user_data.account,
            'coupon_id': my_coupon_id
          })
          .success(function(data, status, headers, config) {
            //console.log(data);

            $scope.doRefresh();
          })
        $ionicPopup.alert({
          title: "已使用折價券！<br/>幫助更多人可以獲得更多折價券！",
        });
      } else
        console.log('You are not sure');
    })
  }

  $scope.doRefresh = function() {
    $timeout(function() {
      $scope.initialize();
      $("div.tabs a").removeClass("active");
      $("#myCouponCategory1").addClass("active");
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }
  ionicMaterialInk.displayEffect();
})

.controller('MapCtrl', function($scope, $http, $ionicLoading, $compile, $state, $window, $ionicPopup, $ionicHistory, $ionicModal, $localstorage, ionicMaterialInk) {
  var user_data = $localstorage.getObject('user_data');
  var allLocation = [];
  //var distance;
  var initialLocation;
  var browserSupportFlag = new Boolean();
  var p1 = new google.maps.LatLng(45.463688, 9.18814);
  var p2 = new google.maps.LatLng(46.0438317, 9.75936230000002);
  $scope.initialize = function() {
    //$scope.centerOnMe();


    var myLatlng = new google.maps.LatLng(23.560803, 120.471977);


    var mapOptions = {
      center: initialLocation, //{lat: 23.560803, lng: 120.471977},
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    if (navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log(initialLocation.lat());
        map.setCenter(initialLocation);
      }, function() {
        handleNoGeolocation(browserSupportFlag);
      });
    }
    // Browser doesn't support Geolocation
    else {
      browserSupportFlag = false;
      handleNoGeolocation(browserSupportFlag);
    }


    //Marker + infowindow + angularjs compiled ng-click



    var marker = new google.maps.Marker({
      position: initialLocation,
      map: map
        //icon: cicon,
    });

    var infowindow = new google.maps.InfoWindow({
      content: ''
    });

    //alert(calcDistance(p1, p2)); ccccccccccccccccccccccccccccccccccccc

    $http.post(serverIP + "/api/incidentLocation.php", {
        'test': "test"
      })
      .success(function(data, status, headers, config) {
        allLocation = data;
        //console.log(allLocation);
        for (i = 0; i < allLocation.length; i++) {
          //console.log("jeeeeeeeeeeeeeeeeeeeee");似乎是location undifiend
          //console.log(allLocation[i].location);

          var loc = allLocation[i].location;
          var title = allLocation[i].title;
          var illust = allLocation[i].illust;
          var num = allLocation[i].number;
          //console.log(allLocation[i].date);
          var icon = {

            url: "img/emergency_marker.png", // url
            scaledSize: new google.maps.Size(45, 45), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
          };

          var coordinate = loc.split(",", 2);
          var myLatlng = new google.maps.LatLng(coordinate[0], coordinate[1]);
          var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: icon,
            title: 'HELP'
          });

          //set infowindow content
          //var anyhelper = "<p>"+allLocation[i].anyhelper+" helper</p>";
          /*var status = "<a ng-show = \"show\" >" + allLocation[i].status+ "</a>"
                        "<a ng-show = \"show=true\" > unsolved </a>";*/

          var dt = '<br><i class="icon ion-calendar margin-right-10"> 截止時間:</i><br>' + allLocation[i].date;

          var hd = false;
          if (allLocation[i].status == 'unsolved') {
            hd = true;
          }
          var help_button = "<button ng-hide=\"" + hd + "\" class=\"help_button\" ng-click=\"helpcheck(" + num + ")\">HELP</button>";

          var status = '';
          if (allLocation[i].status == 'no helper') {
            status = '<br><i class="icon ion-close-circled margin-right-10 color-E14F2B"> 目前無人協助</i>';
          } else if (allLocation[i].status == 'matching') {
            status = '<br><i class="icon ion-android-contacts margin-right-10 color-11c1f3"> 配對中</i>';
          } else if (allLocation[i].status == 'unsolved') {
            status = '<br><i class="icon ion-android-contacts margin-right-10 color-FFDC00"> 解決中</i>';
          }

          var infoContent = "<div>" + '<h5>' + title + '</h5>' + '<i class="icon ion-chatbubble-working color-A8A8A8"> ' + illust + '</i>' + dt + status + help_button + "</div>";
          //compiled let ng-click works
          var infoCompiled = $compile(infoContent)($scope);
          //+ '<div ng-show="sw">已有人幫助</div>' + '<button class="help_button" ng-click="sw=true" >HELP</button>';

          bindInfoWindow(marker, map, infowindow, infoCompiled);
        }

      });


    function calcDistance(p1, p2) {
      return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
    }


    function handleNoGeolocation(errorFlag) {
      if (errorFlag == true) {
        alert("Geolocation service failed.");
        initialLocation = myLatlng;
      } else {
        alert("Your browser doesn't support geolocation.");
        initialLocation = myLatlng;
      }
      map.setCenter(initialLocation);
    }

    function bindInfoWindow(marker, map, infowindow, description) {
      marker.addListener('click', function() {
        infowindow.setContent(description[0]);
        infowindow.open(map, this);
      });
    };

    $scope.map = map;
  }
  google.maps.event.addDomListener(window, 'load', $scope.initialize);

  $scope.helpcheck = function(incident_number) {
    var confirmPopup = $ionicPopup.confirm({
      title: '確認救援',
      template: '確定要幫助他嗎?',
      okText: '是',
      cancelText: '否'
    });
    confirmPopup.then(function(res) {
      if (res) {
        console.log('是');
        console.log('幫助事件號碼:' + incident_number);

        $http.post(serverIP + "/api/helpOthers.php", {
            'incident_number': incident_number,
            'id': user_data.account,
          })
          .success(function(data, status, headers, config) {
            console.log("helper insert successfully ");
          });

        $ionicPopup.alert({
          title: "救援通知送出！(請等候對方確認)"
        });
        $scope.initialize();
      } else {
        console.log('否');
      }
    });
  }

  $scope.centerOnMe = function() {

    $state.go("app.map");
    if (!$scope.map) {
      return;
    }

    $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      console.log(pos.coords.latitude + "    " + pos.coords.longitude);
      $ionicLoading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.centerOnIncident = function() {
    $scope.modal.hide();
    $state.go("app.map");
    $http.post(serverIP + "/api/missionlocate.php", {
        'test': "test"
      })
      .success(function(data, status, headers, config) {
        console.log(data);
        var missionLocation = [];
        missionLocation = data;
        ///console.log("setceter success");
        var loc = missionLocation.location;
        //console.log(loc);
        var coordinate = loc.split(",", 2);
        console.log("coordinate: " + coordinate);
        $scope.map.setCenter(new google.maps.LatLng(coordinate[0], coordinate[1]));
        //$scope.map.setCenter(new google.maps.LatLng(23.547995399999998,120.4588059));
      });

    //$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
  };

  $scope.clickTest = function() {
    alert('Example of infowindow with ng-click')
  };

  $scope.doRefresh = function() {
    $scope.initialize();
  }

  ionicMaterialInk.displayEffect();
})

.directive('pwCheck', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      var firstPassword = '#' + attrs.pwCheck;
      $(elem).add(firstPassword).on('keyup', function() {
        scope.$apply(function() {
          //alert(elem.val());
          var v = elem.val() === $(firstPassword).val();
          ctrl.$setValidity('pwmatch', v);
        });
      });
    }
  };
})

.directive('pwAccountCheck', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      var Password = '#' + attrs.pwAccountCheck;
      $(elem).add(Password).on('keyup', function() {
        scope.$apply(function() {
          //alert(elem.val());
          var v = elem.val() !== $(Password).val();
          ctrl.$setValidity('pwsame', v);
        });
      });
    }
  };
})

.directive('formattedTime', function($filter) {

  return {
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel) {
      if (!ngModel)
        return;
      if (attr.type !== 'datetime-local')
        return;

      ngModel.$formatters.unshift(function(value) {
        return value.replace(/:[0-9]+.[0-9]+$/, '');
      });
    }
  };

})

.controller('NotificateCtrl', function($scope, $ionicModal, $http, $state, $interval, $ionicHistory, $localstorage, ionicMaterialInk) {
  var user_data = $localstorage.getObject('user_data');
  var notifications = [];
  var notification_list = [];

  function initialize() {
    notifications = [];
    notification_list = [];
    $http.post(serverIP + "/api/getNotification.php", {
        'account': user_data.account
      })
      .success(function(data, status, headers, config) {
        var allNotification = data;
        //console.log(allNotification);

        for (i = 0; i < allNotification.length; i++) {
          var notification = {};
          notification.id = allNotification[i].id;
          notification.category = allNotification[i].category;
          notification.content = allNotification[i].content;
          notification.incident_number = allNotification[i].incident_number;
          notification.sender_account = allNotification[i].sender_account;

          notifications.push(notification);
        }

        $scope.notification_list = notifications;
        $scope.data = {
          choice: ''
        };
      })
  }
  initialize();
  $interval(initialize, 5000);

  $scope.seeNotification = function(){
    var current_notification = $("#" + event.currentTarget.id + " h2.notificationCategory").text();
    var pageToGo = "";

    if(current_notification == "ask help")
      pageToGo = "app.map"
    else if(current_notification == "ask match" || current_notification == "solved")
      pageToGo = "app.incidentHistory"
    else if(current_notification == "matched" || current_notification == "rated")
      pageToGo = "app.helpHistory"

    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go(pageToGo);
    $scope.closeNotificate();
  }
  ionicMaterialInk.displayEffect();
})
