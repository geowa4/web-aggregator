$(function() {
	var urlRoot = '/posts';
	var dataType = 'xml';

	var Post = Backbone.Model.extend({
		url: function() {
			return urlRoot + '/' + this.id + '.' + dataType;
		},

		parse: function(response) {
			var $xml = $($.parseXML(response));
			var data = {};
			$xml.find('entry').each(function() {
				var $entry = $(this);
				data['id'] = $entry.find('id').text();
				data['title'] = $entry.find('title').text();
				data['updated'] = $entry.find('updated').text();
				data['summary'] = $entry.find('summary').text();
			});
			return data;
		}
	});

	var Posts = Backbone.Collection.extend({
		model: Post,
		url: urlRoot + '.' + dataType
	});

	Backbone.sync = function(method, model, options) {
		var type = methodMap[method];
		
		// Default JSON-request options.
		var params = _.extend({
			type:         type,
			contentType:  'application/xml',
			dataType:     dataType,
			processData:  false
		}, options);

		Backbone.prototype.set.call(this, method, model, params);
	}

	// Expose Post objects
	window.Post = Post;
	window.Posts = Posts;
});