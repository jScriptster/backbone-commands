var MyView = Backbone.View.extend({
    initialize: function () {
        this.model.on('myevent', function (data) {
            console.log('OK - event ist da', data);
        });
    }
});

var MyModel = Backbone.Model.extend({
    commandScope: 'ns',
    initialize: function () {
        var thisScope = this;
        window.setTimeout(function () {
            thisScope.trigger('myevent', thisScope);
        }, 500);
        window.setTimeout(function () {
            thisScope.trigger('myevent2', thisScope);
        }, 1500);
    }
});

Backbone.Commands.registerCommand('MyCommand', function () {
    console.log('command', this);
});

Backbone.Commands.registerCommand('MyCommand2', function (orgEvent, data) {
    console.log('command2', this, orgEvent, data);
});

Backbone.Commands.createNamespace('ns', {
    myevent: 'MyCommand'
});

//Backbone.Commands.unbindCommand('ns', 'a');
Backbone.Commands.bindCommand('ns', 'myevent2', 'MyCommand2');

Backbone.Commands.extendNamespaceScope('ns', {a: 'a', b: 'b'});
Backbone.Commands.extendNamespaceScope('ns', {c: 'c'});


var m = new MyModel();


var v = new MyView({
    model: m
});