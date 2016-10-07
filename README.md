**Package.js** is a minimalistic utility for bulding packages with both private and
public modules. Inside those packages, modules may easily refer to each other.

Please learn from the following example.

```javascript
var pkg = new Package();

pkg.privateModule('bar', function () {
    return '-bar-';
});

pkg.privateModule('baz', function () {
    return '-baz-';
});

// Namespaces get formed with either slashes...
pkg.privateModule('foo/bar', function () {
    return '=foo bar=';
});

// ... or periods.
pkg.privateModule('foo.baz', function () {
    return '=foo baz=';
});

pkg.publicModule('main', function () {
    // Any package module may be refered to from inside of any package module
    // regardless of whether it is private of public.
    return this.bar +
           this('baz') +
           this.foo.bar +
           this('foo/baz') +
           this('foo.baz');
});


pkg.get('foo/bar') // undefined (private)
pkg.get('foo.baz') // undefined (private)
pkg.get('baz')     // undefined (private)
pkg.get('main')    // '-bar--baz-=foo bar==foo baz==foo baz='
```

For the time being, please be careful with circular dependencies as there's
no such check.
