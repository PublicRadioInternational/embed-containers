var EntityEmbed = EntityEmbed || {};

(function(){

	// PRIVATE

	var defaultConfig = {
		success : function(){},
		fail : function(){},
		always : function(){},
		data: {
			// object_id: '',
			// auth_token: ''
		},
		path: ''
	};

	function ajaxWrapper(config){
		config = $.extend(true, {}, defaultConfig, config);

		$.support.cors = true;

		return $.ajax({
				timeout: 15000,
				crossDomain: true,
				
				// TODO : this will not always be the case, but it
				// is how the API we are currently using is set up
				type: 'POST', 
				
				dataType: 'json',
				url: config.path,
				data: JSON.stringify(config.data)
			})
			.done(config.success)
			.fail(config.fail)
			.always(config.always);
	};

	function apiService(){};

	apiService.prototype.put = function(config) {
		config.methodType = 'PUT';
		return ajaxWrapper(config);
	};

	apiService.prototype.post = function(config) {
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	apiService.prototype.get = function(config) {
		config.methodType = 'GET';
		return ajaxWrapper(config);
	};

	apiService.prototype.del = function() {
		console.log('apiService.delete is not yet implemented');
	};

	EntityEmbed.apiService = new apiService();
})();