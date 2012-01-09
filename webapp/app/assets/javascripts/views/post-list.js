(function($) {
	var postListTemplate = _.template(
		'<li class="post-snippet" data-id="<%= post.id %>">' + 
			'<a href="<%= post.get("url") %>"><%= post.get("title") %></a>' +
			'</li>'
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
			var $el = this.element;
			var $postItems = $('<ul>').addClass('post-items').appendTo($el);
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
						self.element.find('ul.post-items').append($postItem);
						self.items[post.id] = $postItem;
					} else {
						$postItem.find('a').text(post.get('content'));
					}
				});
			}
		}
	});
})(jQuery);