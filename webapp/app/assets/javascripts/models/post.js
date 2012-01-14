$(function() {
	var urlRoot = '/posts';
	var dataType = 'json';

	var Post = Backbone.Model.extend({
		url: function() {
			return urlRoot + '/' + this.id + '.' + dataType;
		}
	});

	var Posts = Backbone.Collection.extend({
		model: Post,
		url: urlRoot + '.' + dataType
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