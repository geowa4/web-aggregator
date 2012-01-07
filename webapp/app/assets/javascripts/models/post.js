$(function() {
	var Post = Backbone.Model.extend({
		
	});

	var Posts = Backbone.Collection.extend({
		model: Post,
		url: '/posts.json'
	});

	// Expose Post objects
	window.Post = Post;
	window.Posts = Posts;
});