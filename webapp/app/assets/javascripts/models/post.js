$(function() {
	var urlRoot = '/posts';
	var dataType = 'xml';

	var Post = Backbone.Model.extend({
		url: function() {
			return urlRoot + '/' + this.id + '.' + dataType;
		},

		parse: function(response) {
			var $xml = $(response);
			var posts = [];
			$xml.find('entry').each(function() {
				var data = {};
				var $entry = $(this);
				data['id'] = $entry.find('id').text();
				data['title'] = $entry.find('title').text();
				data['updated'] = $entry.find('updated').text();
				data['summary'] = $entry.find('summary').text();
				posts.push(data)
			});
			return posts[0];
		}
	});

	var Posts = Backbone.Collection.extend({
		model: Post,

		url: urlRoot + '.' + dataType,

		parse: function(response) {
			var $xml = $(response);
			var posts = [];
			$xml.find('entry').each(function() {
				var data = {};
				var $entry = $(this);
				data['id'] = $entry.find('id').text();
				data['title'] = $entry.find('title').text();
				data['updated'] = $entry.find('updated').text();
				data['summary'] = $entry.find('summary').text();
				posts.push(data)
			});
			return posts;
		}
	});

	// Expose Post objects
	//window.Post = Post;
	window.Posts = new Posts;

	/*
	  Usage:
	  feed = new Posts;
	  feed.fetch({contentType: 'application/xml', dataType: 'xml', processData: false});
	  feed.each(function(post) { console.log(post.fetch({contentType: 'application/xml', dataType: 'xml', processData: false})); });
	  feed.each(function(post) { console.log(post.get('title')); });
	 */
});