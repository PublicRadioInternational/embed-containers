var EntityEmbed = EntityEmbed || {};

(function(){

	var defaultConfig = {
		success: function(){},
		fail: function(){},
		always: function(){},
		data: {},
		debug: 0,
		auth_token: '',
		path: ''
	};

	function ajaxWrapper(config){
		config = $.extend(true, {}, defaultConfig, config);
		config.data.debug = config.debug;
		config.data.auth_token = config.auth_token;

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

	// TODO : refactor this - we (probably) only need one function, since everything uses POST now
	function put(config) {
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	function post(config) {
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	function get(config) {
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};
	function setAuthToken(token){
		defaultConfig.auth_token = token;
	};

	// determine debug level
	var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
	var isDevEnv = rgxDevEnv.test(window.location.host);
	if (isDevEnv){
		defaultConfig.debug = 1;
		setAuthToken('abc123');
	}

	// expose necesary functionality
	EntityEmbed.apiService = {
		put: put,
		post: post,
		get: get,
		setAuthToken
	};	
})();