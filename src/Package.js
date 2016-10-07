/*!
 * Package.js - A mojo for packing things right - v0.1
 * https://github.com/mcmlxxxiii/Package.js
 *
 * Copyright (c) 2016, Mykhaylo Gavrylyuk, https://github.com/mcmlxxxiii
 * Licensed under the MIT License.
 *
 */

function Package(name) {
    var moduleFnRegistry = {};
    var modules = {};

    var packageNamespaceReferences = {};
    packageNamespaceReferences.$ = function (name) {
        var nameParts = name.split(/[\.\/]{1}/);
        var lastLevel = nameParts.pop();
        var levelPath = '$.' + nameParts.join('.');
        var namespace = getOrCreatePrivateNamespace(levelPath);
        return namespace[lastLevel]
    };

    var privateModules = [];

    function getOrCreatePrivateNamespace(nsName) {
        if (!packageNamespaceReferences[nsName]) {
            packageNamespaceReferences[nsName] = {};
        }
        return packageNamespaceReferences[nsName];
    }

    function maybeDefineGetter(obj, name, getterFn) {
        var desc = Object.getOwnPropertyDescriptor(obj, name);
        if (!desc) {
            Object.defineProperty(obj, name, { get: getterFn });
        }
    }

    function registerModule(name, moduleFn) {
        if (typeof name !== 'string') {
            throw new Error('Module `' + name.toString() + '\' cannot be ' +
                            'registered! Module name should be a string.');
        }

        if (typeof moduleFn !== 'function') {
            throw new Error('Module `' + name + '\' cannot be ' +
                            'registered! Should be a function.');
        }

        if (moduleFnRegistry[name]) {
            throw new Error('Module `' + name + '\' is already registered! ' +
                            'Cannot get registered twice.');
        }


        var nameParts = name.split(/[\.\/]{1}/);
        for (var i = 0, l = nameParts.length; i < l; i++) {
            if (!nameParts[i].match(/^[a-z0-9\-][a-z0-9\_\-]+$/i)) {
                throw new Error('Invalid module name <' + name + '>! ' +
                        'Consider changing <' + nameParts[i] + '> part.');
            }
        }


        moduleFnRegistry[name] = moduleFn;
        var moduleLastNamePart = nameParts.pop();

        var currentLevel;
        var currentLevelPath = '$';
        if (nameParts.length) {
            while (nameParts.length) {
                var nextLevelName = nameParts.shift();
                var nextLevelPath = currentLevelPath + '.' + nextLevelName;

                currentLevel = getOrCreatePrivateNamespace(currentLevelPath);
                maybeDefineGetter(currentLevel, nextLevelName, (function (
                        nextLevelPath) {
                    return function () {
                        return getOrCreatePrivateNamespace(nextLevelPath);
                    }
                })(nextLevelPath));

                currentLevelPath = nextLevelPath;
            }
        }

        currentLevel = getOrCreatePrivateNamespace(currentLevelPath);

        Object.defineProperty(currentLevel, moduleLastNamePart, {
            get:  function () {
                return getModule(name);
            }
        });
    }

    this.publicModule = function (name, moduleFn) {
        registerModule.apply(null, arguments);
    };

    this.privateModule = function (name, moduleFn) {
        registerModule.apply(null, arguments);
        privateModules.push(name);
    };

    function getModule(name) {
        var module;

        if (!modules.hasOwnProperty(name)) {
            modules[name] = invokeModule(name);
        }

        return modules[name];
    }

    function invokeModule(name) {
        var moduleFn = moduleFnRegistry[name];
        var module = moduleFn ?
                moduleFn.call(getOrCreatePrivateNamespace('$')) :
                undefined;
        return module;
    }

    this.get = function (name) {
        return privateModules.indexOf(name) >= 0 ?
            undefined : getModule(name);
    };
}
