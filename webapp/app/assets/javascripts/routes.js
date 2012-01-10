$(function() {
	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "posts",
			"about": "about"
		},

		posts: function() {
			Posts.bind('change', function() {
				$('#content').postList('refresh');
			});
			Posts.fetch({
				contentType: 'application/xml', 
				dataType: 'xml', 
				processData: false,
				success: function() {
					$('#content').postList({posts: Posts});
				}
			});
		},

		about: function() {
			alert('hi');
		}
	});

	var app = new ApplicationRouter;
	Backbone.history.start({pushState: true});

	$('nav').on('click', 'a', function() {
		app.navigate($(this).attr('href'), true);
		return false;
	});
});