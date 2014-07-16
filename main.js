var app = angular.module('RobinApp', []);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);

app.controller('RobinController', ['robinUser', 'robinHttp', 'robinMessage', function(robinUser, robinHttp, robinMessage) {
	this.greeting = 'Hello';
	this.onLogin = true;
	this.user = robinUser;
	this.flashMessage = robinMessage;

	this.togglePage = function() {
		this.onLogin = !this.onLogin;
	};

	this.submitLogin = function(loginForm) {
		robinHttp.login(loginForm.username, loginForm.password)
			.success(angular.bind(this, function() {
				this.user.isLoggedIn = true;
				this.user.username = loginForm.username;

				loginForm.username = loginForm.password = '';
				loginForm.$setPristine();
			}))
			.error(function() {
				robinMessage.displayMessage('There was an error :(', true);
			});
	};

	this.submitCreate = function(signUpForm) {
		robinHttp.signUp(signUpForm.email, signUpForm.username, signUpForm.password)
			.success(function() {
				signUpForm.email = signUpForm.username = signUpForm.password = '';
				signUpForm.$setPristine();

				robinMessage.displayMessage('Your account has been successfully made!');
			})
			.error(function() {
				robinMessage.displayMessage('There was an error :(', true);
			});
	};

	this.logOut = function() {
		robinHttp.logOut()
			.success(angular.bind(this, function() {
				this.user.username = '';
				this.user.isLoggedIn = false;

				robinMessage.displayMessage('You\'ve successfully logged out!');
			}))
			.error(function() {
				robinMessage.displayMessage('There was an error :(', true);
			})
	};
}]);

app.controller('RobinListController', ['$interval', 'robinsList', 'robinUser', 'robinHttp', function($interval, robinsList, robinUser, robinHttp) {
	this.robinsService = robinsList;
	this.user = robinUser;

	this.toggleRead = function(robin) {
		robinHttp.markAsRead(id)
			.success(angular.bind(function() {
				robin.read = !robin.read;
			}))
			.error(function() {
				robinMessage.displayMessage('There was an error :(', true);
			});
	};

	this.createNewRobin = function(robin, formRobin) {
		robin.user = {};
		robin.user.username = this.user.username;
		this.robinsService.addNewRobin(robin);

		formRobin.message = formRobin.image = formRobin.link = '';
		formRobin.$setPristine();
	}

	this.fetchRobins = function() {
		robinsList.loadRobins();
	};

	this.fetchRobins();
	$interval(angular.bind(this, function() {
		this.fetchRobins();
	}), 5000);
}]);

app.factory('robinsList', ['robinHttp', function(robinHttp) {
	return {
		robins: [],

		loadRobins: function() {
			return robinHttp.getRobins()
				.success(angular.bind(this, function(robins) {
					this.robins = robins;
				}))
		},

		addNewRobin: function(newRobin) {
			robins.push(newRobin);
		}
	};
}]);

app.factory('robinUser', function() {
	return {
		username: '',
		isLoggedIn: false 
	};
});

app.directive('robinForm', function() {
	return {
		restrict: 'E',
		templateUrl: 'robin-form.html'
	};
});

app.directive('robinChirp', function() {
	return {
		restrict: 'E',
		templateUrl: 'robin-chirp.html',
		scope: {
			robin: '=',
			toggleRead: '&'
		},

		link: function(scope, el, attrs) {
			el.on('mouseover', function() {
				scope.robin.showCaption = true;
				scope.$apply();
			});

			el.on('mouseout', function() {
				scope.robin.showCaption = false;
				scope.$apply();
			});
		}
	}
});

app.service('robinMessage', ['$timeout', function($timeout) {
	return {
		message: {
			text: '',
			error: ''
		},

		displayMessage: function(message, time, error) {
			var time;
			if (typeof time === 'number') {
				time = time || 3000;
				this.message.error = this.message.error;
			} else {
				this.message.error = time;
				time = 3000;
			}

			this.message.text = message;

			$timeout(angular.bind(this, function() {
				this.message.text = '';
				this.message.error = false;
			}), time);
		}
	}
}]);

app.service('robinHttp', ['$http', function($http) {
	var makeRequest = function(method, resource, data) {
		var data = data || {},
			url = 'http://cryptic-hamlet-4443.herokuapp.com';

		return $http({
			method: method,
			url: url + resource,
			data: data
		});
	}

	return {
		signUp: function(email, username, password) {
			var data = {
				email: email,
				username: username,
				password: password
			};

			return makeRequest('POST', '/signup', data);
		},

		login: function(username, password) {
			var data = {
				username: username,
				password: password
			};

			return makeRequest('POST', '/authorize', data);
		},

		logOut: function() {
			return makeRequest('DELETE', '/authorize');
		},

		getRobins: function() {
			return makeRequest('GET', '/robins');
		},

		markAsRead: function(id) {
			return makeRequest('PATCH', '/robins/' + id + '/read');
		}
	}
}]);