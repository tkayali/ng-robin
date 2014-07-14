var app = angular.module('RobinApp', []);

app.controller('RobinController', function() {
	this.greeting = 'Hello';
	this.onLogin = true;

	this.robins = [{
		user: 'Tarif',
		message: 'Hello this is a robin!'
	}, {
		user: 'Andrew',
		message: 'Hello everyone!'
	}, {
		user: 'Peter',
		message: 'Welcome to Angular!'
	}];

	this.togglePage = function() {
		this.onLogin = !this.onLogin;
	}
});

app.controller('MessageController', function() {
	this.toggleRead = function(robin) {
		robin.read = !robin.read;
	}
});