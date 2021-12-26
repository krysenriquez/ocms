define(['orgChart'], function () {
    'use strict';

    angular.module('appMember').directive('binary', binary);

    function binary(DIRECTORY, $compile) {
        var directive = {
            bindToController: true,
            controller: binaryController,
            controllerAs: 'vm',
            templateUrl: DIRECTORY.COMPONENTS + '/profile/binary/binary.tpl.html',
            restrict: 'E',
            link: link,
            scope: {
                data: '=data',
            },
        };

        return directive;

        function binaryController($scope, $http, accountFactory, $uibModal, _, blockUI, toastr) {
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
                    .getBinaryProfile(accountId)
                    .then(function (response) {
                        if (response) {
                            vm.genealogy = response;
                            fourthGenJSONParent(response);
                            loadBinary(jsonTree);
                        }
                    })
                    .catch(function (error) {
                        blockUI.stop();
                        toastr.error(error);
                    });
            }

            function fourthGenJSONParent(object) {
                if (object.parent) {
                    // Start Condition for Avatar if it exists
                    var avatar;
                    var blankAvatar = DIRECTORY.MEDIA + '/img/blank.png';
                    if (object.parent.avatarInfo.length > 0 && !!object.parent.avatarInfo[0].fileAttachment) {
                        avatar = object.parent.avatarInfo[0].fileAttachment;
                    } else {
                        avatar = blankAvatar;
                    }
                    // End Condition for Avatar if it exists
                    var parent = {
                        id: object.parent.accountId,
                        accountNumber: object.parent.accountNumber,
                        name: object.parent.accountName,
                        avatar: avatar,
                    };
                    jsonTree.push(parent);
                    fourthGenJSON(object, parent);
                } else {
                    fourthGenJSON(object);
                }
            }

            function fourthGenJSONReferrer(object) {
                // Start Condition for Avatar if it exists
                var avatar;
                var blankAvatar = DIRECTORY.MEDIA + '/img/blank.png';
                if (object.referrer.avatarInfo.length > 0 && !!object.referrer.avatarInfo[0].fileAttachment) {
                    avatar = object.referrer.avatarInfo[0].fileAttachment;
                } else {
                    avatar = blankAvatar;
                }
                // End Condition for Avatar if it exists
                var referrer = {
                    id: object.referrer.accountId,
                    accountNumber: object.referrer.accountNumber,
                    name: object.referrer.accountName,
                    avatar: avatar,
                };
                jsonTree.push(referrer);
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
                var main = {
                    id: object.accountId,
                    accountNumber: object.accountNumber,
                    name: object.accountName,
                    avatar: avatar,
                    pid: object.parent ? object.parent.accountId : '',
                    linkField: object.parent ? object.parentSide : '',
                };
                jsonTree.push(main);
                // End Parent Object
                // Start Recursive for Children of Parent
                if (object.referrer && object.referrer.accountId != object.parent.accountId) {
                    fourthGenJSONReferrer(object);
                }
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
                                linkField: parentObject.allLeftChildrenCount ? parentObject.allLeftChildrenCount : '',
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
                                linkField: parentObject.allRightChildrenCount ? parentObject.allRightChildrenCount : '',
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
                                linkField: parentObject.allLeftChildrenCount ? parentObject.allLeftChildrenCount : '',
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
                                linkField: parentObject.allRightChildrenCount ? parentObject.allRightChildrenCount : '',
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
                                linkField:
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

            function setUpTree() {
                const tree = document.getElementById('binary-profile');
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
                            link_field_0: 'linkField',
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
                        ...(vm.genealogy.referrer
                            ? {
                                  slinks: [
                                      {
                                          from: vm.genealogy.referrer.accountId,
                                          to: vm.genealogy.accountId,
                                          label: 'REFERRER',
                                      },
                                  ],
                              }
                            : {}),
                    });
                }
            }

            function loadBinary(object) {
                $scope.chart = setUpTree();
                $scope.data = object;
                $scope.chart.on('label', function (sender, args) {
                    args.value = args.value;
                });
                blockUI.stop();
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
