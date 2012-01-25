$(function() {
	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "posts",
			"about": "about"
		},

		posts: function() {
			Posts.bind('change', function() {
				$('#feed').postList('refresh');
			});
			Posts.fetch({
				success: function() {
					$('#feed').postList({posts: Posts})
						.find('p.loading').remove();
				}
			});
		},

		about: function() {
			alert('hi');
		}
	});

	var app = new ApplicationRouter;
	Backbone.history.start({pushState: true});

	$('ul.nav').on('click', 'a', function() {
		app.navigate($(this).attr('href'), true);
		return false;
	});
	
	//TODO: this should call a fn on postList
	$('.more-posts .btn').on('click', function() {
		$.ajax({
			url:'/posts/more.json', 
			data: {skip: 20}, 
			success: function(data) { 
				console.log(data); 
			}
		});
		return false;
	});
});