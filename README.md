**Package.js** is a minimalistic utility for bulding packages with
both private and public modules. Within such packages, private modules can still
refer to one another .

In the age of CommonJS and AMD, such packages are useful in setups where
javascript can NOT or should NOT be used (for various reasons)
to build so-called front-end bundles.

With **Package.js**, such bundles can be built with simple concatenation of
module files.


Please learn from the following naïve example.

```javascript
var proj = new Package();

// --- proj/a.js ---
proj.privateModule('a', function () {
    return 'a+';
});

// --- proj/b.js ---
proj.privateModule('b', function () {
    return 'b+';
});

// --- proj/c/d.js ---
// Namespaces get formed with either slashes...
proj.privateModule('c/d', function () {
    return 'cd+';
});

// --- proj/c/e.js ---
// ... or periods
proj.privateModule('c.e', function () {
    return 'ce+';
});

// --- proj/main.js ---
proj.publicModule('main', function () {
    // Any package module may be refered to from inside of any package module
    // regardless of whether it is private or public.
    return this.a +
           this('b') +
           this.c.d +
           this('c/e') +
           this('c.e');
});


// --- ~ ---

proj.get('c/d')    // undefined (private)
proj.get('c.e')    // undefined (private)
proj.get('b')      // undefined (private)
proj.get('main')   // a+b+cd+ce+ce+
```

Please be careful with circular dependencies as there's no such check.
