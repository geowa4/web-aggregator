;
(function () {
    function buildPostDom(post) {
        var article = $(document.createElement('article'));
        var header = $(document.createElement('header'));
        var provider = $(document.createElement('h3'));
        var source = $(document.createElement('a'));
        var pubDate = $(document.createElement('time'));
        var content = $(document.createElement('p'));
        provider.text(post.get('provider'));
        pubDate.attr('pubdate', '')
            .attr('datetime', post.get('published').toISOString())
            .text(post.get('published').toLocaleDateString())
            .appendTo(source);
        source.attr('href', post.get('url')).appendTo(provider);
        header.append(provider);
        content.html(post.get('content'));
        article.append(header);
        article.append(content);
        return article;
    }

    window.PostList = Backbone.View.extend({
        initialize:function () {
            this.$el.empty();
            this.headPost = null;
            this.items = {};
        },

        render:function () {
            var view = this;
            var currentHead = this.collection.first();
            var lastPostItem = null;
            this.collection.each(function (post) {
                var postItem = view.items[post.id];
                if (postItem === undefined) {
                    postItem = buildPostDom(post);
                    if (view.headPost === null ||
                        currentHead === view.headPost) {
                        view.$el.append(postItem);
                    } else {
                        if (lastPostItem === null) {
                            lastPostItem = postItem;
                            view.$el.prepend(postItem);
                        } else {
                            lastPostItem.after(postItem);
                        }
                    }
                    view.items[post.id] = postItem;
                }
            });
            this.headPost = this.collection.first();
            return this;
        }
    });
}());