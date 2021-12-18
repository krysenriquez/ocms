define(['orgChart'], function () {
    'use strict';

    angular.module('appMember').directive('binaryTree', binaryTree);

    function binaryTree(DIRECTORY, $compile) {
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

        function binaryTreeController($scope, $http, accountFactory, $uibModal, _, blockUI, toastr) {
            var vm = this;
            var jsonTree = [];

            init();

            function init() {
                $scope.$watch(
                    function () {
                        return accountFactory.getSelectedAccount().accountId;
                    },
                    function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            jsonTree = [];
                            vm.accountId = newValue;
                        } else {
                            vm.accountId = oldValue;
                        }
                        getGenealogy(vm.accountId);
                    }
                );
            }

            function getGenealogy(accountId) {
                blockUI.start('Generating Genealogy ...');
                accountFactory
                    .getAccountGenealogy(accountId)
                    .then(function (response) {
                        if (response) {
                            fourthGenJSON(response);
                            loadBinary(jsonTree);
                        }
                    })
                    .catch(function (error) {
                        blockUI.stop();
                        toastr.error(error);
                    });
            }

            function fourthGenJSON(object) {
                // Start Condition for Avatar if it exists
                var avatar;
                var blankAvatar = DIRECTORY.MEDIA + '/img/blank.png';
                if (object.avatarInfo.length > 0 && !!object.avatarInfo[0].fileAttachment) {
                    avatar = object.avatarInfo[0].fileAttachment;
                } else {
                    avatar = blankAvatar;
                }
                // End Condition for Avatar if it exists
                // Start Parent Object
                var parent = {
                    id: object.accountId,
                    accountNumber: object.accountNumber,
                    name: object.accountName,
                    avatar: avatar,
                };
                jsonTree.push(parent);
                // End Parent Object
                // Start Recursive for Children of Parent
                fourthGenJSONRecursive(object.children, object);
            }

            function fourthGenJSONRecursive(children, parentObject) {
                // Check if Children object exists or has length
                var blankAvatar = DIRECTORY.MEDIA + '/img/blank.png';
                var addMember2;
                var addMember1;
                var childMember;
                if (children && children.length > 0) {
                    // Loop through children object
                    angular.forEach(children, function (child) {
                        // Start Condition for Avatar if it exists
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
                                tags: [child.accountStatus],
                                id: child.accountId,
                                accountNumber: child.accountNumber,
                                name: child.accountName,
                                avatar: avatar,
                                pid: parentObject.accountId,
                                parentAccountNumber: parentObject.accountNumber,
                                parentName: parentObject.accountName,
                                parentSide: child.parentSide,
                                count: parentObject.allLeftChildrenCount ? parentObject.allLeftChildrenCount : '',
                            };
                            addMember2 = {
                                tags: ['addMember'],
                                id: 'add_right_' + parentObject.accountId,
                                name: 'Add Member',
                                avatar: blankAvatar,
                                pid: parentObject.accountId,
                                parentAccountNumber: parentObject.accountNumber,
                                parentName: parentObject.accountName,
                                parentSide: 'RIGHT',
                                activationCode: '',
                                referrer: '',
                                firstName: '',
                                lastName: '',
                                count: parentObject.allRightChildrenCount ? parentObject.allRightChildrenCount : '',
                            };
                            jsonTree.push(childMember, addMember2);
                        }
                        // End Condition if Child order is 1st slot, and No Member on 2nd slot
                        // Condition if Child order is 2nd slot, and No Member on 1st slot
                        else if (child.parentSide == 'RIGHT' && children.length == 1) {
                            addMember1 = {
                                tags: ['addMember'],
                                id: 'add_left_' + parentObject.accountId,
                                name: 'Add Member',
                                avatar: blankAvatar,
                                pid: parentObject.accountId,
                                parentAccountNumber: parentObject.accountNumber,
                                parentName: parentObject.accountName,
                                parentSide: 'LEFT',
                                activationCode: '',
                                referrer: '',
                                firstName: '',
                                lastName: '',
                                count: parentObject.allLeftChildrenCount ? parentObject.allLeftChildrenCount : '',
                            };
                            childMember = {
                                tags: [child.accountStatus],
                                id: child.accountId,
                                accountNumber: child.accountNumber,
                                name: child.accountName,
                                avatar: avatar,
                                pid: parentObject.accountId,
                                parentAccountNumber: parentObject.accountNumber,
                                parentName: parentObject.accountName,
                                parentSide: child.parentSide,
                                count: parentObject.allRightChildrenCount ? parentObject.allRightChildrenCount : '',
                            };
                            jsonTree.push(addMember1, childMember);
                        }
                        // End Condition if Child order is 2nd slot, and No Member on 1st slot
                        // Condition if there are 2 children
                        else {
                            childMember = {
                                tags: [child.accountStatus],
                                id: child.accountId,
                                accountNumber: child.accountNumber,
                                name: child.accountName,
                                avatar: avatar,
                                pid: parentObject.accountId,
                                parentAccountNumber: parentObject.accountNumber,
                                parentName: parentObject.accountName,
                                parentSide: child.parentSide,
                                count:
                                    child.parentSide == 'LEFT'
                                        ? parentObject.allLeftChildrenCount
                                        : parentObject.allRightChildrenCount,
                            };
                            jsonTree.push(childMember);
                        }
                        // End Condition if there are 2 children
                        fourthGenJSONRecursive(child.children, child);
                    });
                } else if (children && children.length == 0) {
                    addMember1 = {
                        tags: ['addMember'],
                        id: 'add_left_' + parentObject.accountId,
                        name: 'Add Member',
                        avatar: blankAvatar,
                        pid: parentObject.accountId,
                        parentAccountNumber: parentObject.accountNumber,
                        parentName: parentObject.accountName,
                        parentSide: 'LEFT',
                        activationCode: '',
                        referrer: '',
                        firstName: '',
                        lastName: '',
                        count: parentObject.allLeftChildrenCount ? parentObject.allLeftChildrenCount : '',
                    };
                    addMember2 = {
                        tags: ['addMember'],
                        id: 'add_right_' + parentObject.accountId,
                        name: 'Add Member',
                        avatar: blankAvatar,
                        pid: parentObject.accountId,
                        parentAccountNumber: parentObject.accountNumber,
                        parentName: parentObject.accountName,
                        parentSide: 'RIGHT',
                        activationCode: '',
                        referrer: '',
                        firstName: '',
                        lastName: '',
                        count: parentObject.allRightChildrenCount ? parentObject.allRightChildrenCount : '',
                    };
                    jsonTree.push(addMember1, addMember2);
                }
            }

            function openAddMemberModal(nodeObject) {
                $uibModal.open({
                    animation: true,
                    backdrop: false,
                    templateUrl: DIRECTORY.COMPONENTS + '/binaryTree/addMember/addMember.tpl.html',
                    size: 'xl',
                    controller: 'AddMemberController',
                    controllerAs: 'vm',
                    bindToController: true,
                    resolve: {
                        loadController: function ($ocLazyLoad, DIRECTORY) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'AddMemberController',
                                    files: [DIRECTORY.COMPONENTS + '/binaryTree/addMember/addMember.controller.js'],
                                },
                            ]);
                        },
                        nodeObject: function () {
                            return nodeObject;
                        },
                    },
                });
            }

            function returnNodeObject(nodeId) {
                return $scope.chart.get(nodeId);
            }

            function setUpTree() {
                const tree = document.getElementById('binary-tree');
                if (tree) {
                    return new OrgChart(tree, {
                        align: OrgChart.ORIENTATION,
                        template: 'diva',
                        enableSearch: false,
                        scaleInitial: OrgChart.match.boundary,
                        mouseScrool: OrgChart.action.ctrlZoom,
                        nodeMouseClick: OrgChart.action.none,
                        nodeBinding: {
                            field_0: 'name',
                            field_1: 'accountNumber',
                            img_0: 'avatar',
                        },
                        linkBinding: {
                            link_field_0: 'count',
                        },
                        editForm: {
                            buttons: {
                                edit: null,
                                share: null,
                                pdf: null,
                                remove: null,
                            },
                            generateElementsFromFields: false,
                            elements: [
                                { type: 'textbox', label: 'Full Name', binding: 'name' },
                                { type: 'textbox', label: 'Account Number', binding: 'accountNumber' },
                            ],
                        },
                    });
                }
            }

            function loadBinary(object) {
                $scope.chart = setUpTree();
                $scope.data = object;
                blockUI.stop();
                $scope.chart.on('click', function (sender, args) {
                    if (_.includes(args.node.tags, 'addMember')) {
                        openAddMemberModal(returnNodeObject(args.node.id));
                    } else {
                        sender.editUI.show(args.node.id, true);
                    }
                    return false;
                });
            }
        }

        function link(scope, elem, attrs) {
            scope.$watch(
                'data',
                function (newValue, oldValue) {
                    if (newValue) {
                        scope.chart.load(newValue);
                        var element = $('#binary-chart');
                        $compile(element)(scope);
                    }
                },
                true
            );

            scope.$on('$destroy', function () {
                scope.$destroy;
            });
        }
    }
});
