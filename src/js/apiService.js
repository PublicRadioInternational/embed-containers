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
		debug: 0,
		path: ''
	};

	function ajaxWrapper(config){
		config = $.extend(true, {}, defaultConfig, config);
		config.data.debug = config.debug;

		$.support.cors = true;

		return $.ajax({
				timeout: 15000,
				crossDomain: true,
				type: config.methodType, 
				dataType: 'json',
				url: config.path,
				data: JSON.stringify(config.data)
			})
			.done(config.success)
			.fail(config.fail)
			.always(config.always);
	};

	function apiService(){
		var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
		var isDevEnv = rgxDevEnv.test(window.location.host);
		
		if (isDevEnv){
			defaultConfig.debug = 1;
		}
	};

	// TODO : refactor this - we (probably) only need one function, since everything uses POST now

	apiService.prototype.put = function(config) {
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	apiService.prototype.post = function(config) {
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	apiService.prototype.get = function(config) {
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	EntityEmbed.apiService = new apiService();
})();