$(function() {
	var posts = new Posts

	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "posts",
			"about": "about"
		},

		posts: function() {
			posts.bind('change', function() {
				$('#feed').postList('refresh');
			});
			posts.bind('add', function() {
				$('#feed').postList('refresh');
			});
			posts.fetch({
				success: function() {
					$('#feed').postList({posts: posts})
						.find('p.loading').remove();
				}
			});
		},

		about: function() {
			$('[data-role=page]').fadeOut();
			$('.about[data-role=page]').fadeIn();
		}
	});

	var app = new ApplicationRouter;
	Backbone.history.start({pushState: true});

	$('ul.nav').on('click', 'a', function() {
		app.navigate($(this).attr('href'), true);
		return false;
	});
	
	$('.more-posts .btn').on('click', function(evt) {
		var button = $(this);
		var morePosts = new Posts
		morePosts.url = '/posts/more.json';
		morePosts.fetch({
			data: {
				skip: posts.size()
			},
			success: function(mp) {
				if(morePosts.size() === 0) {
					var noMore = $(document.createElement('p'));
					noMore.text('There are no more posts to load.')
						.prepend($(document.createElement('strong'))
								 .text('Sorry!'));
					button.closest('p').replaceWith(noMore);
					noMore.closest('div.more-posts')
						.removeClass('more-posts')
						.addClass('alert-message info');
				} else {
					posts.add(morePosts.models);
				}
			}
		});
		evt.preventDefault();
	});
});