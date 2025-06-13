// app.js
var app = angular.module("neuralyzeApp", ["ngRoute"]);

    app.config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when("/dashboard", {
          templateUrl: "static/dashboard.html",
          controller: "DashboardController",
        })
        .when("/classification", {
          templateUrl: "static/classification.html",
          controller: "ClassificationController",
        })
        .when("/redaction", {
          templateUrl: "redaction.html",
        })
        .when("/profile", {
          template: "<h2>User Profile</h2><p>Profile settings here.</p>",
        })
        .when("/settings", {
          template: "<h2>Settings</h2><p>Application settings here.</p>",
        })
        .otherwise({
          redirectTo: "/dashboard",
        });

      $locationProvider.hashPrefix("!");
    });

    app.controller("MainController", function ($scope) {
      $scope.isLoggedIn = true;
      $scope.credentials = {};

      $scope.login = function () {
        // if ($scope.credentials.username && $scope.credentials.password) {
          $scope.isLoggedIn = true;
          location.hash = "/dashboard";
        // }
      };

      $scope.logout = function () {
        $scope.isLoggedIn = false;
        $scope.credentials = {};
        location.hash = "";
      };
    });

    app.controller("DashboardController", function ($scope) {
      $scope.stats = {
        requests: 250,
        processed: 180,
        redacted: 75,
      };
    });

    app.controller("ClassificationController", function ($scope, $http) {
        $scope.files = [];
  
        $scope.handleFiles = function(fileList) {
          $scope.files = [];
          const allowedExtensions = ['pdf', 'docx', 'csv'];
  
          for (var i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const name = file.name.toLowerCase();
            const ext = name.substring(name.lastIndexOf('.') + 1);
  
            if (allowedExtensions.includes(ext)) {
              const fileEntry = {
                raw: file,
                path: file.webkitRelativePath || file.name,
                sizeKB: (file.size / 1024).toFixed(2),
                type: file.type || ext.toUpperCase(),
                status: 'Pending',
                classification: null
              };
              $scope.files.push(fileEntry);
            }
          }
          $scope.$apply();
        };
  
        $scope.uploadFilesOneByOne = function() {
          let index = 0;
  
          function uploadNext() {
            if (index >= $scope.files.length) return;
  
            const fileEntry = $scope.files[index];
            fileEntry.status = 'Uploading...';
            // $scope.$apply();
  
            const formData = new FormData();
            formData.append('filename', fileEntry.path);
            formData.append('file', fileEntry.raw);
  
            $http.post('/classify', formData, {
              headers: { 'Content-Type': undefined }, // Let browser set multipart/form-data with boundary
              transformRequest: angular.identity
            }).then(function(response) {
              fileEntry.status = 'Done';
              fileEntry.classification = response.data.classification || 'Success';
            }).catch(function(error) {
              fileEntry.status = 'Error';
              fileEntry.classification = 'Upload failed';
            }).finally(function() {
              index++;
              uploadNext();
            });
          }
  
          uploadNext();
        };
      });
  

// Create the AngularJS module
// var app = angular.module('neuralyze', ["ngRoute"]);

// app.config(function($routeProvider) {
//     $routeProvider
//     .when("/dashboard", {
//         templateUrl : "dashboard.html"
//     })
//     .when("/page1", {
//         templateUrl : "page1.html"
//     })
//     .when("/users/:id", {
//         templateUrl : "user.html",
//         controller: 'UserController'
//     })
//     .when("/users", {
//             templateUrl : "users.html",
// //            controller: 'UserController'
//         })
//     .otherwise({
//         redirectTo: "/dashboard"
//     });
//  });

// app.controller("UserController", ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

//     $scope.riskRatingClasses = {
//                      'SEVERE': 'bg-danger',
//                      'HIGH': 'bg-warning',
//                      'MEDIUM': 'bg-info',
//                      'LOW': 'bg-success'
//                  };


//      var id = $routeParams.id;
//      $scope.userId = id;


//      $http.get('/api/users/' + id)
//         .then(function (response) {
//                      // Success
//                      $scope.alerts = response.data;
//                      var receiving = response.data.exposure.receiving;
//                      var sending = response.data.exposure.sending;
//                      let alerts = response.data['alerts']['data'];



//                      let formatter = new Intl.NumberFormat('en-AU', {
//                                        style: 'currency',
//                                        currency: 'AUD',
//                                      });

//                      $scope.alerts = alerts.map(x => {
//                                          x.alertAmountFormatted = formatter.format(x.alertAmountUsd);
//                                          return x;
//                                      });



//                      $scope.riskScore = response.data['riskScore'];
//                      $scope.riskColor = $scope.riskRatingClasses[$scope.riskScore]

//                     $scope.receiving_exposure = Object.keys(receiving).map(key => ({
//                                                                      key: key,
//                                                                      value: receiving[key]
//                                                                  }));
//                     $scope.sending_exposure = Object.keys(sending).map(key => ({ key: key,
//                                                                                     value: sending[key]
//                                                                                 }));
//                     let default_color = ''
//                     $scope.receiving_exposure_chart = Object.keys(receiving).map(key => ({
//                                                                                      name: key,
//                                                                                      y: receiving[key],
//                                                                                      color: $scope.colors[key] || '#13dddd'
//                                                                                  }));

//                     $scope.sending_exposure_chart = Object.keys(sending).map(key => ({ name: key,
//                                                                                  y: sending[key],
//                                                                                  color: $scope.colors[key] || '#13dddd'
//                                                                                 }));

//                     $scope.drawPie($scope.receiving_exposure_chart, 'user-receiving-exposure-pie', 'Receiving Exposure')
//                     $scope.drawPie($scope.sending_exposure_chart, 'user-sending-exposure-pie', 'Sending Exposure')

//                  }, function (error) {
//                      // Error
//                      console.log(error);
//                  });

//              $scope.drawPie = function(category_series, element, banner) {
//                      Highcharts.chart(element, {
//                          chart: {
//                              plotBackgroundColor: null,
//                              plotBorderWidth: null,
//                              plotShadow: false,
//                              type: 'pie'
//                          },
//                          title: {
//                              text: banner
//                          },
//                          tooltip: {
//                              pointFormat: '{series.name}: <b>{point.y}</b>'

//                          },
//                          dataLabels: {
//                                    formatter: function() {
//                                      // Format the value as AUD
//                                      const formatter = new Intl.NumberFormat('en-AU', {
//                                        style: 'currency',
//                                        currency: 'AUD'
//                                      });
//                                      return '${this.point.name}: ${formatter.format(this.point.y)}';
//                                      }
//                                    },
//                          accessibility: {
//                              point: {
//                                  valueSuffix: '%'
//                              }
//                          },
//                          plotOptions: {
//                              pie: {
//                                  allowPointSelect: true,
//                                  cursor: 'pointer',
//                                  dataLabels: {
//                                      enabled: true,
//                                      format: '<b>{point.name}</b>: {point.percentage:.1f} %'
//                                  }
//                              }
//                          },
//                          series: [{
//                              name: '',
//                              colorByPoint: true,
//                              data: category_series
//                        }]
//                      })
//                  }
// }]);

// // Create the controller
// app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
//         $scope.alerts = [];
//         $scope.colors = {
//         "atm" : "#fadf86",
//         "bridge": "#aa6ad8",
//         "child abuse material": "#ff1c46",
//         "darknet market": "#e43b38",
//         "fraud shop": "#ed810e",
//         "gambling": "#ff5827",
//         "illicit actor-org": "#7c7403",
//         "high risk jurisdiction": "#7c7403",
//         "no kyc exchange": "#880d4f",
//         "high risk exchange": "#880d4f",
//         "online pharmacy": "#ff8987",
//         "ransomware": "#8b1b1b",
//         "sanctioned entity": "#e43b38",
//         "sanctions": "#e43b38",
//         "sanctioned jurisdiction": "#880d4f",
//         "scam": "#4f3731",
//         "special measures": "#be364e",
//         "stolen funds": "#79564a",
//         "terrorist financing": "#421313",
//         "exchange": "#5c6bbe",
//         "decentralized exchange":"#7c609b"
//         }


//         $scope.getAlerts = function () {
//             $scope.alerts = [];
//             $http.get('/api/alerts')
//             .then(function (response) {
//                 // Success
//                 // Create a formatter for AUD currency
//                 let formatter = new Intl.NumberFormat('en-AU', {
//                   style: 'currency',
//                   currency: 'AUD',
//                 });

//                 let alerts = response.data.alerts.data.map(x => {
//                     x.alertAmountFormatted = formatter.format(x.alertAmountUsd);
//                     return x;
//                 });

//                 $scope.alerts = alerts;
//                 var receiving = response.data.exposure.receiving;
//                 var sending = response.data.exposure.sending;

//                $scope.receiving_exposure = Object.keys(receiving).map(key => ({
//                                                                 key: key,
//                                                                 value: receiving[key]
//                                                             }));
//                $scope.sending_exposure = Object.keys(sending).map(key => ({ key: key,
//                                                                                value: sending[key]
//                                                                            }));
//                // Format as currency in AUD (Australian Dollars)
// //               var formatter = new Intl.NumberFormat('en-AU', {
// //                 style: 'currency',
// //                 currency: 'AUD'
// //               })

//                let default_color = ''
//                $scope.receiving_exposure_chart = Object.keys(receiving).map(key => ({
//                                                                                 name: key,
//                                                                                 y: receiving[key],
//                                                                                 color: $scope.colors[key] || '#13dddd'
//                                                                             }));

//                $scope.sending_exposure_chart = Object.keys(sending).map(key => ({ name: key,
//                                                                             y: sending[key],
//                                                                             color: $scope.colors[key] || '#13dddd'
//                                                                            }));

//                $scope.drawPie($scope.receiving_exposure_chart, 'receiving-exposure-pie', 'Receiving Exposure')
//                $scope.drawPie($scope.sending_exposure_chart, 'sending-exposure-pie', 'Sending Exposure')

//             }, function (error) {
//                 // Error
//                 console.log(error);
//             });
//         }

//         $scope.drawPie = function(category_series, element, banner) {
//                 Highcharts.chart(element, {
//                     chart: {
//                         plotBackgroundColor: null,
//                         plotBorderWidth: null,
//                         plotShadow: false,
//                         type: 'pie'
//                     },
//                     title: {
//                         text: banner
//                     },
//                     tooltip: {
//                         pointFormat: '{series.name}: <b>{point.y}</b>'

//                     },
//                     dataLabels: {
//                               formatter: function() {
//                                 // Format the value as AUD
//                                 const formatter = new Intl.NumberFormat('en-AU', {
//                                   style: 'currency',
//                                   currency: 'AUD'
//                                 });
//                                 return '${this.point.name}: ${formatter.format(this.point.y)}';
//                                 }
//                               },
//                     accessibility: {
//                         point: {
//                             valueSuffix: '%'
//                         }
//                     },
//                     plotOptions: {
//                         pie: {
//                             allowPointSelect: true,
//                             cursor: 'pointer',
//                             dataLabels: {
//                                 enabled: true,
//                                 format: '<b>{point.name}</b>: {point.percentage:.1f} %'
//                             }
//                         }
//                     },
//                     series: [{
//                         name: '',
//                         colorByPoint: true,
//                         data: category_series
//                   }]
//                 })
//             }

//             $scope.$on('$viewContentLoaded', function() {
//                     console.log('View was loaded or reloaded!');
//                     // Place the code you want to run on view load here
//                     $scope.getAlerts();
//             });

//             $scope.getAlerts();

// }]);
