Backbone = require 'backbone'

urlRoot = '/posts'
dataType = 'json'

Post = Backbone.Model.extend
  defaults:
    url: ""
    title: ""
    content: ""
    published: new Date
    updated: new Date
    provider: ""

  initialize: () ->
    this.set
      published: new Date(this.get('published'))
      updated: new Date(this.get('updated'))

  url: () -> urlRoot + '/' + this.id + '.' + dataType

Posts = Backbone.Collection.extend
  model: Post
  url: urlRoot + '.' + dataType

provide 'Posts', Posts