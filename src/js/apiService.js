var EntityEmbed = EntityEmbed || {};

(function(){

	var defaultConfig = {
		data: {},
		debug: 0,
		auth_token: '',
		domainName: '',
		path: ''
	};

	function ajaxWrapper(config){
		config = $.extend(true, {}, defaultConfig, config);
		config.data.debug = config.debug;
		config.data.auth_token = config.auth_token;

		return $.ajax({
				timeout: 15000,
				crossDomain: true,
				type: config.methodType, 
				dataType: 'json',
				url: config.domainName + config.path,
				data: JSON.stringify(config.data)
			});
	};

	function set(config) {
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

	function getAuthToken(token){
		return defaultConfig.auth_token;	
	};

	function getDomainName(d){
		return defaultConfig.domainName;
	};	

	function setDomainName(d){
		defaultConfig.domainName = d;
		if (!defaultConfig.domainName.endsWith('/'))
		{
			defaultConfig.domainName += '/';
		}
	};

	// determine debug level
	var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
	var isDevEnv = rgxDevEnv.test(window.location.host);
	if (isDevEnv){
		defaultConfig.auth_token = 'abc123';
		defaultConfig.debug = 1;
	}

	// expose necesary functionality
	EntityEmbed.apiService = {
		set: set,
		get: get,
		setAuthToken: setAuthToken,
		getAuthToken: getAuthToken,
		getDomainName: getDomainName,
		setDomainName: setDomainName
	};	
})();