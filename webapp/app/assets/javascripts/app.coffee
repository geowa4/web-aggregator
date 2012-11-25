_ = require 'underscore'
Backbone = require 'backbone'
Q = require 'q'
Posts = require 'Posts'
PostList = require 'PostList'

$.domReady ->
  posts = new Posts()

  ApplicationRouter = Backbone.Router.extend
    routes:
      '': 'posts'
      '/': 'posts'
      'about': 'about'

    _preRoute: ->
      deferred = Q.defer()
      pages = $('[data-role=page]')
      pages.fadeOut 250, () ->
        pages.css('display', 'none')
        deferred.resolve()
      $('ul.nav li').removeClass 'active'
      deferred.promise

    posts: ->
      @_preRoute()
      .then ->
        $('ul.nav li.posts').addClass 'active'
        posts.fetch()
      .then =>
        if !@postList?
          @postList = new PostList
            el: $('#feed .post-list')
            collection: posts
        @postList.render()
        $('.posts[data-role=page]')
        .css
          opacity: 0
          display: 'block'
        .fadeIn()
      .done()

    about: ->
      @_preRoute().then ->
        $('ul.nav li.about').addClass 'active'
        $('.about[data-role=page]')
        .css
          opacity: 0
          display: 'block'
        .fadeIn()

  app = new ApplicationRouter()
  Backbone.history.start pushState: true

  navigate = (evt) ->
    evt.preventDefault()
    app.navigate $(this).attr('href'), true

  $('ul.nav').on 'click', 'a', navigate
  $('a.brand').on 'click', navigate

  $('.more-posts .btn').on 'click', (evt) ->
    evt.preventDefault()
    button = $(this)
    morePosts = new Posts()
    morePosts.fetch
      data: 
        skip: posts.size()
    .then ->
      if morePosts.size() is 0
        noMore = $(document.createElement('span'))
        noMore.append($(document.createElement('strong'))
          .text('Sorry!'))
          .append($(document.createElement('span'))
          .text('There are no more posts to load.'))
        button.closest('p').replaceWith(noMore)
        noMore.closest('div.more-posts')
          .removeClass('more-posts')
          .addClass('alert alert-info')
      else
        posts.add morePosts.models
