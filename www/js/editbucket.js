angular.module('editbucket.controllers', [])

        .controller('EditCtrl', function ($scope, $http, $cordovaDatePicker, $ionicModal, $ionicHistory, $timeout, $ionicPopup, $state, $window, $ionicLoading, $cordovaCamera, $cordovaFileTransfer, $cordovaActionSheet) {

//            Image Code Starts Here
            $scope.image = null;
            $scope.URL = null;
            $scope.editimage = "http://www.thefreespiritproject.org/app/wp-content/uploads/2017/05/demo-150x150.png";
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
                    console.log(JSON.stringify(err));
                });


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
//            Ends Here
            $scope.progress = '';
            $scope.checked = {};
            $scope.record = [];
            $scope.enable = '';
            $scope.PLAN = '';
            $scope.items = [
                {id: 18, label: 'Health'},
                {id: 19, label: 'Sports'},
                {id: 20, label: 'Travel'},
                {id: 21, label: 'Learn'},
                {id: 22, label: 'Career/Wealth'},
                {id: 23, label: 'Relationships'}
            ];
            $scope.options = [
                {id: 0, label: 'Private'},
                {id: 1, label: 'Public'}
            ];
            $scope.selected = '';
            //Alert Function
            $scope.showAlert = function (title, msg) {
                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template: msg
                });
                alertPopup.then(function (res) {
                    if (res)
                    {
                        console.log('Added');
                    }
                });
            };

            $scope.checkItems = {};
            var getData = function ()
            {

                $scope.item = [];
                $scope.arr = [];
                $scope.radio = [];
                $scope.idarr = [];
                $scope.count=0;
                $scope.progress='';
                $scope.BUCKET_ID = localStorage.getItem("LIST_ID");
                //$scope.idvalue=[];
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/edit/v2/bucket';
                //var baseUrl = 'http://localhost/freesprite/wp-json/edit/v2/bucket';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: {bucketId: $scope.BUCKET_ID, userID: localStorage.getItem("uid")}
                };
                $http(req).then(function success(response) {
                    console.log(response.data);
                    $scope.record.ID = response.data['item1']['ID'];
                    $scope.record.title = response.data['item1']['name'];
//                    $scope.selected = response.data['listdata']['cat'];
                    $scope.record.date = response.data['item1']['goal_date'];
                    $scope.record.bucketimage=response.data['item1']['bucketimage'];
                    ///$scope.record.pp = response.data['date_details']['private_/_public'];
                    $scope.item = response.data['item2'];
                    $scope.arr = response.data['item3'];
                    $scope.idarr = response.data['item4'];
                    //Check Complted Bucket Items
                    angular.forEach($scope.arr, function(key, value){
                        if(key==1)
                        {
                            $scope.count=$scope.count+1;
                        }
                    });
                    console.log('COUNt'+$scope.count);
                    if(($scope.count  !='') && ($scope.count !=0))
                    {
                        $scope.progress=($scope.count*100)/response.data['item1']['total_todo'];
                    }else
                    {
                        $scope.progress=0;
                    }
                    //console.log('PROGRESS'+$scope.progress);
                    //console.log($scope.item);
                    //console.log($scope.arr);
                    //Category Dropdown
                    if (response.data['item1']['cat'] == 18)
                    {
                        $scope.record.selected = $scope.items[0];
                    } else if (response.data['item1']['cat'] == 19)
                    {
                        $scope.record.selected = $scope.items[1];
                    } else if (response.data['item1']['cat'] == 20)
                    {
                        $scope.record.selected = $scope.items[2];
                    } else if (response.data['item1']['cat'] == 21)
                    {
                        $scope.record.selected = $scope.items[3];
                    } else if (response.data['item1']['cat'] == 22)
                    {
                        $scope.record.selected = $scope.items[4];
                    } else if (response.data['item1']['cat'] == 23)
                    {
                        $scope.record.selected = $scope.items[5];
                    }
                    //Private Public Dropdowm
                    if (response.data['item1']['pri_pub'] == 'Private')
                    {
                        $scope.record.pp = $scope.options[0];
                    } else if (response.data['item1']['pri_pub'] == 'Public')
                    {
                        $scope.record.pp = $scope.options[1];
                    }
                    //console.log($scope.item);
                },
                        function error(response)
                        {

                        }
                );
            };
            getData();

            //Add Dynamic Form Fileds
            $scope.choices = [{id: 'choice1'}];
            $scope.addFiled = function ()
            {
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
            //Add New To Do
            $scope.addNewTodo = function (bucketID)
            {
                $ionicLoading.show({
                    template: 'Updating...',
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
                    'items': $scope.arrList,
                    'id': bucketID
                };
                //var baseUrl = 'http://localhost/freesprite/wp-json/add/v2/editBucketTodo';
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/add/v2/editBucketTodo';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: $scope.data
                };
                $http(req).then(function success(response) {
                    //console.log(response.data);
                    $ionicLoading.hide();
                    if (response.data == "success") {
                        $scope.showAlert("Success", "<style>.popup {background-color:#33cd5f !important;} .popup-body p{color:#fff !important} .popup-head h3{color:#fff !important} .button{background:#fff !important; color:#000 !important}</style><p>New To Do Successfully added<p/>");
                        $timeout(function () {
                            $window.location.reload(true);
                        });
                    }
                },
                        function error(response) {
                            $ionicLoading.hide();
                        }
                );
            };

            //Update Bucket Items
            $scope.updateBucket = function (data)
            {
                $scope.values = {
                    'id': data.ID,
                    'title': data.title,
                    'category': data.selected['id'],
                    'goaldate': data.date,
                    'pri_pub': data.pp['id'],
                    'bucket_image': $scope.URL
                };
                //var baseUrl = 'http://localhost/freesprite/wp-json/update/v2/updateBucketData';
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/update/v2/updateBucketData';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: $scope.values
                };
                //console.log($scope.values);
                //console.log(data);
                //console.log(data.selected['id']);
                $http(req).then(function success(response) {
                    console.log(response.data);
                    $ionicLoading.hide();
                    if (response.data == "success") {
                        $scope.showAlert("Success", "<style>.popup {background-color:#33cd5f !important;} .popup-body p{color:#fff !important} .popup-head h3{color:#fff !important} .button{background:#fff !important; color:#000 !important}</style><p>New To Do Successfully added<p/>");
                        $timeout(function () {
                            $window.location.reload(true);
                        });
                    }
                },
                        function error(response) {
                            $ionicLoading.hide();
                        }
                );
            };

            //Remove Bucket Items
            $scope.removeTodoItem = function (argID, argBucketId)
            {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Delete Bucket',
                    template: 'Are you sure want to delete this bucket item from your Bucket ?'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        $ionicLoading.show({
                            template: 'Deleting...',
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: 0
                        });
                        var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/delete/v2/buckettodoitem';
                        //var baseUrl = 'http://localhost/freesprite/wp-json/delete/v2/buckettodoitem';
                        var req = {
                            method: 'POST',
                            url: baseUrl,
                            headers: {'Content-Type': "application/x-www-form-urlencoded"},
                            data: {id: argID, bucket: argBucketId}
                        };
                        $http(req).then(function success(response) {
                            console.log(response);
                            $ionicLoading.hide();
                            if (response.data == "success") {
                                $scope.showAlert("Success", "<style>.popup {background-color:#33cd5f !important;} .popup-body p{color:#fff !important} .popup-head h3{color:#fff !important} .button{background:#fff !important; color:#000 !important}</style><p>Bucket Item Deleted Successfully<p/>");
                                $timeout(function () {
                                    $window.location.reload(true);
                                }, 3000);
                            }
                        },
                                function error(response) {
                                    $ionicLoading.hide();
                                }
                        );
                    } else {
                        console.log('You clicked on "Cancel" button');
                    }
                });
            };

            //Update To Do Status
            $scope.updateTodoStatus = function (argID)
            {
                $ionicLoading.show({
                    template: 'Updating...',
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });

                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/update/v2/todocomplete';
                //var baseUrl = 'http://localhost/freesprite/wp-json/update/v2/todocomplete';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: {id: argID}
                };
                $http(req).then(function success(response) {
                    console.log(response.data);
                    $ionicLoading.hide();
                    if (response.data == "success") {
                        $scope.showAlert("Success", "<style>.popup {background-color:#33cd5f !important;} .popup-body p{color:#fff !important} .popup-head h3{color:#fff !important} .button{background:#fff !important; color:#000 !important}</style><p>Congratulations You have competed you bucket item<p/>");
                        $timeout(function () {
                            $window.location.reload(true);
                        }, 3000);
                    }
                },
                        function error(response) {
                            $ionicLoading.hide();
                        }
                );
            };
        });


