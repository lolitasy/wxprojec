var postsData = require('../../data/posts-data.js');
var util = require('../../utils/util.js')
var app = getApp();
Page({
  // RESTFul API JSON
  // SOAP XML
  //粒度 不是 力度
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
  },

  onReachBottom:function(e){
    
  },

  onLoad: function (option) {
    
    var top250Url = postsData.toplist;
    var comingSoonUrl = postsData.coming_soon;
    var inTheatersUrl = postsData.in_theaters;
    // var inTheatersUrl = app.globalData.doubanBase +
    //   "/v2/movie/in_theaters" + "?start=0&count=3";
    // var comingSoonUrl = app.globalData.doubanBase +
    //   "/v2/movie/coming_soon" + "?start=0&count=3";
    // var top250Url = app.globalData.doubanBase +
    //   "/v2/movie/top250" + "?start=0&count=3";
    this.processDoubanData(inTheatersUrl, "inTheaters", "正在热映");
    this.processDoubanData(comingSoonUrl, "comingSoon", "即将上映");
    this.processDoubanData(top250Url, "top250", "豆瓣Top250");
    //this.processDoubanData(url, settedKey, categoryTitle)
  },

  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },

  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id="+movieId
    })
  },

  getMovieListData: function (url, settedKey, categoryTitle) {
    //return (url, settedKey, categoryTitle)
    //var that = this;
    // wx.request({
    //   url: url,
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //    that.processDoubanData(res.data, settedKey, categoryTitle)
    //this.processDoubanData(url, settedKey, categoryTitle)
    //  },
    //   fail: function (error) {
    //     // fail
    //     console.log(error)
    //   }
    // })
  },

  onCancelImgTap: function (event) {
      this.setData({
        containerShow: true,
        searchPanelShow: false,
        searchResult:{}
      }
    )
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })

  },

  onBindConfirm: function (event) {//搜索功能
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    
    this.getMovieListData(searchUrl, "searchResult", "");
  },
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
  }
})
