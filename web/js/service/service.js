var CommonService=angular.module("CommonService",[]);
CommonService.factory('$basic',['$http','$location','$q',"$cookies",function($http,$location,$q,$cookies){
    var _this = {};
    _this.USER_AUTH_NAME = "auth-token";
    _this.COMMON_AUTH_NAME ='auth-token';
    _this.USER_ID = "user-id";
    _this.USER_STATUS = "status";
    _this.ADMIN_AUTH_NAME = "admin-token";
    _this.ADMIN_ID = "admin-id";
    _this.ADMIN_STATUS = "admin-status";

    _this.setHeader = function(name,value) {
        $http.defaults.headers.common[name] = value;
    };


    _this.setHeader('Content-Type','application/json');

    _this.formPost = function(dom,url,success,error) {
        // url = '/api' + (url[0]==='/'?'':'/') + url;
        var options = {
            url: url,
            type:'post',
            beforeSend: function(xhr) {
                xhr.setRequestHeader(_this.COMMON_AUTH_NAME,$cookies.get(_this.COMMON_AUTH_NAME));
                //xhr.setRequestHeader('Content-Type','multipart/form-data');
            },
            success: function(data) {
                if($.isFunction(success)) {
                    success(data);
                }
            },
            error: function(data) {
                checkAuthorizedStatus(data);
                if($.isFunction(error)) {
                    error(data);
                }
            }
        };
        $(dom).ajaxSubmit(options);
    };

    var fnArray = ['get','delete','jsonp','head','post','put'];
    for(var i in fnArray) {
        (function(fn) {
            _this[fn] = function(url,param) {
                // url = '/api' + (url[0]==='/'?'':'/') + url;
                var deferred = $q.defer();
                //only 'post,put' need 2nd parameter
                $http[fn](url,param).success(function(data){
                    deferred.resolve(data);
                }).error(function(data){
                    checkAuthorizedStatus(data);
                    deferred.reject(data);
                });
                return deferred.promise;
            };
        })(fnArray[i]);
    }

    function checkAuthorizedStatus(data) {
        if(!angular.isUndefined(data.outMsg) && data.outMsg=="Access token error ,the Api can't be accessed") {
            $cookies.get(_this.ADMIN_AUTH_NAME,"");
            window.location.href="admin_login.html";
        }
    }

    _this.setCookie = function (name,value) {
        $cookies.put(name, value,{path:'/',expires: new Date(new Date().getTime()+5000)});

    }
    _this.getCookie = function (name) {
        return $cookies.get(name);
    }
    _this.removeCookie = function (name){
        $cookies(name,"");
    }
    _this. getParameter = function(name) {
        var url = document.location.href;
        var start = url.indexOf("?")+1;
        if (start==0) {
            return "";
        }
        var value = "";
        var queryString = url.substring(start);
        var paraNames = queryString.split("&");
        for (var i=0; i<paraNames.length; i++) {
            if (name==getParameterName(paraNames[i])) {
                value = getParameterValue(paraNames[i])
            }
        }
        return value;
    }

    function getParameterName(str) {
        var start = str.indexOf("=");
        if (start==-1) {
            return str;
        }
        return str.substring(0,start);
    }

    function getParameterValue(str) {
        var start = str.indexOf("=");
        if (start==-1) {
            return "";
        }
        return str.substring(start+1);
    }
    return _this;
}]);

