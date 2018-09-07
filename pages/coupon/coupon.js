// pages/coupon/coupon.js
var api1 = require('../../api1.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            status: options.status || 0,
        });
        this.loadData(options);
    },

    loadData: function (options) {
		
        var page = this;
        wx.showLoading({
            title: "加载中",
        });
        var access_token = wx.getStorageSync("access_token");
        app.request({
            url: api1.coupon.index,
            data: {
                limit:15,
                id:access_token,
                status: page.data.status,
            },
            success: function (res) {
					console.log('coupon res:'+res);
                if (res.code == 0) {
                    page.setData({
                        list: res.data.rows,
                    });
                }
            },
            complete: function () {
                wx.hideLoading();
            }
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
});