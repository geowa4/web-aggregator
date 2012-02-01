$(function() {
	var posts = new Posts;

	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "posts",
			"about": "about"
		},

		posts: function() {
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
			$('ul.nav li.about').addClass('active');
			$('.about[data-role=page]').fadeIn();
		}
	});

	var app = new ApplicationRouter;
	Backbone.history.start({pushState: true});

	function navigate() {
		$('[data-role=page]').fadeOut();
		var target = $(this);
		$('ul.nav li').removeClass('active');
		app.navigate(target.attr('href'), true);
		return false;
	}
	$('ul.nav').on('click', 'a', navigate);
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