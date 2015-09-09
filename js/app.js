// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngCordova.plugins.datePicker', 'ngResource'])

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

.factory('reportService', ['$rootScope', function ($rootScope) {

    var service = {

        model: {
            carPics: [],
            incidentNumber: "",
            date: new Date(),
            time: new Date(),
            name: "",
            address: "",
            telephoneNumber: "",
            vehicleNumber: "",
            licenseNumber: "",
            imageTitle: "",
            gpsLocation: "",
            locationDescription: ""
        },

        SaveState: function () {
            //sessionStorage.userService = angular.toJson(service.model);
        },

        RestoreState: function () {
            //service.model = angular.fromJson(sessionStorage.userService);
        }
    }

    //$rootScope.$on("savestate", service.SaveState);
    //$rootScope.$on("restorestate", service.RestoreState);

    return service;
}])

.factory('Complaint', function ($resource, $http) {
    $http.defaults.headers.common['Authorization'] = 'Basic ZGVtbzphMXMyZDNmNA==';
        //return $resource('http://localhost:8085/imgmt/incidents');
    return $resource('http://tbi-request.cc-interactive.com.ua/imgmt/incidents');
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('page0', {
            url: '/0',
            templateUrl: 'page0.html',
            controller: "IdController"
        })
        .state('page1', {
            url: '/1',
            templateUrl: 'page1.html',
            controller: "IdController"
        })
        .state('page2', {
            url: '/2',
            templateUrl: 'page2.html',
            controller: "IdController"
        })
        .state('page3', {
            url: '/3',
            templateUrl: 'page3.html',
            controller: "IdController"
        })
    $urlRouterProvider.otherwise("/0");
})

.controller('IdController', function($scope, $ionicModal, $cordovaDatePicker, $cordovaCamera, reportService, $cordovaSms, Complaint) {

    $scope.report = reportService.model;

    $scope.init = function() {
        if ($scope.report.initialized) {
            return;
        }
        $scope.report.initialized = true;
        var nowDate = new Date();
        nowDate.setSeconds(0);
        nowDate.setMilliseconds(0);
        $scope.report.incidentNumber = "BG" + nowDate.getFullYear() + $scope.pad(nowDate.getMonth() + 1, 2)
            + $scope.pad(nowDate.getDate(), 2) + $scope.pad(nowDate.getHours(), 2) + $scope.pad(nowDate.getMinutes(), 2);
        $scope.report.date = nowDate;
        $scope.report.printdate = $scope.pad(nowDate.getDate(), 2) + "." + $scope.pad(nowDate.getMonth() + 1, 2) + "." + nowDate.getFullYear();
        $scope.report.time = nowDate;
        $scope.report.printtime = $scope.pad(nowDate.getHours(), 2) + ":" + $scope.pad(nowDate.getMinutes(), 2);

        /*navigator.geolocation.getCurrentPosition(function(position) {
            $scope.report.googleMapsPosition = position.coords;
            var lng = position.coords.longitude;
            var lat = position.coords.latitude;
            $scope.report.gpsLocation = lat + ":" + lng;
            *//*var mapOptions = {
                center: new google.maps.LatLng(lat, lng),
                zoom: 19,
                mapTypeId: google.maps.MapTypeId.ROADMAP };
            var map = new google.maps.Map(document.getElementById("initmap"), mapOptions);
            $scope.report.marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                title:"You are here"
            });*//*
        }, function (error) {
            $scope.googleMailErrors = error.message;
            var lng = 30.48413177;
            var lat = 50.429544;
            $scope.report.gpsLocation = lat + ":" + lng;
            $scope.$apply();
            *//*var mapOptions = {
                center: new google.maps.LatLng(lat, lng),
                zoom: 19,
                mapTypeId: google.maps.MapTypeId.ROADMAP };
            var map = new google.maps.Map(document.getElementById("initmap"), mapOptions);
            $scope.report.marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                title:"You are here"
            });*//*
        });*/

        /*$cordovaEmailComposer.isAvailable().then(function() {
            $scope.report.emailAvailable = true;
        }, function () {
        });*/
    }

    $scope.pad = function (n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    $scope.moveFocus = function() {
        if (document.activeElement.form) {
            var elements = document.activeElement.form.elements;
            var i = 0;
            while (i < elements.length && document.activeElement != elements[i]) { i++ }
            if (i++ < elements.length) {
                while (i < elements.length && elements[i].type != 'text' && elements[i].type != 'tel' && elements[i].type != 'date' && elements[i].type != 'time') { i++ };
                if (i < elements.length) {
                    elements[i].focus();
                } else {
                    cordova.plugins.Keyboard.close();
                }
            } else {
                cordova.plugins.Keyboard.close();
            }
        }
    }

    $scope.showPicture = function(title, data) {
        $scope.report.imageURI = data;
        $scope.report.imageTitle = title;
        $scope.imageModal.show();
    };

    $scope.closePicture = function() {
        $scope.imageModal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.imageModal.remove();
        //$scope.mapModal.remove();
    });

    $ionicModal.fromTemplateUrl('image-preview.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.imageModal = modal;
    });

    $scope.takeAndAttachPicture = function(e) {
        var options = {
                quality : 75,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 600,
                targetHeight: 600,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
        $cordovaCamera.getPicture(options).then(function(imageData) {
                    $scope.report.carPics.push({ top: e.offsetY+10, left: e.offsetX+10, src: "data:image/jpeg;base64," + imageData});
                    $scope.$apply();
                }, function(err) {
                    // An error occured. Show a message to the user
                });
    }

    $scope.takePicture = function(name) {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 600,
            targetHeight: 600,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.report[name] = "data:image/jpeg;base64," + imageData;
            if (document.getElementById(name.substr(0,name.length-5))) {
                document.getElementById(name.substr(0,name.length-5)).placeholder = "(see attachment)";
            }
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }

    /*$scope.takeDamagePicture = function(damage, name, index) {
            var options = {
                quality : 75,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 600,
                targetHeight: 600,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                damage[name] = "data:image/jpeg;base64," + imageData;
                if (document.getElementById(name.substr(0,name.length-5)+index)) {
                    document.getElementById(name.substr(0,name.length-5)+index).placeholder = "(see attachment)";
                }
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }*/

    /*$ionicModal.fromTemplateUrl('page2map.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.mapModal = modal;
    });*/

    /*$scope.addGoodsDamage = function() {
        console.log($scope.report.goodsDamage.length);
        $scope.report.goodsDamage.push({type: "Broken" });
        $scope.$broadcast('scroll.resize');
    }*/

    $scope.monthly = function() {
        $scope.report.amount * 1.2 / 12;
    }

    /*$scope.answer = function (question, value) {
        if (question == 'q1') { $scope.report['q2'] = undefined; $scope.report['q3'] = undefined; $scope.report['q4'] = undefined; $scope.report['q5'] = undefined; }
        if (question == 'q2') { $scope.report['q3'] = undefined; $scope.report['q4'] = undefined; $scope.report['q5'] = undefined; }
        if (question == 'q3') { $scope.report['q4'] = undefined; $scope.report['q5'] = undefined; }
        if (question == 'q4') { $scope.report['q5'] = undefined; }
        $scope.report[question] = value;

        var reportFirstLine = ""
        if ($scope.report.isExtraDriverAtTimeOfIncident) {
            reportFirstLine = $scope.report.extraDriverName + " (license no. " + $scope.report.extraDriverLicenseNumber;
        } else {
            reportFirstLine = $scope.report.name + " (license no. " + $scope.report.licenseNumber;
        }

        $scope.report.messageText = reportFirstLine + ") reports on incident that occurred on "
        + $scope.report.printdate + " at " + $scope.report.printtime + "\n"
        + ($scope.report.q1 == 'no' ? 'The vehicle cannot continue.\n' : '')
        + ($scope.report.q2 == 'no' ? 'It is impossible to proceed with shipment.\n' : '')
        + ($scope.report.q3 == 'yes' ? 'There are some damaged boxes.\n' : '');
        $scope.report.whatIsNeeded = reportFirstLine + ") reports on incident that occurred on "
                                             + $scope.report.printdate + " at " + $scope.report.printtime + "\n I need ...";
    }*/

    /*$scope.sendSMS = function() {
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
            }
        };

        $cordovaSms.send('phonenumber', $scope.report.messageText, options).then(function() {
            $scope.report.smsButtonDisabled = true;
        }, function(error) {
            // An error occurred
        });
    }

    $scope.sendEmail = function() {
           window.location.href = "mailto:info@example.com?subject=Report%20" + $scope.report.incidentNumber + "&body=" +
           $scope.report.messageText.replace(new RegExp(' ', 'g'), '%20').replace(new RegExp('\n','g'),'%0A')
    }*/

    /*$scope.resetSection = function(section) {
        if (section == 1) {
            var nowDate = new Date();
            nowDate.setSeconds(0);
            nowDate.setMilliseconds(0);
            $scope.report.incidentNumber = "BG" + nowDate.getFullYear() + $scope.pad(nowDate.getMonth() + 1, 2)
                + $scope.pad(nowDate.getDate(), 2) + $scope.pad(nowDate.getHours(), 2) + $scope.pad(nowDate.getMinutes(), 2);
            $scope.report.date = nowDate;
            $scope.report.printdate = $scope.pad(nowDate.getDate(), 2) + "." + $scope.pad(nowDate.getMonth() + 1, 2) + "." + nowDate.getFullYear();
            $scope.report.time = nowDate;
            $scope.report.printtime = $scope.pad(nowDate.getHours(), 2) + ":" + $scope.pad(nowDate.getMinutes(), 2);
            $scope.report.vehicleNumber = null;
        } else if (section == 2) {
            $scope.report.name = null;
            $scope.report.isDriverAtTimeOfIncident = false;
            $scope.report.address = null;
            $scope.report.telephoneNumber = null;
            $scope.report.licenseNumber = null;
            document.getElementById("driverLicense").placeholder = "";
            $scope.report.driverLicensePhoto = null;
            $scope.report.driverPassport = null;
            document.getElementById("driverPassport").placeholder = "";
            $scope.report.driverPassportPhoto = null;
            $scope.report.driverOther = null;
            document.getElementById("driverOther").placeholder = "";
            $scope.report.driverOtherPhoto = null;
        } else if (section == 3) {
            $scope.report.extraDriverName = null;
            $scope.report.isExtraDriverAtTimeOfIncident = false;
            $scope.report.extraDriverAddress = null;
            $scope.report.extraDriverTelephoneNumber = null;
            $scope.report.extraDriverLicenseNumber = null;
            document.getElementById("extraDriverLicense").placeholder = "";
            $scope.report.extraDriverLicensePhoto = null;
            $scope.report.extraDriverPassport = null;
            document.getElementById("extraDriverPassport").placeholder = "";
            $scope.report.extraDriverPassportPhoto = null;
            $scope.report.extraDriverOther = null;
            document.getElementById("extraDriverOther").placeholder = "";
            $scope.report.extraDriverOtherPhoto = null;
        } else if (section == 4) {
            $scope.report.opponentName = null;
            $scope.report.opponentTelephone = null;
            $scope.report.opponentLicense = null;
            document.getElementById("opponentLicense").placeholder = "";
            $scope.report.opponentLicensePhoto = null;
            $scope.report.opponentPassport = null;
            document.getElementById("opponentPassport").placeholder = "";
            $scope.report.opponentPassportPhoto = null;
            $scope.report.opponentOther = null;
            document.getElementById("opponentOther").placeholder = "";
            $scope.report.opponentOtherPhoto = null;
        } else if (section == 5) {
            $scope.report.witnessName = null;
            $scope.report.witnessesTelephone = null;
            $scope.report.witnessesLicense = null;
            document.getElementById("witnessesLicense").placeholder = "";
            $scope.report.witnessesLicensePhoto = null;
            $scope.report.witnessesPassport = null;
            document.getElementById("witnessesPassport").placeholder = "";
            $scope.report.witnessesPassportPhoto = null;
            $scope.report.witnessesOther = null;
            document.getElementById("witnessesOther").placeholder = "";
            $scope.report.witnessesOtherPhoto = null;
        } else if (section == 6) {
            $scope.report.waybillNumber = null;
            document.getElementById("waybillNumber").placeholder = "";
            $scope.report.waybillNumberPhoto = null;
            $scope.report.trackingNumber = null;
            document.getElementById("trackingNumber").placeholder = "";
            $scope.report.trackingNumberPhoto = null;
            $scope.report.parcelNumber = null;
            document.getElementById("parcelNumber").placeholder = "";
            $scope.report.parcelNumberPhoto = null;
            $scope.report.customerId = null;
        } else if (section == 7) {
            $scope.report.policeReportMade = 'no';
            $scope.report.policeReportNumber = null;
        }
    }*/

    /*$scope.isAnswer = function (question, value) {
        return $scope.report[question] == value;
    }*/

    $scope.$on('$ionicView.enter', function() {
        /*if (document.getElementById("map_canvas")) {
            var lng = 30.48413177;
            var lat = 50.429544;
            if ($scope.report.googleMapsPosition) {
                var lng = $scope.report.googleMapsPosition.longitude;
                var lat = $scope.report.googleMapsPosition.latitude;
            }
            var mapOptions = {
                center: new google.maps.LatLng(lat, lng),
                zoom: 19,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            try {
                var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                $scope.report.marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: map,
                    title:"You are here"
                });
                google.maps.event.addListener(map, 'click', $scope.onMarkerSet);
            } catch (err) {
                $scope.googleMailErrors = err.message;
                $scope.$apply();
            }
         }*/
    })

    /*$scope.onMarkerSet = function(event) {
        $scope.report.gpsLocation = event.latLng.lat() + ":" + event.latLng.lng();
        $scope.report.marker.setPosition(event.latLng);
        $scope.$apply();
    }*/

    $scope.sendReport = function() {
        var r = $scope.report;
        var dto = {
            incidentNumber: r.incidentNumber,
            date: r.date,
            time: r.time,
            //vehicleNumber: r.vehicleNumber,
            name: r.name,
            dateOfBirth: r.dateOfBirth,
            address: r.address,
            telephoneNumber: r.telephoneNumber,
            //licenseNumber: r.licenseNumber,
            //driverLicensePhoto: r.driverLicensePhoto,
            passport: r.passport,
            passportPhoto: r.passportPhoto,
            otherDocuments: r.otherDocuments,
            otherDocumentsPhoto: r.otherDocumentsPhoto,
            maritalStatus: r.maritalStatus,
            kids: r.kids,
            spouseName: r.spouseName,
            spouseDateOfBirth: r.spouseDateOfBirth,
            spouseAddress: r.spouseAddress,
            spouseTelephoneNumber: r.spouseTelephoneNumber,
            //extraDriverLicenseNumber: r.extraDriverLicenseNumber,
            //extraDriverLicensePhoto: r.extraDriverLicensePhoto,
            spousePassport: r.spousePassport,
            spousePassportPhoto: r.spousePassportPhoto,
            spouseOtherDocuments: r.spouseOtherDocuments,
            spouseOtherDocumentsPhoto: r.spouseOtherDocumentsPhoto,
            /*opponentName: r.opponentName,
            opponentTelephone: r.opponentTelephone,
            opponentLicense: r.opponentLicense,
            opponentLicensePhoto: r.opponentLicensePhoto,
            opponentPassport: r.opponentPassport,
            opponentPassportPhoto: r.opponentPassportPhoto,
            opponentOther: r.opponentOther,
            opponentOtherPhoto: r.opponentOtherPhoto,
            witnessName: r.witnessName,
            witnessesTelephone: r.witnessesTelephone,
            witnessesLicense: r.witnessesLicense,
            witnessesLicensePhoto: r.witnessesLicensePhoto,
            witnessesPassport: r.witnessesPassport,
            witnessesPassportPhoto: r.witnessesOther,
            witnessesOther: r.witnessesOther,
            witnessesOtherPhoto: r.witnessesOtherPhoto,
            waybillNumber: r.waybillNumber,
            waybillNumberPhoto: r.waybillNumberPhoto,
            trackingNumber: r.trackingNumber,
            trackingNumberPhoto: r.trackingNumberPhoto,
            parcelNumber: r.parcelNumber,
            parcelNumberPhoto: r.parcelNumberPhoto,
            customerId: r.customerId,
            policeReportMade: r.policeReportMade,
            policeReportNumber: r.policeReportNumber,
            policeReportNumberPhoto: r.policeReportNumberPhoto,
            gpsLocation: r.gpsLocation,
            whereItHappend: r.whereItHappend,
            locationDescription: r.locationDescription,
            locationPhoto: r.locationPhoto,
            isDriverAtTimeOfIncident: r.isDriverAtTimeOfIncident,
            isExtraDriverAtTimeOfIncident: r.isExtraDriverAtTimeOfIncident,*/
            printdate: r.printdate,
            printtime: r.printtime,
            /*goodsDamaged: r.goodsDamaged,
            truckDamaged: r.truckDamaged,
            wasGoodsDamaged: r.wasGoodsDamaged,
            wasTruckDamaged: r.wasTruckDamaged,
            personalinjuryDescription: r.personalinjuryDescription,
            personalinjuryPhoto: r.personalinjuryPhoto,
            propertyDamagedDescription: r.propertyDamagedDescription,
            propertyDamagedPhoto: r.propertyDamagedPhoto,
            messageText: r.messageText,
            isCallbackRequired: r.isCallbackRequired,
            additionalCallbackNumber: r.additionalCallbackNumber,
            goodsDamage: r.goodsDamage,
            carPics: r.carPics*/
            amount: r.amount,
            primaryIncome: r.primaryIncome,
            primaryIncomeDescription: r.primaryIncomeDescription,
            alternativeIncome: r.alternativeIncome,
            alternativeIncomeDescription: r.alternativeIncomeDescription,
            expenses: r.expenses
        };
        var complaint = new Complaint(dto);
        complaint.$save(function (data) {
            console.log("success " + data.error_message);
            $scope.report.wasSent = true;
            $scope.$broadcast('scroll.resize');
        });
    }

    $scope.exitApp = function() {
        navigator.app.exitApp();
        $scope.wasSent = false;
    }

    $scope.init();
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    ionic.Platform.isFullScreen = true;


  });
})
