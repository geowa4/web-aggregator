$(function() {
	var urlRoot = '/posts';
	var dataType = 'json';

	var Post = Backbone.Model.extend({
		defaults: {
			url: "",
			title: "",
			content: "",
			published: new Date,
			updated: new Date,
			provider: ""
		},

		initialize: function() {
			this.set({
				published: new Date(this.get('published')),
				updated: new Date(this.get('updated'))
			});
		},
		
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
});