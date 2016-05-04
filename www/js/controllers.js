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

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $http, $state, $ionicHistory, $localstorage, API, ionicMaterialInk, mapp) {
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

  // Triggered in the modal to close it
  $scope.closeRegister = function() {
    $scope.modal1.hide();
  };
  $scope.closeForget = function() {
    $scope.modal2.hide();
  };
  $scope.closeIncident = function() {
    $scope.modal3.hide();
  };
  $scope.closeHelp = function() {
    $scope.modal4.hide();
  };
  // Open the modal
  $scope.register = function() {
    $scope.modal1.show();
  };
  $scope.forgetPassword = function() {
    $scope.modal2.show();
  };
  $scope.incident = function(incident_number) {
    var incident_data = $localstorage.getObject('incident_data');
    //console.log(incident_data[incident_number]);

    $scope.incident.number = incident_data[incident_number].number;
    $scope.incident.title = incident_data[incident_number].title;
    $scope.incident.helper = incident_data[incident_number].helper;
    $scope.incident.level = incident_data[incident_number].level;
    $scope.incident.category = incident_data[incident_number].category;
    $scope.incident.date = incident_data[incident_number].date;
    $scope.incident.illust = incident_data[incident_number].illust;
    $scope.incident.status = incident_data[incident_number].status;
    $scope.incident.rating = incident_data[incident_number].rating;

    $scope.modal3.show();
  };
  $scope.help = function(help_number) {
    var help_data = $localstorage.getObject('help_data');
    //console.log(help_data[help_number]);

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


  $scope.editMember = function() {
    $state.go("app.editmember");
  }


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

.controller('HomeCtrl', function($scope, $ionicHistory, $state, ionicMaterialInk, $localstorage, $ionicPopup, $timeout) {


  var check_login = $localstorage.getObject('user_data');
  if (check_login.account == null) {
    //console.log("haven't login");
    $state.go("app.login");
  }

  $ionicHistory.clearHistory();

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

  };





  $scope.helpOthers = function() {

    /*var catchpos = '';
	navigator.geolocation.getCurrentPosition(function(pos) {
    catchpos = pos.coords.latitude + "," + pos.coords.longitude;

  }, function(error) {
    alert('Unable to catch location: ' + error.message);
  });


  $ionicPopup.alert({
                title: catchpos

              });

	console.log(catchpos);

    $ionicHistory.nextViewOptions({
      disableBack: true
    });
	*/

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

.controller('MemberCtrl', function($scope, $http, $ionicLoading, $state, $localstorage, $ionicPopup, ionicMaterialInk, $ionicHistory) {
  var user_view = $localstorage.getObject('user_data');
  $scope.account = user_view.account;
  $scope.passwd = user_view.password;
  $scope.name = user_view.name;
  $scope.cel = user_view.cellphone;
  $scope.email = user_view.email;
  $scope.contact_name = user_view.contact_name,
    $scope.contact_cel = user_view.contact_cel

  $scope.updateData = function() {
    if ($scope.edit_form.$valid) {
      // 通過驗證
      $http.post(serverIP + "/api/editMember.php", {
          'account': $scope.account,
          'passwd': $scope.passwd,
          'name': $scope.name,
          'cel': $scope.cel,
          'email': $scope.email,
          'contact_name': $scope.contact_name,
          'contact_cel': $scope.contact_cel
        })
        .success(function(data, status, headers, config) {
          console.log(data);
          $localstorage.setObject('user_data', {
            account: $scope.account,
            password: $scope.passwd,
            name: $scope.name,
            cellphone: $scope.cel,
            email: $scope.email
          });
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go("app.member", {}, {
            reload: true
          });
        });
    } else {
      // 未通過驗證
      $ionicPopup.alert({
        title: "請完整輸入資料！"
      });
    }
  }

  ionicMaterialInk.displayEffect();
})

.controller('IncidentCtrl', function($scope, $http, $ionicPopup, $state, $localstorage, ionicMaterialInk) {
  $scope.default_date = new Date();
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
        'time': $scope.time,
        'location': catchpos
      })
      .success(function(data, status, headers, config) {
        console.log("data insert successfully " + catchpos);
        $scope.level = null;
        $scope.category = null;
        $scope.title = null;
        $scope.illust = null;
        $scope.date = null;
        $scope.time = null;
        $scope.location = null;
        $scope.addincident_form.$setPristine();

        $ionicPopup.alert({
          title: "新增事件成功！",
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
  ionicMaterialInk.displayEffect();
})

.controller('IncidentHistoryCtrl', function($scope, $http, $compile, $localstorage, $ionicPopup, ionicMaterialInk, $timeout) {
  var user_data = $localstorage.getObject('user_data');
  var all_incident = [];

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
      $("#incident_history_unsolved").empty();
      $("#incident_history_solved").empty();
      $("#incident_history_noHelper").empty();
      $scope.initialize();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }

  $scope.initialize = function() {
    $http.post(serverIP + "/api/IncidentHistory.php", {
        'account': user_data.account
      })
      .success(function(data, status, headers, config) {
        incident_history = data;
        console.log(incident_history);
        for (i = 0; i < incident_history.length; i++) {
          var number = incident_history[i].number;
          var title = incident_history[i].title;
          var illust = incident_history[i].illust;
          var status = incident_history[i].status;

          all_incident[number] = incident_history[i];

          var icon;
          var add_record;

          if (status == "unsolved") {
            icon = "ion-android-create color-A8BF7C font-size-22";
            add_record = "#incident_history_unsolved";
            $("#incident_history_unsolved_title").show();
          } else if (status == "solved") {
            icon = "ion-android-checkbox-outline color-A8BF7C font-size-22";
            add_record = "#incident_history_solved";
            $("#incident_history_solved_title").show();
          } else if (status == "no helper") {
            icon = "ion-android-create color-A8BF7C font-size-22";
            add_record = "#incident_history_noHelper";
            $("#incident_history_noHelper_title").show();
          }

          var record = "<ion-item nav-clear menu-close class=\"item-icon-right item-avatar\" ng-click=\"incident(" + number + ")\">" +
            "<img src=\"img/12970458_962849903770409_2043643368_o.jpg\">" +
            "<h2>" + title + "</h2>" +
            "<p>" + illust + "</p>" +
            "<i class=\"icon " + icon + "\"></i>" +
            "</ion-item>";

          var record_compile = $compile(record);
          var nodeOfCompiledDOM = record_compile($scope);
          $(add_record).append(nodeOfCompiledDOM);
        }

        $localstorage.setObject('incident_data', all_incident);
      })
  }
  $scope.initialize();

  ionicMaterialInk.displayEffect();
})

.controller('HelpHistoryCtrl', function($scope, $http, $compile, $localstorage, $ionicPopup, ionicMaterialInk, $timeout) {
  var user_data = $localstorage.getObject('user_data');

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
      $("#help_history_unsolved").empty();
      $("#help_history_solvede").empty();
      $scope.initialize();
      $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
  }
  $scope.initialize = function() {
    var all_help = [];

    $scope.points = user_data.points;
    $http.post(serverIP + "/api/helpHistory.php", {
        'account': user_data.account
      })
      .success(function(data, status, headers, config) {
        help_history = data;
        //console.log(help_history.length);

        if (help_history.length > 0) {
          for (i = 0; i < help_history.length; i++) {
            var number = help_history[i].number;
            var title = help_history[i].title;
            var illust = help_history[i].illust;
            var status = help_history[i].status;

            all_help[number] = help_history[i];

            var icon;
            var add_record;

            if (status == "unsolved") {
              icon = "ion-help-circled color-A8BF7C font-size-22";
              add_record = "#help_history_unsolved";
              $("#help_history_unsolved_title").show();
            } else if (status == "solved") {
              icon = "ion-ribbon-b color-A8BF7C font-size-22";
              add_record = "#help_history_solved";
              $("#help_history_solved_title").show();
            }

            var record = "<ion-item nav-clear menu-close id=\"" + number + "\" class=\"item-icon-right item-avatar\" ng-click=\"help(" + number + ")\">" +
              "<img src=\"img/12970458_962849903770409_2043643368_o.jpg\">" +
              "<h2>" + title + "</h2>" +
              "<p>" + illust + "</p>" +
              "<i class=\"icon " + icon + "\"></i>" +
              "</ion-item>";

            var record_compile = $compile(record);
            var nodeOfCompiledDOM = record_compile($scope);
            $(add_record).append(nodeOfCompiledDOM);
          }
        } else {
          $('#none_record').show();
        }

        $localstorage.setObject('help_data', all_help);
      })

  }
  $scope.initialize();
  ionicMaterialInk.displayEffect();
})

.controller('MapCtrl', function($scope, $http, $ionicLoading, $compile, $state, $window, $ionicPopup, $ionicHistory, $ionicModal, $localstorage, ionicMaterialInk) {
  var user_data = $localstorage.getObject('user_data');
  var allLocation = [];

  $scope.initialize = function() {
    //$scope.centerOnMe();
    var myLatlng = new google.maps.LatLng(23.560803, 120.471977);

    //console.log(myLatlng);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);



    //Marker + infowindow + angularjs compiled ng-click


    /*var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Uluru (Ayers Rock)'
    });*/


    //var infoWindowContent = '<div>'+title+'</div>';

    var infowindow = new google.maps.InfoWindow({
      content: ''
    });

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
          var status = "<a>" + allLocation[i].status+ "</a>"
          var help_button = "<button class=\"help_button\" ng-click=\"helpcheck(" + num + ")\">HELP</button>";
          var infoContent = "<div>" + '<h5>' + title + status + '</h5>' + '<p>說明> ' + illust + '</p>' + help_button + "</div>";
          //compiled let ng-click works
          var infoCompiled = $compile(infoContent)($scope);
          //+ '<div ng-show="sw">已有人幫助</div>' + '<button class="help_button" ng-click="sw=true" >HELP</button>';

          bindInfoWindow(marker, map, infowindow, infoCompiled);
        }

      });


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
        console.log('幫助事件號碼:'+incident_number);

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
        console.log("setceter success");
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

.controller('NotificateCtrl', function($scope, $ionicModal, $http, $state, $ionicHistory, $localstorage, ionicMaterialInk) {
  $ionicModal.fromTemplateUrl('templates/notificate.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeNotificate = function() {
    $scope.modal.hide();
  };

  $scope.notificate = function() {
    $scope.modal.show();
  };
})
