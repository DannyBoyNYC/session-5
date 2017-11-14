angular.module('myApp', []);

angular.module('myApp').component('greetUser', {
    template: `<p>Hello, {{$ctrl.user}}!</p>`,
    controller: function GreetUserController() {
        this.user = 'world';
    }
});

angular.module('myApp').component('byeUser', {
    template: `<p>Bye, {{$ctrl.user}}!</p>`,
    controller: function GreetUserController() {
        this.user = 'cruel world';
    }
});