$(function() {
	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "posts"
		},

		posts: function() {
			Posts.fetch({
				contentType: 'application/xml', 
				dataType: 'xml', 
				processData: false,
				success: function() {
					Posts.each(function(post) {
						console.log(post.get('title'));
					});
					$('#aggregate').postList({posts: Posts});
				}
			});
		}
	});

	new ApplicationRouter;
	Backbone.history.start({pushState: true});
});