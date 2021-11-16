define(function () {
    'use strict';

    var app = angular.module('app');

    app.factory('appFactory', function ($http, toastr, $filter) {
        return {
            getCurrentSelectedMemberAccount: function () {
                var values = JSON.parse(localStorage.getItem('selectedMemberAccount'));
                return values['accountId'];
            },
            getMemberName: function (accountId) {
                return $http.get('/api/accounts/accounts/', { params: { accountId: accountId } }).then(
                    function (response) {
                        return response.data[0].accountName;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Parent Leg Type List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getMemberAccountType: function () {
                return $http.get('/api/accounts/accountype/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Parent Leg Type List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getMemberAccountPackages: function () {
                return $http.get('/api/accounts/accountpackages/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Parent Leg Type List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getParentSideType: function () {
                return $http.get('/api/accounts/parentsidetype/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Parent Leg Side List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getWithdrawalTransactionNo: function (withdrawalId) {
                return $http.get('/api/withdrawals/withdrawals/', { params: { withdrawalId: withdrawalId } }).then(
                    function (response) {
                        return response.data[0].transactionNo;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Withdrawal Transaction Number. Please contact System Administrator.'
                        );
                    }
                );
            },
            // Settings API
            getTitleType: function () {
                return $http.get('/api/settings/titletype/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Title Type List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getGenderType: function () {
                return $http.get('/api/settings/gendertype/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Gender Type List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getCountryList: function () {
                return $http.get('/api/settings/countries/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Countries List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getCivilStatusType: function () {
                return $http.get('/api/settings/civilstatustype/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve CivilStatus Type List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getReligionType: function () {
                return $http.get('/api/settings/religiontype/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Religion Type List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getAddressType: function () {
                return $http.get('/api/settings/addresstype/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Address Type List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getContactType: function () {
                return $http.get('/api/settings/contacttype/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Contact Type List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getIdentificationType: function () {
                return $http.get('/api/settings/identificationtype/').then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Identification Type List. Please contact System Administrator.'
                        );
                    }
                );
            },
            getVerificationCodeID: function (code) {
                return $http.get('/api/settings/codes/', { params: code }).then(
                    function (response) {
                        return response.data[0].id;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText + ' ',
                            'Could not retrieve Verification Code ID. Please contact System Administrator.'
                        );
                    }
                );
            },
            // Basic Factory Functions
            getNotifications: function (userId, committeeId) {
                return $http.get('/api/notifications/notifications/', { params: { userId: userId, committeeId: committeeId } }).then(
                    function (response) {
                        return response.data;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText,
                            'Could not retrieve Notifications. Please contact System Administrator.'
                        );
                    }
                );
            },
            getCurrentUser: function () {
                var values = JSON.parse(localStorage.getItem('currentUserMember'));
                return values['id'];
            },
            getCurrentUserInfo: function () {
                var values = JSON.parse(localStorage.getItem('currentUserMember'));
                return $http.get('/api/users/users/', { params: { id: values['id'] } }).then(
                    function (response) {
                        return response.data[0];
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText,
                            'Could not retrieve current user information. Please contact System Administrator.'
                        );
                    }
                );
            },
            getUserAccountTypeID: function (accountType) {
                return $http.get('/api/users/accounttype/', { params: { account_type: accountType } }).then(
                    function (response) {
                        return response.data[0].id;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText,
                            'Could not retrieve User Account types. Please contact System Administrator.'
                        );
                    }
                );
            },
            getContentTypeId: function (model) {
                return $http.get('/api/users/contenttype/', { params: { model: model } }).then(
                    function (response) {
                        return response.data[0].id;
                    },
                    function (error) {
                        toastr.error(
                            'Error ' + error.status + ' ' + error.statusText,
                            'Could not retrieve Content Type Id. Please contact System Administrator.'
                        );
                    }
                );
            },
            getTimeRemaining: function (endtime, starttime) {
                var t = Date.parse(endtime) - Date.parse(starttime);
                var seconds = Math.floor((t / 1000) % 60);
                var minutes = Math.floor((t / 1000 / 60) % 60);
                var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
                var days = Math.floor(t / (1000 * 60 * 60 * 24));
                var wholedays = Math.ceil(t / (1000 * 60 * 60 * 24));
                return {
                    total: t,
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds,
                    wholedays: wholedays,
                };
            },
            trimString: function (string, length) {
                return string.length > length ? string.substring(0, length) + '...' : string;
            },
            trimStringWithExtension: function (string, length) {
                var ext = string.split('.').pop();
                return string.length > length ? string.substring(0, length) + '...' + ext : string;
            },
            dateWithoutTime: function (date, format) {
                return $filter('date')(date, format);
            },
            flattenJSON: function (array) {
                var flatten = function (object) {
                    var newObj = {};
                    for (var key in object) {
                        var item = object[key];
                        if (typeof item !== 'object') {
                            newObj[key] = item;
                        } else {
                            var flattened = flatten(item);
                            for (var k in flattened) {
                                newObj[k] = flattened[k];
                            }
                        }
                    }
                    return newObj;
                };

                var flattenArray = function (array) {
                    var newArray = [];
                    array.forEach(function (object) {
                        newArray.push(flatten(object));
                    });
                    return newArray;
                };

                return flattenArray(array);
            },
            convertCamelCase: function (camelCase) {
                return camelCase
                    .replace(/([A-Z])/g, function ($1) {
                        return ' ' + $1.toUpperCase();
                    })
                    .replace(/^./, function (str) {
                        return str.toUpperCase();
                    });
            },
            convertSnakeCase: function (snakeCase) {
                return snakeCase
                    .replace(/([_])/g, function ($1) {
                        return ' ';
                    })
                    .replace(/\s[a-z]/g, function ($1) {
                        return $1.toUpperCase();
                    })
                    .replace(/^./, function (str) {
                        return str.toUpperCase();
                    });
            },
            normalizeString: function (string) {
                return string
                    .replace(/([A-Z])/g, function ($1) {
                        return ' ' + $1.toUpperCase();
                    })
                    .replace(/([_])/g, function ($1) {
                        return ' ';
                    })
                    .replace(/\s[a-z]/g, function ($1) {
                        return $1.toUpperCase();
                    })
                    .replace(/^./, function (str) {
                        return str.toUpperCase();
                    });
            },
            validateEmail: function (email) {
                const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            slugify: function (text) {
                var slug = text.toLowerCase().trim();
                slug = slug.replace(/[^a-z0-9\s-]/g, ' ');
                slug = slug.replace(/[\s-]+/g, '-');
                return slug;
            },
            unSlugify: function (text) {
                var unslug = text.toLowerCase();
                unslug = unslug.split('-');
                unslug = unslug.map((i) => i[0].toUpperCase() + i.substr(1));
                unslug = unslug.join(' ');
                return unslug;
            },
            generateUniqueID: function (length, quantity) {
                var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                t;
                var charSetSize = charSet.length;
                var idCount = quantity;
                var charCount = length;
                var generatedIds = [];

                var generateRandomId = function () {
                    var id = '';
                    for (var i = 1; i <= charCount; i++) {
                        var randPos = Math.floor(Math.random() * charSetSize);
                        id += charSet[randPos];
                    }
                    return id;
                };

                while (generatedIds.length < idCount) {
                    var id = generateRandomId();
                    if ($.inArray(id, generatedIds) == -1) {
                        generatedIds.push(id);
                    }
                }

                return generatedIds;
            },
            convertAmountToWords: function (s) {
                var myappthos = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
                var myappdang = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
                var myapptenth = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
                var myapptvew = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

                s = s.toString();
                s = s.replace(/[\, ]/g, '');
                if (s != parseFloat(s)) return 'not a number';
                var query = s.indexOf('.');
                if (query == -1) query = s.length;
                if (query > 15) return 'too big';
                var n = s.split('');
                var str = '';
                var mjk = 0;
                for (var ld = 0; ld < query; ld++) {
                    if ((query - ld) % 3 == 2) {
                        if (n[ld] == '1') {
                            str += myapptenth[Number(n[ld + 1])] + ' ';
                            ld++;
                            mjk = 1;
                        } else if (n[ld] != 0) {
                            str += myapptvew[n[ld] - 2] + ' ';
                            mjk = 1;
                        }
                    } else if (n[ld] != 0) {
                        str += myappdang[n[ld]] + ' ';
                        if ((query - ld) % 3 == 0) str += 'hundred ';
                        mjk = 1;
                    }
                    if ((query - ld) % 3 == 1) {
                        if (mjk) str += myappthos[(query - ld - 1) / 3] + ' ';
                        mjk = 0;
                    }
                }
                if (query != s.length) {
                    var dv = s.length;
                    str += 'and ';
                    for (var ld = query + 1; ld < dv; ld++) str += myappdang[n[ld]] + ' ';
                }
                return str.replace(/\s+/g, ' ');
            },
        };
    });
});
