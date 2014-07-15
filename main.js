var app = angular.module('RobinApp', []);

app.controller('RobinController', ['robinUser', function(robinUser) {
	this.greeting = 'Hello';
	this.onLogin = true;
	this.user = robinUser;

	this.togglePage = function() {
		this.onLogin = !this.onLogin;
	};

	this.submitLogin = function() {
		this.user.isLoggedIn = true;
	};

	this.submitCreate = function() {
		alert('Can now create!');
	};

	this.logOut = function() {
		this.user.isLoggedIn = false;
		this.user.username = '';
		this.user.password = '';
		this.user.email = '';
	}
}]);

app.controller('RobinListController', ['$timeout', 'robinsList', 'robinUser', function($timeout, robinsList, robinUser) {
	this.robinsService = robinsList;
	this.robins = robinsList.getRobins();
	this.message = '';
	this.user = robinUser;
	console.warn(this.user);

	this.showMessage = function() {
		var self = this;

		$timeout(function() {
			self.message = 'Welcome to Robin!';
		}, 3000);
	};

	this.toggleRead = function(robin) {
		robin.read = !robin.read;
	};

	this.createNewRobin = function(robin, formRobin) {
		robin.user = {};
		robin.user.username = this.user.username;
		this.robinsService.addNewRobin(robin);

		formRobin.message = formRobin.image = formRobin.link = '';
		formRobin.$setPristine();
	}

	this.showMessage();
}]);

app.factory('robinsList', function() {
	var robins = [{
		user: {
			username: 'Tarif'
		},
		message: 'Hello this is a robin!',
		image: 'http://placekitten.com/580/350',
		link: 'http://www.espn.com'
	}, {
		user: {
			username: 'Andrew'
		},
		message: 'Hello everyone!',
		image: 'http://placekitten.com/580/350',
		link: 'http://www.espn.com'
	}, {
		user: {
			username: 'Peter'
		},
		message: 'Welcome to Angular!',
		image: 'http://placekitten.com/580/350',
		link: 'http://www.espn.com'
	}];

	return {
		getRobins: function() {
			return robins;
		},

		addNewRobin: function(newRobin) {
			robins.push(newRobin);
		}
	};
});

app.factory('robinUser', function() {
	return {
		username: '',
		password: '',
		email: '',
		isLoggedIn: false 
	};
});

app.directive('robinForm', function() {
	return {
		restrict: 'E',
		templateUrl: 'robin-form.html'
	};
});
