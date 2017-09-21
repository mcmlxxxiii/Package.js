**Package.js** is a minimalistic utility for bulding packages with
both private and public modules. Inside those packages, modules may easily
refer to each other.

Please learn from the following example.

```javascript
var pkg = new Package();

pkg.privateModule('one', function () {
    return 1;
});

pkg.privateModule('two', function () {
    return 2;
});

// Namespaces get formed with either slashes...
pkg.privateModule('three/four', function () {
    return 34;
});

// ... or periods.
pkg.privateModule('three.five', function () {
    return 35;
});

pkg.publicModule('main', function () {
    // Any package module may be refered to from inside of any package module
    // regardless of whether it is private or public.
    return this.one +
           this('two') +
           this.three.four +
           this('three/five') +
           this('three.five');
});


pkg.get('three/four') // undefined (private)
pkg.get('three.five') // undefined (private)
pkg.get('two')        // undefined (private)
pkg.get('main')       // 107 (= 1 + 2 + 34 + 35 + 35)
```

Please be careful with circular dependencies as there's no such check.
