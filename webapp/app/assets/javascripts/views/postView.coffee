buildPostDom = (post) ->
  article = $(document.createElement('article'))
  header = $(document.createElement('header'))
  provider = $(document.createElement('h3'))
  source = $(document.createElement('a'))
  pubDate = $(document.createElement('time'))
  content = $(document.createElement('p'))
  provider.text(post.get('provider'))
  pubDate.attr('pubdate', '')
  .attr('datetime', post.get('published').toISOString())
  .text(post.get('published').toLocaleDateString())
  .appendTo(source)
  source.attr('href', post.get('url')).appendTo(provider)
  header.append(provider)
  content.html(post.get('content'))
  article.append(header)
  article.append(content)
  article

PostList = Backbone.View.extend
  initialize: () ->
    @$el.empty()
    ;
    @headPost = null
    ;
    @items = {}
    ;
    @collection.on 'all', _.bind(@render, this)

  render: () ->
    currentHead = @collection.first()
    lastPostItem = null
    @collection.each (post) =>
      postItem = @items[post.id]
      ;
      if postItem is undefined
        postItem = buildPostDom(post)
        if @headPost is null || currentHead is @headPost
          @$el.append(postItem)
        else
          if lastPostItem is null
            lastPostItem = postItem
            @$el.prepend(postItem)
          else
            lastPostItem.after(postItem)
        @items[post.id] = postItem

    @headPost = @collection.first()
    this

window.PostList = PostList