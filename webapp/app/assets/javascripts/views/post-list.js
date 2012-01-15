(function($) {
	var postListTemplate = _.template(
		'<article class="post-snippet" data-id="<%= post.id %>">' + 
			'<header><h3><%= post.get("title") %></h3></header>' + 
			'<section><p><%= post.get("content") %></p></section>' +
			'<footer><a href="<%= post.get("url") %>">Original Post</a></footer>' +
			'</article>'
	);

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
			this.refresh();
		},

		refresh: function() {
			this.items = this.items || {};
			var self = this;
			if(this.options.posts) {
				this.options.posts.each(function(post) {
					var $postItem = self.items[post.id];
					if($postItem === undefined) {
						$postItem = $(postListTemplate({post: post}));
						self.element.append($postItem);
						self.items[post.id] = $postItem;
					} else {
						$postItem.find('h3').text(post.get('title'));
						$postItem.find('p').html(post.get('content'));
						$postItem.find('footer a').attr('href', post.get('url'));
					}
				});
			}
		}
	});
})(jQuery);