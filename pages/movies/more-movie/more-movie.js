// pages/movies/more-movie/more-movie.js
var postsData = require('../../../data/moremove.js');
var app = getApp()
var util = require('../../../utils/util.js');


Page({
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
    more:{}
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var moremove = postsData.moremove;
    this.data.more = moremove;
    // var dataUrl = "";
    // switch (category) {
    //   case "正在热映":
    //     dataUrl = app.globalData.doubanBase +
    //       "/v2/movie/in_theaters";
    //     break;
    //   case "即将上映":
    //     dataUrl = app.globalData.doubanBase +
    //       "/v2/movie/coming_soon";
    //     break;
    //   case "豆瓣Top250":
    //     dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
    //     break;
    // }
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
    this.processDoubanData(moremove);
    //this.data.requestUrl = dataUrl;

    // util.http(dataUrl, this.processDoubanData)//调用接口数据
  },

  // onScrollLower: function (event) {
  //   var nextUrl = this.data.requestUrl +
  //     "?start=" + this.data.totalCount + "&count=20";
  //   util.http(nextUrl, this.processDoubanData)
  //   wx.showNavigationBarLoading()
  // },

  onReachBottom: function (event) {//下拉的时候载入动画调用接口数据
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    //util.http(nextUrl, this.processDoubanData)
    this.processDoubanData(this.data.more);
    wx.showNavigationBarLoading()
  },

  onPullDownRefresh: function (event) {//下拉的时候载入动画调用接口数据
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    this.processDoubanData(moremove);
    //util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  processDoubanData: function (moviesDouban) {//渲染更多页面中的数据
    var movies = [];
    for (var idx in moviesDouban[0].subjects) {
      var subject = moviesDouban[0].subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies = {}

    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });

    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  },

  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },

  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
})