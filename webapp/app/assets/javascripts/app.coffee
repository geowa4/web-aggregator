_ = require 'underscore'
Backbone = require 'backbone'
Q = require 'q'
Posts = require 'Posts'
PostList = require 'PostList'

posts = new Posts()

initialFetch = posts.fetch()

ApplicationRouter = Backbone.Router.extend
  routes:
    '': 'posts'
    '/': 'posts'
    'about': 'about'

  _preRoute: ->
    $('[data-role=page]').css('display', 'none')
    $('ul.nav li').removeClass 'active'

  posts: ->
    @_preRoute()
    $('ul.nav li.posts').addClass 'active'
    initialFetch
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
      .fadeIn 100
    .done()

  about: ->
    @_preRoute()
    $('ul.nav li.about').addClass 'active'
    $('.about[data-role=page]')
    .css
      opacity: 0
      display: 'block'
    .fadeIn 100

$.domReady ->
  app = new ApplicationRouter()
  Backbone.history.start pushState: true

  navigate = (evt) ->
    evt.preventDefault()
    app.navigate $(this).attr('href'), true

  $('ul.nav').on 'click', 'a', navigate
  $('a.brand').on 'click', navigate

  $('[data-toggle=collapse]').on 'click', (evt) ->
    evt.preventDefault()
    target = $($(this).attr('data-target'))
    target
    .animate
      height: if target.height() is 0 then 72 else 0
      duration: 200

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
