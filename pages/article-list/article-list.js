// pages/article-list/article-list.js
var api1 = require('../../api1.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        article_list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var page = this;
        wx.showLoading();
        app.request({
            url: api1.default.article_list,
            data: {
            },
            success: function (res) {
                wx.hideLoading();
                page.setData({
                    article_list: res.data.rows,
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

})