/**
 * Backbone-Commands
 * Extends backbone with a command-pattern implementation.
 * @jScriptster
 * dependencies: Backbone.js, Underscore.js
 */

(function () {
    var orgTriggerFn = Backbone.Events.trigger,
        commands = {},
        scopes = {},
        commandBindings = {};

    Backbone.Model.prototype.trigger =
    Backbone.View.prototype.trigger =
    Backbone.Collection.prototype.trigger =
    Backbone.Router.prototype.trigger =
    Backbone.Events.trigger = function (eventname) {
        var namespace = this.commandScope;

        if (_.isObject(commandBindings[namespace])) {
            if (_.isString(commandBindings[namespace][eventname]) === true
                    && _.isFunction(commands[commandBindings[namespace][eventname]]) === true) {
                commands[commandBindings[namespace][eventname]].apply(scopes[namespace], arguments);
            }
        }

        orgTriggerFn.apply(this, arguments);
    };


    Backbone.Commands = {
        /**
         * Register a command
         * @param commandName {string} unique name for the command
         * @param executeFn {function} command 'execute'-function
         */
        registerCommand: function (commandName, executeFn) {
            if (_.isString(commandName) === false || commandName.length === 0) {
                throw new Error('commandName must be a string with length > 0');
            }

            if (_.isFunction(executeFn) === false) {
                throw new Error('executeFn must be a function');
            }

            if (_.isUndefined(commands[commandName]) === false) {
                throw new Error('Command ' + commandName + ' already exist');
            }

            commands[commandName] = executeFn;
        },

        /**
         * Create a new namespace for commands
         * @param namespace {string}
         * @param bindings {object} Map events to commands (key:value -> eventname:commandname)
         */
        createNamespace: function (namespace, bindings) {
            var bindingsObj = {};

            if (_.isString(namespace) === false) {
                throw new Error('Namespace must be a string!');
            }

            if (_.isObject(commandBindings[namespace]) === true || _.isObject(scopes[namespace]) === true) {
                throw new Error('Namespace already exist!');
            }

            if (_.isObject(bindings) === true) {
                bindingsObj = _.pick(bindings, function(value, key, object) {
                    return (_.isString(value) === true && value.length > 0);
                });
            }

            scopes[namespace] = {};
            commandBindings[namespace] = bindingsObj;
        },

        /**
         *
         * @param namespace {string}
         * @param eventName {string}
         * @param commandName {string}
         */
        bindCommand: function (namespace, eventName, commandName) {
            if (_.isString(namespace) === false
                || _.isString(eventName) === false
                || _.isString(commandName) === false) {
                throw new Error('All params must be strings');
            }

            if (_.isObject(commandBindings[namespace]) === false) {
                throw new Error('Namespace ' + namespace + ' does not exist');
            }

            if (_.isUndefined(commandBindings[namespace][eventName]) === false) {
                throw new Error('Binding to event ' + eventName + ' in namespace ' + namespace + ' already exist');
            }

            commandBindings[namespace][eventName] = commandName;
        },

        /**
         *
         * @param namespace {string}
         * @param eventName {string}
         */
        unbindCommand: function (namespace, eventName) {
            if (_.isObject(commandBindings[namespace]) === true) {
                delete commandBindings[namespace][eventName];
            }
        },

        /**
         *
         * @param namespace {string}
         * @param scopeExtensions {string}
         */
        extendNamespaceScope: function (namespace, scopeExtensions) {
            if (_.isObject(scopes[namespace]) === false) {
                throw new Error('Namespace ' + namespace + ' does not exist');
            }

            _.each(scopeExtensions, function(value, key, object) {
                if (_.isUndefined(scopes[namespace][key]) === false) {
                    throw new Error('Attribute ' + key + ' already exist in scope for namespace ' + namespace);
                }
            });

            _.extend(scopes[namespace], scopeExtensions);
        }
    };


}());