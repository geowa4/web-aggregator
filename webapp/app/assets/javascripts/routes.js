$(function() {
	var posts = new Posts;

	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "posts",
			"/": "posts",
			"about": "about"
		},

		_preRoute: function() {
			$('[data-role=page]').fadeOut();
			$('ul.nav li').removeClass('active');
		},

		posts: function() {
			this._preRoute();
			$('ul.nav li.posts').addClass('active');
			$('.posts[data-role=page]').fadeIn();
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
			this._preRoute();
			$('ul.nav li.about').addClass('active');
			$('.about[data-role=page]').fadeIn();
		}
	});

	var app = new ApplicationRouter;
	Backbone.history.start({pushState: true});

	function navigate() {
		app.navigate($(this).attr('href'), true);
		return false;
	}
	$('ul.nav a').on('click', 'a', navigate);
	$('a.brand').on('click', navigate);
	
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