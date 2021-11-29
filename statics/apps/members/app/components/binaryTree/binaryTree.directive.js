define(['raphael'], function () {
    'use strict';

    angular.module('appMember').directive('binaryTree', function (DIRECTORY) {
        var directive = {
            bindToController: true,
            controller: binaryTreeController,
            controllerAs: 'vm',
            templateUrl: DIRECTORY.COMPONENTS + '/binaryTree/binaryTree.tpl.html',
            restrict: 'E',
            link: link,
            scope: {
                data: '=data',
            },
        };

        return directive;

        function binaryTreeController(
            $scope,
            $timeout,
            $http,
            $compile,
            accountFactory,
            urlService,
            humpsFactory,
            DIRECTORY
        ) {
            var vm = this;

            init();

            function init() {
                $scope.$watch(
                    function () {
                        return accountFactory.getAccountId();
                    },
                    function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            vm.accountId = newValue;
                        } else {
                            vm.accountId = oldValue;
                        }
                        loadGenealogy();
                    }
                );

                var config = {
                    container: '#binary-tree',
                    animateOnInit: true,
                    connectors: {
                        type: 'straight',
                    },
                    node: {
                        collapsable: false,
                    },
                    animation: {
                        nodeAnimation: 'easeOutBounce',
                        nodeSpeed: 700,
                        connectorsAnimation: 'bounce',
                        connectorsSpeed: 700,
                    },
                };

                vm.jsonTree = [config];
            }

            function loadGenealogy() {
                $http({
                    url: urlService.GENEALOGY,
                    method: 'GET',
                    params: { account_id: vm.accountId },
                }).then(
                    function (response) {
                        var obj = humpsFactory.camelizeKeys(response.data[0]);
                        if (obj) {
                            fourthGenJSON(obj);
                            setUpTree(vm.jsonTree);
                        }
                    },
                    function (error) {
                        console.log(error.status);
                    }
                );
            }

            function fourthGenJSON(object) {
                // Start Condition for Avatar if it exists
                var avatar;
                var blankAvatar = DIRECTORY.MEDIA + '/img/blank.png';
                if (object.avatarInfo.length > 1 && !!!object.avatarInfo[0].fileAttachment) {
                    avatar = object.avatarInfo[0].fileAttachment;
                } else {
                    avatar = blankAvatar;
                }
                // End Condition for Avatar if it exists
                // Start Parent Object
                var parent = {
                    text: { name: object.accountName },
                    id: object.accountId,
                    innerHTML:
                        '<div class="text-center">' +
                        '<div class="avatar avatar-xl">' +
                        '<img src="' +
                        avatar +
                        '" alt="image" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="mt-2 text-center">' +
                        '<a href="" ng-click="viewMember(' +
                        object.accountNumber +
                        ')" class="text-dark font-weight-bold text-hover-primary font-size-h5">' +
                        object.accountName +
                        '</a>' +
                        '</div>' +
                        '<div class="text-center">' +
                        '<span class="text-dark font-weight-bold font-size-h6">' +
                        object.accountNumber +
                        '</span>' +
                        '</div>',
                };
                vm.jsonTree.push(parent);
                // End Parent Object
                // Start Recursive for Children of Parent
                fourthGenJSONRecursive(object.children, parent, object);
            }

            function fourthGenJSONRecursive(children, parent, parentObject) {
                // Check if Children object exists or has length
                var blankAvatar = DIRECTORY.MEDIA + '/img/blank.png';
                if (children && children.length > 0) {
                    // Loop through children object
                    angular.forEach(children, function (child) {
                        // Start Condition for Avatar if it exists
                        var addMember2;
                        var addMember1;
                        var childMember;

                        var avatar;
                        if (child.avatarInfo.length > 1 && !!!child.avatarInfo[0].fileAttachment) {
                            avatar = child.avatarInfo[0].fileAttachment;
                        } else {
                            avatar = blankAvatar;
                        }
                        // End Condition for Avatar if it exists
                        // Condition if Child order is 1st slot, and No Member on 2nd slot
                        if (child.parentSide == 'LEFT' && children.length == 1) {
                            childMember = {
                                parent: parent,
                                innerHTML:
                                    '<div class="text-center">' +
                                    '<div class="avatar avatar-xl">' +
                                    '<img src="' +
                                    avatar +
                                    '" alt="image" />' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="mt-2 text-center">' +
                                    '<a href="" ng-click="viewMember(' +
                                    child.accountNumber +
                                    ')" class="text-dark font-weight-bold text-hover-primary font-size-h5">' +
                                    child.accountName +
                                    '</a>' +
                                    '</div>' +
                                    '<div class="text-center">' +
                                    '<span class="text-dark font-weight-bold font-size-h6">' +
                                    child.accountNumber +
                                    '</span>' +
                                    '</div>',
                            };
                            addMember2 = {
                                parent: parent,
                                innerHTML:
                                    '<div class="text-center">' +
                                    '<div class="avatar avatar-xl">' +
                                    '<img src="' +
                                    blankAvatar +
                                    '" alt="image" />' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="my-2 text-center">' +
                                    '<a href="" ng-click="addMember(' +
                                    parentObject.accountNumber +
                                    ',2)" class="text-dark font-weight-bold text-hover-primary font-size-h5">' +
                                    '<i class="fas fa-plus mr-2 text-dark"></i>Add Member' +
                                    '</a>' +
                                    '</div>',
                            };
                            $scope.json.push(childMember, addMember2);
                        }
                        // End Condition if Child order is 1st slot, and No Member on 2nd slot
                        // Condition if Child order is 2nd slot, and No Member on 1st slot
                        else if (child.parentSide == 'RIGHT' && children.length == 1) {
                            addMember1 = {
                                parent: parent,
                                innerHTML:
                                    '<div class="text-center">' +
                                    '<div class="avatar avatar-xl">' +
                                    '<img src="' +
                                    blankAvatar +
                                    '" alt="image" />' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="my-2 text-center">' +
                                    '<a href="" ng-click="addMember(' +
                                    parentObject.accountNumber +
                                    ',1)" class="text-dark font-weight-bold text-hover-primary font-size-h5">' +
                                    '<i class="fas fa-plus mr-2 text-dark"></i>Add Member' +
                                    '</a>' +
                                    '</div>',
                            };
                            childMember = {
                                parent: parent,
                                innerHTML:
                                    '<div class="text-center">' +
                                    '<div class="avatar avatar-xl">' +
                                    '<img src="' +
                                    avatar +
                                    '" alt="image" />' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="mt-2 text-center">' +
                                    '<a href="" ng-click="viewMember(' +
                                    child.accountNumber +
                                    ')" class="text-dark font-weight-bold text-hover-primary font-size-h5">' +
                                    child.accountName +
                                    '</a>' +
                                    '</div>' +
                                    '<div class="text-center">' +
                                    '<span class="text-dark font-weight-bold font-size-h6">' +
                                    child.accountNumber +
                                    '</span>' +
                                    '</div>',
                            };
                            vm.jsonTree.push(addMember1, childMember);
                        }
                        // End Condition if Child order is 2nd slot, and No Member on 1st slot
                        // Condition if there are 2 children
                        else {
                            childMember = {
                                parent: parent,
                                innerHTML:
                                    '<div class="text-center">' +
                                    '<div class="avatar avatar-xl">' +
                                    '<img src="' +
                                    avatar +
                                    '" alt="image" />' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="mt-2 text-center">' +
                                    '<a href="" ng-click="viewMember(' +
                                    child.accountNumber +
                                    ')" class="text-dark font-weight-bold text-hover-primary font-size-h5">' +
                                    child.accountName +
                                    '</a>' +
                                    '</div>' +
                                    '<div class="text-center">' +
                                    '<span class="text-dark font-weight-bold font-size-h6">' +
                                    child.accountNumber +
                                    '</span>' +
                                    '</div>',
                            };
                            vm.jsonTree.push(childMember);
                        }
                        // End Condition if there are 2 children
                        fourthGenJSONRecursive(child.children, childMember, child);
                    });
                } else if (children && children.length == 0) {
                    var addMember1 = {
                        parent: parent,
                        innerHTML:
                            '<div class="text-center">' +
                            '<div class="avatar avatar-xl">' +
                            '<img src="' +
                            blankAvatar +
                            '" alt="image" />' +
                            '</div>' +
                            '</div>' +
                            '<div class="my-2 text-center">' +
                            '<a href="" ng-click="addMember(' +
                            parentObject.accountNumber +
                            ',1)" class="text-dark font-weight-bold text-hover-primary font-size-h5">' +
                            '<i class="fas fa-plus mr-2 text-dark"></i>Add Member' +
                            '</a>' +
                            '</div>',
                    };
                    var addMember2 = {
                        parent: parent,
                        innerHTML:
                            '<div class="text-center">' +
                            '<div class="avatar avatar-xl">' +
                            '<img src="' +
                            blankAvatar +
                            '" alt="image" />' +
                            '</div>' +
                            '</div>' +
                            '<div class="my-2 text-center">' +
                            '<a href="" ng-click="addMember(' +
                            parentObject.accountNumber +
                            ',2)" class="text-dark font-weight-bold text-hover-primary font-size-h5">' +
                            '<i class="fas fa-plus mr-2 text-dark"></i>Add Member' +
                            '</a>' +
                            '</div>',
                    };
                    vm.jsonTree.push(addMember1, addMember2);
                }
            }

            function setUpTree(object) {
                $scope.data = object;
                $timeout(function () {
                    var element = $('#binary-tree');
                    $compile(element)($scope);
                    console.log('Loaded');
                });
            }
        }

        function link(scope, elem, attrs) {
            scope.$watch(
                'data',
                function (newVal) {
                    if (newVal) {
                        var tree = new Treant(scope.data);
                    }
                },
                true
            );
            scope.$on('$destroy', function () {
                scope.$destroy;
            });
        }
    });
});
