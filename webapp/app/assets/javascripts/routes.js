;
$(function () {
    var posts = new Posts;

    var ApplicationRouter = Backbone.Router.extend({
        routes:{
            "":"posts",
            "/":"posts",
            "about":"about"
        },

        _preRoute:function () {
            $('[data-role=page]').fadeOut();
            $('ul.nav li').removeClass('active');
        },

        posts:function () {
            var router = this;
            this._preRoute();
            $('[data-role=page]').promise().then(function() {
                $('ul.nav li.posts').addClass('active');
                posts.fetch({
                    success:function () {
                        if (router.postList == null) {
                            router.postList = new PostList({
                                el:$('#feed .post-list'),
                                collection:posts
                            });
                        }
                        router.postList.render();
                        $('.posts[data-role=page]').fadeIn();
                    }
                });
            });
        },

        about:function () {
            this._preRoute();
            $('[data-role=page]').promise().then(function() {
                $('ul.nav li.about').addClass('active');
                $('.about[data-role=page]').fadeIn();
            });
        }
    });

    var app = new ApplicationRouter;
    Backbone.history.start({pushState:true});

    function navigate() {
        app.navigate($(this).attr('href'), true);
        return false;
    }

    $('ul.nav').on('click', 'a', navigate);
    $('a.brand').on('click', navigate);

    $('.more-posts .btn').on('click', function (evt) {
        var button = $(this);
        var morePosts = new Posts
        morePosts.url = '/posts/more.json';
        morePosts.fetch({
            data:{
                skip:posts.size()
            },
            success:function (mp) {
                if (morePosts.size() === 0) {
                    var noMore = $(document.createElement('span'));
                    noMore.append($(document.createElement('strong'))
                        .text('Sorry!'))
                        .append($(document.createElement('span'))
                        .text('There are no more posts to load.'));
                    button.closest('p').replaceWith(noMore);
                    noMore.closest('div.more-posts')
                        .removeClass('more-posts')
                        .addClass('alert alert-info')
                        .prepend($(document.createElement('a'))
                        .addClass('close')
                        .attr('data-dismiss', 'alert')
                        .html('&times;'));
                } else {
                    posts.add(morePosts.models);
                }
            }
        });
        evt.preventDefault();
    });
});