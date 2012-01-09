$(function() {
	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "posts"
		},

		posts: function() {
			Posts.bind('change', function() {
				$('#aggregate').postList('refresh');
			});
			Posts.fetch({
				contentType: 'application/xml', 
				dataType: 'xml', 
				processData: false,
				success: function() {
					$('#aggregate').postList({posts: Posts});
				}
			});
		}
	});

	new ApplicationRouter;
	Backbone.history.start({pushState: true});
});