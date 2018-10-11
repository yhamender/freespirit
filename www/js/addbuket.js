angular.module('addbuket.controllers', ["ion-datetime-picker"])

        .controller('AddBucket', function ($scope, $http, $cordovaDatePicker, $ionicModal, $timeout, $ionicPopup, $state, $window, $cordovaCamera, $cordovaFileTransfer, $cordovaActionSheet, $ionicLoading) {

            //File Upload Code Starts Here
    $scope.dateValue = new Date();
            $scope.image = null;
            $scope.URL = null;
            $scope.editimage = "http://www.thefreespiritproject.org/app/wp-content/uploads/2017/05/demo-150x150.png";
            $scope.PLAN = '';
            $scope.PLAN_TEXT = '';
            $scope.PLAN_COUNT = '';
            $scope.BUCKET_COUNT = '';
            $scope.VALUE_COUNT = '';
            $scope.enable = '';
            $scope.tab='';
            //Set Default Checkbox
            $scope.category = 18;
            $scope.takepic = function () {
                var actionSheetOptions = {
                    title: 'Select a picture',
                    buttonLabels: ['Camera', 'Choose from gallery'],
                    addCancelButtonWithLabel: 'Cancel',
                    androidEnableCancelButton: true
                };
                $cordovaActionSheet.show(actionSheetOptions).then(function (btnIndex) {
                    var index = btnIndex;
                    if (index == 2) {
                        $scope.cameraFunc(Camera.PictureSourceType.PHOTOLIBRARY)
                    } else if (index == 1) {
                        $scope.cameraFunc(Camera.PictureSourceType.CAMERA)
                    }
                });
            };

            $scope.cameraFunc = function (picType) {
                var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: picType,
                    allowEdit: false,
                    encodingType: 0,
                    targetWidth: 600,
                    targetHeight: 500,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false,
                    correctOrientation: true
                }
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.editimage = "data:image/jpeg;base64," + imageData;
                    $scope.URL = imageData;
                }, function (err) {
                    console.log(JSON.stringify(err))
                })


            };

            $scope.choosepic = function () {
                var options = {
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: Camera.DestinationType.FILE_URI,
                    quality: 400,
                    targetWidth: 400,
                    targetHeight: 400,
                    encodingType: Camera.EncodingType.JPEG,
                    correctOrientation: true
                };
                $cordovaCamera.getPicture(options).then(function (imageURI) {
                    // var image = document.getElementById('myImage');
                    $scope.imgURI = "data:image/jpeg;base64," + imageURI;
                    $scope.URL = imageURI;
                    // $scope.image.push($scope.imgURI);
                    //  image.src = imageURI;
                }, function (err) {
                    // error
                });
            };

            //Alert Function
            $scope.showAlert = function (title, msg) {
                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template: msg
                });
                alertPopup.then(function (res) {
                    //console.log('Error Login');
                });
            };

            //Add Dynamically Forms Filed
            $scope.choices = [{id: 'choice1'}];
            $scope.addFiled = function () {
                var newItemNo = $scope.choices.length + 1;
                if (newItemNo != 5) {
                    $scope.choices.push({'id': 'choice' + newItemNo});
                } else {
                    $scope.showAlert("Error", "<style>.popup {background-color:#fff !important;} .popup-body p{color:#136B7C !important} .popup-head h3{color:#136B7C !important} .button{background:#136B7C !important; color:#fff !important}</style><p>Maximum limit reached !<p/>");
                }
            };

            //Remove Fileds
            $scope.removeFiled = function () {
                var lastItem = $scope.choices.length - 1;
                if (lastItem != 0) {
                    $scope.choices.splice(lastItem);
                }
            };

            //My Bucket List Item
            var mybucketlist = function () {
                //alert('this is called');
                $scope.mybucketdata = [];
                $scope.USERID = localStorage.getItem('uid');
                //var baseUrl = 'http://studio-tesseract.co/freesprite/wp-json/add/v2/bucket';
                //var baseUrl = 'http://studio-tesseract.co/freesprite/wp-json/get/v2/mybucketlist';
                $ionicLoading.show({
                    template: 'Loading....',
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                //var baseUrl = 'http://localhost/freesprite/wp-json/get/v2/mybucketlist';
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/mybucketlist';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: {id: $scope.USERID}
                };
                $http(req).then(function success(response) {
                    console.log(response.data);
                    $ionicLoading.hide();
                    $scope.mybucketdata = response.data;
                },
                        function error(response) {
                            $ionicLoading.hide();
                        }
                );

            };
            mybucketlist();

            //Save Idea Function Starts Here
            $scope.saveIdea = function (form, record) {
                if (form.$valid) {
                    // Setup the loader
                    $ionicLoading.show({
                        template: 'Saving...',
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    $scope.arrList = [];
                    $scope.leng = $scope.choices.length;
                    for (i = 0; i < $scope.leng; i++) {
                        $scope.arrList.push($scope.choices[i]['list'])
                    }
                    $scope.data = {
                        'author': localStorage.getItem("uid"),
                        'cat': record['category'],
                        'name': record['gname'],
                        'date': record['gdate'],
                        'budget': (record['budget'] != '') ? record['budget'] : '',
                        'pripub': record['gpubprivat'],
                        'items': $scope.arrList,
                        'profile_image': $scope.URL
                    };
                    console.log($scope.data);
//                console.log($scope.choices[0]['list']);
//                console.log(record);
                    var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/add/v2/bucket';
                    //var baseUrl = 'http://localhost/freesprite/wp-json/add/v2/bucket';
                    var req = {
                        method: 'POST',
                        url: baseUrl,
                        headers: {'Content-Type': "application/x-www-form-urlencoded"},
                        data: $scope.data
                    };
                    $http(req).then(function success(response) {
                        console.log(response.data);
                        $ionicLoading.hide();
                        if (response.data == "success") {
                            $scope.showAlert("Success", "<style>.popup {background-color:#33cd5f !important;} .popup-body p{color:#fff !important} .popup-head h3{color:#fff !important} .button{background:#fff !important; color:#000 !important}</style><p>Bucket Added Successfully<p/>");
                            $timeout(function () {
                                $window.location.reload(true);
                            });
                        } else {
                            $scope.showAlert("Error", "<style>.popup {background-color:#ef473a !important;} .popup-body p{color:#fff !important} .popup-head h3{color:#fff !important} .button{background:#fff !important; color:#000 !important}</style><p>Error in Adding<p/>");
                        }
                    },
                            function error(response) {

                            }
                    );
                }
            };

            //Get List Data
            $scope.getListData = function (argID) {
                //alert(argID);
                localStorage.setItem('categoryid', argID);
                $state.go('app.bucketlist');
            };

            //Get Data Function Starts Here
            $scope.getData = function (argID) {
                localStorage.setItem('LIST_ID', argID);
                //$window.location.reload(true);
                $state.go('app.editbucket');
            };


            //Get User Plan
            $scope.checkplan = function () {
                $scope.USER_SESSID = localStorage.getItem("uid");
                //var baseUrl = 'http://studio-tesseract.co/freesprite/wp-json/add/v2/bucket';
                //var baseUrl = 'http://studio-tesseract.co/freesprite/wp-json/get/v2/userplan';
                //var baseUrl = 'http://localhost/freesprite/wp-json/get/v2/userplan';
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/userplan';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: {id: $scope.USER_SESSID}
                };
                $http(req).then(function success(response) {
                    //console.log(response.data);
                    $scope.PLAN = response.data;
                    //alert($scope.PLAN);
                    if ($scope.PLAN == 1) {
                        $scope.PLAN_TEXT = 'Basic';
                        $scope.enable = false;
                        $scope.PLAN_COUNT = 100;
                        $scope.tab=false;
                    } else if ($scope.PLAN == 2) {
                        $scope.PLAN_TEXT = 'Pro';
                        $scope.enable = true;
                        $scope.PLAN_COUNT = 200;
                    } else if ($scope.PLAN == 3) {
                        $scope.PLAN_TEXT = 'Premium';
                        $scope.enable = true;
                        $scope.PLAN_COUNT = 300;
                    }
                },
                        function error(response) {

                        }
                );
            };
            ///////////////////////////////////USER BUCKET COUNT///////////////////////

            $scope.getUserBucketCount = function () {
                $scope.USER_SESSID = localStorage.getItem("uid");
                //var baseUrl = 'http://studio-tesseract.co/freesprite/wp-json/add/v2/bucket';
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/bucketcount';
                //var baseUrl = 'http://localhost/freesprite/wp-json/get/v2/mybucketlist';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: {id: $scope.USER_SESSID}
                };
                $http(req).then(function success(response) {
                    $scope.VALUE_COUNT = response.data;
                },
                        function error(response) {

                        }
                );
            };

            ///////////////////////////////////datepicker///////////////////////
            $scope.datepicker = function () {
                console.log("datapic")
                var options = {
                    date: new Date(),
                    mode: 'date', // or 'time'
                    minDate: new Date() - 10000,
                    allowOldDates: true,
                    allowFutureDates: false,
                    doneButtonLabel: 'DONE',
                    doneButtonColor: '#F2F3F4 ',
                    cancelButtonLabel: 'CANCEL',
                    cancelButtonColor: '#000000 '
                };

                $cordovaDatePicker.show(options).then(function (date) {
                    alert(date);
                    console.log("data=======" + JSON.stringify(date));
                });
            };

            //Delete Bucket Items functiion starts here..
            $scope.delete_bucket = function (argID) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Delete Bucket',
                    template: 'Are you sure want to delete this bucket from your list ?'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/delete/v2/bucketpost';
                        //var baseUrl = 'http://localhost/freesprite/wp-json/delete/v2/bucketpost';
                        var req = {
                            method: 'POST',
                            url: baseUrl,
                            headers: {'Content-Type': "application/x-www-form-urlencoded"},
                            data: {id: argID}
                        };
                        $http(req).then(function success(response) {
                            console.log(response);
                            $scope.showAlert("Success", "<style>.popup {background-color:#33cd5f !important;} .popup-body p{color:#fff !important} .popup-head h3{color:#fff !important} .button{background:#fff !important; color:#000 !important}</style><p>Bucket Deleted Successfully<p/>");
                            $timeout(function () {
                                $window.location.reload(true);
                            }, 2000);
                        },
                                function error(response) {
                                }
                        );
                    } else {
                        console.log('You clicked on "Cancel" button');
                    }
                });
            };
            
            $scope.changePlan=function()
            {
                $state.go('app.changeuserplan');
            };

        })
        .directive("ionDatetimePicker", function () {
            return {
                restrict: "AE",
                require: "ngModel",
                scope: {
                    modelDate: "=ngModel",
                    title: "=?",
                    subTitle: "=?",
                    buttonOk: "=?",
                    buttonCancel: "=?",
                    monthStep: "=?",
                    hourStep: "=?",
                    minuteStep: "=?",
                    secondStep: "=?",
                    onlyValid: "=?"
                },
                controller: function ($scope, $ionicPopup, $ionicPickerI18n, $timeout) {
                    $scope.i18n = $ionicPickerI18n;
                    $scope.bind = {};

                    $scope.rows = [0, 1, 2, 3, 4, 5];
                    $scope.cols = [1, 2, 3, 4, 5, 6, 7];
                    $scope.weekdays = [0, 1, 2, 3, 4, 5, 6];

                    var lastDateSet = {
                        year: $scope.year,
                        month: $scope.month,
                        day: $scope.day,
                        hour: $scope.hour,
                        minute: $scope.minute,
                        second: $scope.second,
                        date: new Date(),
                        getDateWithoutTime: function () {
                            var tempDate = new Date(this.date);
                            tempDate.setHours(0, 0, 0, 0, 0);
                            return tempDate;
                        }
                    };

                    $scope.showPopup = function () {
                        $ionicPopup.show({
                            templateUrl: "lib/ion-datetime-picker/src/picker-popup.html",
                            title: $scope.title || ("Pick " + ($scope.dateEnabled ? "a date" : "") + ($scope.dateEnabled && $scope.timeEnabled ? " and " : "") + ($scope.timeEnabled ? "a time" : "")),
                            subTitle: $scope.subTitle || "",
                            scope: $scope,
                            cssClass: 'ion-datetime-picker-popup',
                            buttons: [
                                {
                                    text: $scope.buttonOk || $scope.i18n.ok,
                                    type: $scope.i18n.okClass,
                                    onTap: function () {
                                        $scope.commit();
                                    }
                                }, {
                                    text: $scope.buttonCancel || $scope.i18n.cancel,
                                    type: $scope.i18n.cancelClass,
                                    onTap: function () {
                                        $timeout(function () {
                                            $scope.processModel();
                                        }, 200);
                                    }
                                }
                            ]
                        });
                    };

                    $scope.prepare = function () {
                        if ($scope.mondayFirst) {
                            $scope.weekdays.push($scope.weekdays.shift());
                        }
                    };

                    $scope.processModel = function () {
                        var date = $scope.modelDate instanceof Date ? $scope.modelDate : new Date();
                        $scope.year = $scope.dateEnabled ? date.getFullYear() : 0;
                        $scope.month = $scope.dateEnabled ? date.getMonth() : 0;
                        $scope.day = $scope.dateEnabled ? date.getDate() : 0;
                        $scope.hour = $scope.timeEnabled ? date.getHours() : 0;
                        $scope.minute = $scope.timeEnabled ? date.getMinutes() : 0;
                        $scope.second = $scope.secondsEnabled ? date.getSeconds() : 0;

                        changeViewData();
                    };

                    function setNextValidDate(date, dayToAdd) {
                        dayToAdd = dayToAdd || 0;
                        if (dayToAdd !== 0) {
                            date.setDate(date.getDate() + dayToAdd);
                        }

                        lastDateSet.year = date.getFullYear();
                        lastDateSet.month = date.getMonth();
                        lastDateSet.day = date.getDate();
                        lastDateSet.hour = date.getHours();
                        lastDateSet.minute = date.getMinutes();
                        lastDateSet.second = date.getSeconds();
                        lastDateSet.date = date;

                    }

                    function setLastValidDate() {
                        var date = new Date($scope.year, $scope.month, $scope.day, $scope.hour, $scope.minute, $scope.second);
                        if ($scope.isEnabled(date.getDate(), true)) {
                            setNextValidDate(date);
                        } else {
                            $scope.year = lastDateSet.year;
                            $scope.month = lastDateSet.month;
                            $scope.day = lastDateSet.day;
                            $scope.hour = lastDateSet.hour;
                            $scope.minute = lastDateSet.minute;
                            $scope.second = lastDateSet.second;
                        }
                    }

                    var changeViewData = function () {
                        setLastValidDate();
                        var date = new Date($scope.year, $scope.month, $scope.day, $scope.hour, $scope.minute, $scope.second);

                        if ($scope.dateEnabled) {
                            $scope.year = date.getFullYear();
                            $scope.month = date.getMonth();
                            $scope.day = date.getDate();

                            $scope.bind.year = $scope.year;
                            $scope.bind.month = $scope.month;

                            $scope.firstDay = new Date($scope.year, $scope.month, 1).getDay();
                            if ($scope.mondayFirst) {
                                $scope.firstDay = ($scope.firstDay || 7) - 1;
                            }
                            $scope.daysInMonth = getDaysInMonth($scope.year, $scope.month);
                        }

                        if ($scope.timeEnabled) {
                            $scope.hour = date.getHours();
                            $scope.minute = date.getMinutes();
                            $scope.second = date.getSeconds();
                            $scope.meridiem = $scope.hour < 12 ? "AM" : "PM";

                            $scope.bind.hour = $scope.meridiemEnabled ? ($scope.hour % 12 || 12).toString() : $scope.hour.toString();
                            $scope.bind.minute = ($scope.minute < 10 ? "0" : "") + $scope.minute.toString();
                            $scope.bind.second = ($scope.second < 10 ? "0" : "") + $scope.second.toString();
                            $scope.bind.meridiem = $scope.meridiem;
                        }
                    };

                    var getDaysInMonth = function (year, month) {
                        return new Date(year, month + 1, 0).getDate();
                    };

                    $scope.changeBy = function (value, unit) {
                        if (+value) {
                            // DST workaround
                            if ((unit === "hour" || unit === "minute") && value === -1) {
                                var date = new Date($scope.year, $scope.month, $scope.day, $scope.hour - 1, $scope.minute);
                                if (($scope.minute === 0 || unit === "hour") && $scope.hour === date.getHours()) {
                                    $scope.hour--;
                                }
                            }
                            $scope[unit] += +value;
                            if (unit === "month" || unit === "year") {
                                $scope.day = Math.min($scope.day, getDaysInMonth($scope.year, $scope.month));
                            }
                            changeViewData();
                        }
                    };
                    $scope.change = function (unit) {
                        var value = $scope.bind[unit];
                        if (value && unit === "meridiem") {
                            value = value.toUpperCase();
                            if (value === "AM" && $scope.meridiem === "PM") {
                                $scope.hour -= 12;
                            } else if (value === "PM" && $scope.meridiem === "AM") {
                                $scope.hour += 12;
                            }
                            changeViewData();
                        } else if (+value || +value === 0) {
                            $scope[unit] = +value;
                            if (unit === "month" || unit === "year") {
                                $scope.day = Math.min($scope.day, getDaysInMonth($scope.year, $scope.month));
                            }
                            changeViewData();
                        }
                    };
                    $scope.changeDay = function (day) {
                        $scope.day = day;
                        changeViewData();
                    };

                    function createDate(stringDate) {
                        var date = new Date(stringDate);
                        var isInvalidDate = isNaN(date.getTime());
                        if (isInvalidDate) {
                            date = new Date();//today
                        }
                        date.setHours(0, 0, 0, 0, 0);
                        return date;
                    }

                    $scope.isEnabled = function (day, computeNextValidDate) {
                        if (!$scope.onlyValid) {
                            return true;
                        }

                        var currentDate = new Date($scope.year, $scope.month, day);
                        var constraints = $scope.onlyValid;
                        if (!(constraints instanceof Array)) {
                            constraints = [constraints];
                        }

                        var isValid = true;
                        for (var i = 0; i < constraints.length; i++) {
                            var currentRule = constraints[i];

                            if (currentRule.after) {

                                var afterDate = createDate(currentRule.after);
                                if (currentRule.inclusive) {
                                    isValid = currentDate >= afterDate;
                                    if (!isValid && computeNextValidDate)
                                        setNextValidDate(afterDate, 0);
                                } else {
                                    isValid = currentDate > afterDate;
                                    if (!isValid && computeNextValidDate)
                                        setNextValidDate(afterDate, 1);
                                }

                            } else
                            if (currentRule.before) {

                                var beforeDate = createDate(currentRule.before);

                                if (currentRule.inclusive) {
                                    isValid = currentDate <= beforeDate;
                                    if (!isValid && computeNextValidDate)
                                        setNextValidDate(beforeDate, 0);
                                } else {
                                    isValid = currentDate < beforeDate;
                                    if (!isValid && computeNextValidDate)
                                        setNextValidDate(beforeDate, -1);
                                }

                            } else
                            if (currentRule.between) {

                                var initialDate = createDate(currentRule.between.initial);
                                var finalDate = createDate(currentRule.between.final);

                                if (currentRule.inclusive) {
                                    isValid = currentDate >= initialDate && currentDate <= finalDate;
                                    if (!isValid && computeNextValidDate) {
                                        if (currentDate < initialDate)
                                            setNextValidDate(initialDate, 0);
                                        if (currentDate > finalDate)
                                            setNextValidDate(finalDate, 0);
                                    }
                                } else {
                                    isValid = currentDate > initialDate && currentDate < finalDate;
                                    if (!isValid && computeNextValidDate) {
                                        if (currentDate <= initialDate)
                                            setNextValidDate(initialDate, 1);
                                        if (currentDate >= finalDate)
                                            setNextValidDate(finalDate, -1);
                                    }
                                }

                            } else
                            if (currentRule.outside) {

                                var initialDate = createDate(currentRule.outside.initial);
                                var finalDate = createDate(currentRule.outside.final);

                                if (currentRule.inclusive) {
                                    isValid = currentDate <= initialDate || currentDate >= finalDate;
                                    if (!isValid && computeNextValidDate) {
                                        var lastValidDate = lastDateSet.getDateWithoutTime();
                                        if (lastValidDate <= initialDate)
                                            setNextValidDate(finalDate, 0);
                                        if (lastValidDate >= finalDate)
                                            setNextValidDate(initialDate, 0);
                                    }
                                } else {
                                    isValid = currentDate < initialDate || currentDate > finalDate;
                                    if (!isValid && computeNextValidDate) {
                                        var lastValidDate = lastDateSet.getDateWithoutTime();
                                        if (lastValidDate < initialDate)
                                            setNextValidDate(finalDate, 1);
                                        if (lastValidDate > finalDate)
                                            setNextValidDate(initialDate, -1);
                                    }
                                }

                            }

                            if (!isValid) {
                                break;
                            }
                        }

                        return isValid

                    };
                    $scope.changed = function () {
                        changeViewData();
                    };

                    if ($scope.dateEnabled) {
                        $scope.$watch(function () {
                            return new Date().getDate();
                        }, function () {
                            var today = new Date();
                            $scope.today = {
                                day: today.getDate(),
                                month: today.getMonth(),
                                year: today.getFullYear()
                            };
                        });
                        //                    $scope.goToToday = function() {
                        //                        $scope.year = $scope.today.year;
                        //                        $scope.month = $scope.today.month;
                        //                        $scope.day = $scope.today.day;
                        //
                        //                        changeViewData();
                        //                    };
                    }
                },
                link: function ($scope, $element, $attrs, ngModelCtrl) {
                    $scope.dateEnabled = "date" in $attrs && $attrs.date !== "false";
                    $scope.timeEnabled = "time" in $attrs && $attrs.time !== "false";
                    if ($scope.dateEnabled === false && $scope.timeEnabled === false) {
                        $scope.dateEnabled = $scope.timeEnabled = true;
                    }

                    $scope.mondayFirst = "mondayFirst" in $attrs && $attrs.mondayFirst !== "false";
                    $scope.secondsEnabled = $scope.timeEnabled && "seconds" in $attrs && $attrs.seconds !== "false";
                    $scope.meridiemEnabled = $scope.timeEnabled && "amPm" in $attrs && $attrs.amPm !== "false";

                    $scope.monthStep = +$scope.monthStep || 1;
                    $scope.hourStep = +$scope.hourStep || 1;
                    $scope.minuteStep = +$scope.minuteStep || 1;
                    $scope.secondStep = +$scope.secondStep || 1;

                    $scope.prepare();

                    ngModelCtrl.$render = function () {
                        $scope.modelDate = ngModelCtrl.$viewValue;
                        $scope.processModel();
                    };

                    $scope.commit = function () {
                        $scope.modelDate = new Date($scope.year, $scope.month, $scope.day, $scope.hour, $scope.minute, $scope.second);
                        ngModelCtrl.$setViewValue($scope.modelDate);
                    };

                    $element.on("click", $scope.showPopup);
                }
            };
        });