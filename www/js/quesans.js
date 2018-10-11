angular.module('quesans.controllers', [])

        .controller('QuesCtrl', function ($scope, $http, $ionicModal, $ionicHistory, $timeout, $ionicPopup, $state, $window, $ionicLoading) {

            $scope.ID = localStorage.getItem("uid");
            var values = function ()
            {
                $scope.ques = [];
                $scope.QuesId = localStorage.getItem("questionID");
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/get/v2/singleQuestion';
                //var baseUrl = 'http://localhost/freesprite/wp-json/get/v2/singleQuestion';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: {id: $scope.QuesId}
                };

                $http(req).then(function success(response) {
                    //console.log(response.data);
                    $scope.ques = response.data;
                },
                        function error(response)
                        {

                        }
                );
            };
            values();

            //Submit Answer Function Starts Here
            $scope.answerQuestion = function (form, data)
            {
                if (form.$valid)
                {
                    var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/add/v2/singleQuestionAnwer';
                    //var baseUrl = 'http://localhost/freesprite/wp-json/add/v2/singleQuestionAnwer';
                    var req = {
                        method: 'POST',
                        url: baseUrl,
                        headers: {'Content-Type': "application/x-www-form-urlencoded"},
                        data: {ques_id: $scope.QuesId, user_id: localStorage.getItem("uid"), ans: data['answer']}
                    };

                    $http(req).then(function success(response) {
                        var myEl = angular.element(document.querySelector('#myList'));
                        myEl.append('<div class="category-items padding item-text-wrap" ng-repeat="y in answer">' +
                                '<div class="row">' +
                                '<div class="col"><img src="img/user.svg" height="50" width="50" alt="user.svg" /></div>' +
                                '<div class="col col-50">' + data['answer'] + '</div>' +
                                '<div class="col col-25">' +
                                '<button class="button ion-close button-assertive" ng-if="y.user_id == ID" ng-click="deletePersonelComments(argID)" style="float:right !important"> </button>' +
                                '</div>' +
                                '</div>' +
                                '</div>');
                    },
                            function error(response)
                            {

                            }
                    );
                }
            };

            //Get Comments
            var comments = function ()
            {
                $scope.answer = [];
                var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/select/v2/answers';
                //var baseUrl = 'http://localhost/freesprite/wp-json/select/v2/answers';
                var req = {
                    method: 'POST',
                    url: baseUrl,
                    headers: {'Content-Type': "application/x-www-form-urlencoded"},
                    data: {id: $scope.QuesId}
                };

                $http(req).then(function success(response) {
                    console.log(response.data);
                    $scope.answer = response.data;
                },
                        function error(response)
                        {

                        }
                );
            };
            comments();

            //Delete Comments 
            $scope.deletePersonelComments = function (argID)
            {
                //alert(argID);
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm Delete',
                    template: 'Are you sure you want to delete this Comment !'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        // Setup the loader
                        $ionicLoading.show({
                            template: 'Removing...',
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: 0
                        });
                        var baseUrl = 'http://www.thefreespiritproject.org/app/wp-json/remove/v2/delete_personel_comment';
                        var req = {
                            method: 'POST',
                            url: baseUrl,
                            headers: {'Content-Type': "application/x-www-form-urlencoded"},
                            data: {id: argID}
                        };

                        $http(req).then(function success(response) {
                            $ionicLoading.hide();
                            console.log(response.data);
                            //$scope.answer = response.data;
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
                                    $ionicLoading.hide();
                                }
                        );
                    } else {
                        console.log('You clicked on "Cancel" button');
                    }
                });
            };
        });