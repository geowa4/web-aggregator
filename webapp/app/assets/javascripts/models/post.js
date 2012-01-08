$(function() {
	var urlRoot = '/posts';
	var dataType = 'xml';

	var Post = Backbone.Model.extend({
		url: function() {
			return urlRoot + '/' + this.id + '.' + dataType;
		}
	});

	var Posts = Backbone.Collection.extend({
		model: Post,
		url: urlRoot + '.' + dataType,
		parse: function(response) {
			var $xml = $(response);
			var posts = [];
			$xml.find('entry').each(function() {
				var data = {};
				var $entry = $(this);
				data['id'] = $entry.find('id').text();
				data['title'] = $entry.find('title').text();
				data['updated'] = $entry.find('updated').text();
				data['summary'] = $entry.find('summary').text();
				posts.push(data)
			});
			return posts;
		}
	});

	/*Backbone.sync = function(method, model, options) {
		console.log(method);

		var type = this.methodMap[method];
		
		// Default JSON-request options.
		var params = _.extend({
			type:         type,
			contentType:  'application/xml',
			dataType:     dataType,
			processData:  false
		}, options);

		Backbone.prototype.sync.call(this, method, model, params);
	}*/

	// Expose Post objects
	window.Post = Post;
	window.Posts = Posts;
});