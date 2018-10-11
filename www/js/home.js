angular.module('home.controllers', [])

        .controller('HomeCtrl', function ($scope, $http, $ionicModal, $ionicHistory, $timeout, $ionicPopup, $state, $window, $ionicLoading, $cordovaCamera, $ionicLoading) {

//            $ionicLoading.show({
//                content: 'Loading',
//                animation: 'fade-in',
//                showBackdrop: true,
//                maxWidth: 200,
//                showDelay: 0
//            });
            $scope.bucket = [];
            $scope.following = [];
            $scope.openModal = function () {
                // Create the intro modal that we will use later
                $ionicModal.fromTemplateUrl('templates/modal.html', {
                    scope: $scope
                }).then(showModal);
            };

            function showModal(modal) {
                $scope.modal = modal;
                // Open the intro modal
                $scope.modal.show();
            }

            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            $scope.record = function (argID)
            {
                $scope.userimage = '';
                $scope.numlimit = 15;
                if (argID != '')
                {
                    $scope.modal.hide();
                    $ionicLoading.show({
                        template: 'Loading...',
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    //var baseUrl = 'http://localhost/freesprite/wp-json/get/v2/getbucketItems';
                    var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/getbucketItems';
                    var req = {
                        method: 'POST',
                        url: baseUrl,
                        headers: {'Content-Type': "application/x-www-form-urlencoded"},
                        data: {text: 'filter', id: argID}
                    };
                    $http(req).then(function success(response) {
                        $ionicLoading.hide();
                        ///console.log(response.data['id']);

                        $scope.bucket = response.data;
                        ///$scope.values=getUserHomeBucket(response.data['id']);
                        ////console.log($scope.values);

                    },
                            function error(response)
                            {
                                $ionicLoading.hide();
                            }
                    );
                } else
                {
                    //alert('called');
                    // Setup the loader
                    $ionicLoading.show({
                        template: 'Loading...',
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    //var baseUrl = 'http://localhost/freesprite/wp-json/get/v2/getbucketItems';
                    var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/getbucketItems';
                    var req = {
                        method: 'POST',
                        url: baseUrl,
                        headers: {'Content-Type': "application/x-www-form-urlencoded"},
                        data: {text: 'Nofilter'}
                    };
                    $http(req).then(function success(response) {
                        $ionicLoading.hide();

                        //console.log(response.data[0]['id']);
                        $scope.bucket = response.data;
                        //$scope.values=$scope.getUserHomeBucket(response.data[0]['id']);
                        ///console.log($scope.bucket.id);
                        console.log($scope.bucket);
                    },
                            function error(response)
                            {
                                $ionicLoading.hide();
                            }
                    );
                }
            };

            //get user bucket
            $scope.getUserBucket = function (argID)
            {
                $state.go('app.bucketbyuser', {userid: argID});
            };

            //record();
            var getPostLikes = function ()
            {
                $scope.postlikes = [];
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/postlikes';
                //var baseUrl = 'http://localhost/freesprite/wp-json/get/v2/affilatelinks';
                var req = {
                    method: 'GET',
                    url: baseUrl,
                    headers: {'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/json; charset=utf-8'},
                    data: {id: $scope.USERID}
                };

                $http(req).then(function success(response) {
                    //console.log(response.data);
                    $scope.postlikes = response.data;
                },
                        function error(response)
                        {

                        }
                );
            };
            getPostLikes();
            //Do Refresh Fuction Starts Here
            $scope.doRefresh = function () {
                //var baseUrl = 'http://localhost/freesprite/wp-json/get/v2/inspirationdata';
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/getbucketItems';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/json; charset=utf-8'}
                };
                $http(req).then(function success(response) {
                    $scope.bucket = response.data;
                })
                        .finally(function () {
                            // Stop the ion-refresher from spinning
                            $scope.$broadcast('scroll.refreshComplete');
                        });
            };

            //Get Data Function
            $scope.getData = function (argID) {
                //alert(argID);
                localStorage.setItem('listId', argID);
//                $timeout(function () {
//                    $window.location.reload(true);
//                });
                $state.go('app.listdetail');
            };

            //Get Selected List Of Profile Post
            $scope.getFollowingListPost = function ()
            {
                $scope.USER_ID = localStorage.getItem("uid");
                $scope.following = [];
                ///$scope.catId = argID;
                //var baseUrl = 'http://localhost/freesprite/wp-json/getBucketList/v2/cat';
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/cat';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: {id: localStorage.getItem("uid")}
                };
                $http(req).then(function success(response) {
                    console.log(response.data);
                    $scope.following = response.data;
                },
                        function error(response)
                        {

                        }
                );
            };

            //Go to Profile
            $scope.goToProfile = function (argID)
            {
                localStorage.setItem('userID', argID);
                //$window.location.reload(true);
                $state.go('app.userprofile');
            };

            //Sort Data Function Starts Here;
            $scope.sortData = function (data)
            {
                console.log(data);
                $scope.modal.hide();
            };

            //Redirect To the Bucket Comment Post
            $scope.commentBuccket = function (argID)
            {
                //console.log(argID);
                $state.go('app.bucketcomment', {bucketId: argID});
                $timeout(function () {
                    $window.location.reload(true);
                });
            };
            
            

            //Like Post Code Starts Here
//            $scope.likePost = function (argID)
//            {
//                var element = angular.element(document.querySelector('.like' + argID));
//                element.addClass('unlike' + argID);
//                element.removeClass('like' + argID);
//            };
        }).directive('myevent', function ($http, $window, $timeout) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            //scope.flag=1;
            var id = scope.$eval(attrs.bucketId);
            var classText = attrs.anotherParam;
            element.bind('click', function () {
                console.log(id);
                console.log(classText);
                if ((classText) == "like" + id)
                {
                    var record = {
                        'id': id,
                        'userid': localStorage.getItem('uid')
                    };
                    //console.log(record);
                    $http.post('http://www.thefreespiritproject.org/app/wp-json/add/v2/like', record).then(function (result) {
                        console.log(result);
                        if (result)
                        {
                            $timeout(function () {
                                $window.location.reload(true);
                            });
                        }
                    }, function (result) {
                        alert("Error: No data returned");
                    });
                } else if ((classText) == "unlike" + id)
                {
                    var record = {
                        'id': id,
                        'userid': localStorage.getItem('uid')
                    };
                    $http.post('http://www.thefreespiritproject.org/app/wp-json/add/v2/unlike', record).then(function (result) {
                        console.log(result);
                        if (result)
                        {
                            $timeout(function () {
                                $window.location.reload(true);
                            });
                        }
                    }, function (result) {
                        alert("Error: No data returned");
                    });
                }
            });
        }
    };
})
        .controller('BucketCommentCtrl', function ($scope, $http, $ionicModal, $ionicHistory, $timeout, $ionicPopup, $state, $window, $ionicLoading, $cordovaCamera, $ionicLoading, $stateParams) {

            //Get Comments
            var getComment = function ()
            {
                $ionicLoading.show({
                    template: 'Loading...',
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                $scope.comments = [];
                $scope.listID = $stateParams.bucketId;
                $scope.userID = localStorage.getItem("uid");
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/comment';
                //var baseUrl = 'http://localhost/freesprite/wp-json/get/v2/comment';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: {userid: $scope.userID, postID: $scope.listID}
                }
                $http(req).then(function success(response) {
                    $ionicLoading.hide();
                    console.log(response.data);
                    $scope.comments = response.data;
                },
                        function error(response)
                        {

                        }
                );
            };
            getComment();

            //Add Comment Script Starts Here...
            $scope.submitComment = function (form, data)
            {
                if (form.$valid)
                {
                    $ionicLoading.show({
                        template: 'Saving...',
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    ///alert('Siddhant Kulshreshtha');
                    $scope.listID = $stateParams.bucketId;
                    $scope.userID = localStorage.getItem("uid");
                    $scope.user = localStorage.getItem("username");
                    //alert('ListID'+$scope.listID+'User ID'+$scope.userID);
                    var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/add/v2/comment';
                    //var baseUrl = 'http://studio-tesseract.co/freesprite/wp-json/getBucketList/v2/cat';
                    var req = {
                        method: 'POST',
                        url: baseUrl,
                        headers: {'Content-Type': "application/x-www-form-urlencoded"},
                        data: {userid: $scope.userID, postID: $scope.listID, comment: data['chat']}
                    }
                    $http(req).then(function success(response) {
                        //console.log(response.data);
                        $ionicLoading.hide();
                        $scope.listData = response.data;
                        $timeout(function () {
                            $window.location.reload(true);
                        });
                    },
                            function error(response)
                            {

                            }
                    );
//                    $scope.html = angular.element(document.querySelector('#text'));
//                    $scope.html.append('<ion-item class="user-info">'+
//                            '<img class="user-avatar" src="http://placehold.it/550x550" />'+
//                            '<div class="user-comment">'+
//                            '<h4>'+$scope.user+'</h4>'+
//                            '<p>'+ data['chat'] +' <span class="positive" style="float:right"></span></p>'+
//                            '</div>'+
//                            '</ion-item>');
                }
            };

            //Remove Comment FUnction Starts Here
            $scope.removeComment = function (argID)
            {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm Delete',
                    template: 'Are you sure you want to delete this comment !'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        $scope.USER_SESSID = localStorage.getItem("uid");
                        var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/remove/v2/comment';
                        //var baseUrl = 'http://localhost/freesprite/wp-json/add/v2/custombucket';
                        var req = {
                            method: 'POST',
                            url: baseUrl,
                            headers: {'Content-Type': "application/x-www-form-urlencoded"},
                            data: {commentID: argID}
                        };
                        $http(req).then(function success(response) {
                            if (response.data == "success")
                            {
                                $timeout(function () {
                                    $window.location.reload(true);
                                });
                            } else
                            {
                                $scope.showAlert("Error", "<style>.popup {background-color:#fff !important;} .popup-body p{color:#136B7C !important} .popup-head h3{color:#136B7C !important} .button{background:#136B7C !important; color:#fff !important}</style><p>Error in Removing !<p/>");
                            }
                        },
                                function error(response)
                                {

                                }
                        );
                    } else {
                        console.log('You clicked on "Cancel" button');
                    }
                });
            };

            //Remover Back function
            $scope.back = function ()
            {
                $state.go('app.home');
                $timeout(function () {
                    $window.location.reload(true);
                });
            };
        })
        .controller('BucketByUserCtrl', function ($scope, $http, $ionicModal, $ionicHistory, $timeout, $ionicPopup, $state, $window, $ionicLoading, $cordovaCamera, $ionicLoading, $stateParams) {

            var getUserBucket = function ()
            {
                $scope.userbucket=[];
                $ionicLoading.show({
                    template: 'Loading...',
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                $scope.userid=$stateParams.userid;
                $scope.count='';
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/bucketbyuser';
                //var baseUrl = 'http://localhost/freesprite/wp-json/get/v2/comment';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: {userid: $scope.userid}
                }
                $http(req).then(function success(response) {
                    $ionicLoading.hide();
                    $scope.userbucket=response.data;
                    console.log(response.data);
                },
                        function error(response)
                        {
                            $ionicLoading.hide();
                        }
                );
            };
            getUserBucket();
        });