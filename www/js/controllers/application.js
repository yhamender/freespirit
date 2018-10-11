/**
 * Application controller
 */
(function () {
    angular
            .module('invisionApp')

            .controller('ApplicationController', [
                '$scope',
                '$ionicModal',
                '$state',
                '$window',
                '$ionicHistory',
                '$http',
                function ($scope, $ionicModal, $state, $window, $ionicHistory, $http) {
                    'use strict';

                    var vm = this;
                    $scope.username = localStorage.getItem('username');
                    vm.showMenu = true;
                    $scope.$on('hideMenu', function () {
                        vm.showMenu = false;
                    });

                    $scope.$on('$stateChangeStart', function () {
                        vm.showMenu = true;
                    });

                    function showModal(modal) {
                        $scope.modal = modal;
                        // Open the intro modal
                        $scope.modal.show();
                    }

                    // Triggered in the intro modal to open it
                    vm.openModal = openModal;

                    // Triggered in the intro modal to close it
                    vm.closeModal = closeModal;

                    function openModal() {
                        // Create the intro modal that we will use later
                        $ionicModal.fromTemplateUrl('templates/modal.html', {
                            scope: $scope
                        }).then(showModal);
                    }

                    function closeModal() {
                        $scope.modal.hide();
                    }


                    $scope.logout = function () {
                        //alert('hi');
                        $state.go('login');
                        //$window.location.reload(true);
                        $window.localStorage.clear();
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                    };
                    $scope.variable="";
                    var userPlanCheck = function () {
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
                            console.log(response.data);
                            $scope.variable=response.data;
                        },
                                function error(response) {

                                }
                        );
                    };
                    userPlanCheck();
                }
            ]);

})();
