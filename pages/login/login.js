var api = require('../../api.js');
var api1 = require('../../api1.js');
var app = getApp();
var util = require('../../utils/utils.js');

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {
        var that = this;
        var pages = getCurrentPages();
        var page = pages[(pages.length - 2)];
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            var access_token = wx.getStorageSync("access_token");
                            console.log('11token:' + access_token);
                            if(access_token)
                            wx.switchTab({
                                url: "../index/index"
                            })
                        }
                    });
                }
            }
        })
    },
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            //插入登录的用户的相关信息到数据库
            that.login();
            //授权成功后，跳转进入小程序首页
            wx.switchTab({
                url: "../index/index"
            })
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”')
                    }
                }
            })
        }
    },
    //获取用户信息接口
    queryUsreInfo: function () {
        wx.request({
            url: getApp().globalData.urlPath + 'hstc_interface/queryByOpenid',
            data: {
                openid: getApp().globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data);
                getApp().globalData.userInfo = res.data;
            }
        });
    },
    login: function () {
        var pages = getCurrentPages();
        var page = pages[(pages.length - 1)];
        // wx.showLoading({
        //   title: "正在登录",
        //   mask: true,
        // });
        wx.login({
            success: function (res) {
                if (res.code) {
                    var code = res.code;
                    wx.getSetting({
                        success: function (res) {
                            if (res.authSetting['scope.userInfo']) {
                                wx.getUserInfo({
                                    success: function (res) {
                                        console.log('login.....');
                                        console.log(code);
                                        console.log(res.rawData + ";encry:" + res.encrypted_data + ";iv:" + res.iv + ";signature:" + res.signature);
                                        console.log(api1.passport.login);
                                        app.request({
                                            url: api1.passport.login,
                                            method: "post",
                                            data: {
                                                code: code,
                                                userInfo: res.rawData,
                                                encrypted_data: res.encryptedData,
                                                iv: res.iv,
                                                signature: res.signature
                                            },
                                            success: function (res) {
                                                console.log("login---res:" + res);
                                                wx.hideLoading();
                                                if (res.code == 0) {

                                                    //  wx.setStorageSync("access_token", res.data.access_token);
                                                    wx.setStorageSync("access_token", res.data.id);
                                                    wx.setStorageSync("user_info", {
                                                        avatar_url: res.data.img,
                                                        nickname: res.data.username,
                                                        avatar_url: res.data.img,
                                                        // parent: res.data.parent,
                                                        id: res.data.id
                                                    });

                                                    var parent_id = wx.getStorageSync("parent_id");
                                                    var p = getCurrentPages();
                                                    // var parent_id = 0;


                                                    if (p[0].options.user_id != undefined) {

                                                        parent_id = p[0].options.user_id;
                                                    } else if (p[0].options.scene != undefined) {
                                                        parent_id = p[0].options.scene;
                                                    }
                                                    console.log('parentid:' + parent_id, p[0].options.scene, p[0].options.user_id);
                                                    getApp().bindParent({
                                                        parent_id: parent_id || 0
                                                    });

                                                    if (page == undefined) {
                                                        return;

                                                    }
                                                    wx.redirectTo({
                                                        url: "/" + page.route + "?" + util.objectToUrlParams(page.options),
                                                        fail: function () {
                                                            wx.switchTab({
                                                                url: "/" + page.route,
                                                            });
                                                        },
                                                    });
                                                } else {
                                                    wx.showToast({
                                                        title: res.msg
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                } else {
                    console.log("fail:" + res);
                }

            }
        });
    },

})