(function($) {
	var postListTemplate = _.template(
		'<article class="post-snippet" data-id="<%= post.id %>">' + 
			'<header>' + 
			'<h4><%= post.get("title") %></h4>' +
			'</header>' + 
			'<p><%= post.get("content") %></p>' +
			'</article>'
	);
	var publishDateTemplate = _.template('<time pubdate datetime="<%= post.get("published") %>"><%= post.get("published") %></time>');
	var updateDateTemplate = _.template('<time datetime="<%= post.get("updated") %>"><%= post.get("updated") %></time>');

	/**
	   This widget relies on Underscore and 
	   a Backbone Collection (options.posts)
	 */
	$.widget('ui.postList', {
		options: {
			posts: undefined
		},

		_setOption: function(key, value) {
			switch(key) {
			case "posts": 
				this.refresh();
				break;
			}

			$.Widget.prototype._setOption.apply(this, arguments);
			//jQuery UI 1.9: this._super( "_setOption", key, value );
		},

		_create: function() {
			this.postList = this.element.find('.post-list');
			this.metaTable = this.element.find('.post-meta table');
			this.sourceLink = this.metaTable.find('.source-link a');
			this.publishDate = this.metaTable.find('.publish-date');
			this.updateDate = this.metaTable.find('.update-date');
			this.refresh();
		},

		refresh: function() {
			this.items = this.items || {};
			var self = this;
			if(this.options.posts) {
				this.options.posts.each(function(post) {
					var postItem = self.items[post.id];
					if(postItem === undefined) {
						postItem = $(postListTemplate({post: post}));
						self.postList.append(postItem);
						self.items[post.id] = postItem;
						self.sourceLink.attr('href', post.get('url'));
						self.publishDate.html(publishDateTemplate({post: post}));
						self.updateDate.html(updateDateTemplate({post: post}));
					} else {
						postItem.find('h3').text(post.get('title'));
						postItem.find('p').html(post.get('content'));
						self.sourceLink.attr('href', post.get('url'));
						self.publishDate.html(publishDateTemplate({post: Post}));
						self.updateDate.html(updateDateTemplate({post: Post}));
					}
				});
			}
		}
	});
})(jQuery);