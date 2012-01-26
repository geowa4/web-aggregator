(function($) {
	function buildPostDom(post) {
		var article = $(document.createElement('article'));
		var header = $(document.createElement('header'));
		var provider = $(document.createElement('h3'));
		var source = $(document.createElement('a'));
		var pubDate = $(document.createElement('time'));
		var content = $(document.createElement('p'));
		provider.text(post.get('provider'));
		pubDate.attr('pubdate', '')
			.attr('datetime', post.get('published').toISOString())
			.text(post.get('published').toLocaleDateString())
			.appendTo(source);
		source.attr('href', post.get('url')).appendTo(provider);
		header.append(provider);
		content.html(post.get('content'));
		article.append(header);
		article.append(content);
		return article;
	}

	/**
	   This widget relies on Underscore and 
	   a Backbone Collection (options.posts)
	 */
	$.widget('ui.postList', {
		options: {
			posts: null
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
			this.headPost = null;
			this.tailPost = null;
			this.refresh();
		},

		refresh: function() {
			this.items = this.items || {};
			var self = this;
			if(this.options.posts !== null) {
				var currentHead = this.options.posts.first();
				var lastPostItem = null;
				this.options.posts.each(function(post) {
					var postItem = self.items[post.id];
					if(postItem === undefined) {
						postItem = buildPostDom(post);
						if(self.headPost === null || 
						   currentHead === self.headPost) {
							self.postList.append(postItem);
						} else {
							if(lastPostItem === null) {
								lastPostItem = postItem;
								self.postList.prepend(postItem);
							} else {
								lastPostItem.after(postItem);
							}
						}
						self.items[post.id] = postItem;
					}
				});
				this.headPost = this.options.posts.first();
				this.tailPost = this.options.posts.last();
			}
		}
	});
})(jQuery);