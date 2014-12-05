mongoose-context-protected-plugin
=================================

[![Circle CI](https://circleci.com/gh/pwmckenna/mongoose-context-protected-plugin.svg?style=svg)](https://circleci.com/gh/pwmckenna/mongoose-context-protected-plugin)
[![Build Status](https://travis-ci.org/pwmckenna/mongoose-context-protected-plugin.svg?branch=master)](https://travis-ci.org/pwmckenna/mongoose-context-protected-plugin)

##Which applications would this apply to?

Often mongoose/express apps start with CRUD routes being a super thin wrapper around database operations. Then to add access control, you might do checks in your route handlers. This is all well and good until you have lots of routes all operating on the same models. Perhaps on top of that you allow different types of users access to different parts of the model? This is an attempt to push the access control all the way down onto the models, so when you operate on them, you just provide the context that you're doing it in (on behalf of "John" for instance), and let the model sort it out.

If you think that ["fat model/skinny controller" is a load of rubbish](http://blog.joncairns.com/2013/04/fat-model-skinny-controller-is-a-load-of-rubbish), you're not going to be a fan of this plugin.


##What problem does this solve?
Rather than calling `save` or `toObject`/`toJSON` on your model, two alternatives, `contextProtectedRead`/`contextProtectedWrite` are exposed that take into account the context (generally the user that is requesting the change). This is generally useful when performing an action on the model because of an api call made from a user.

##Usage

####schema attribute canRead/canWrite -> boolean/function that resolves/returns a boolean
These functions are options that you set on your mongoose model attributes, that are passed a context, and are expected to return a boolean, depending on whether the action is allowed on the attribute. `this` can also be used, and is the document being edited.

```js
var TestSchema = new Schema({
    implicit: {
        type: String
        // canRead defaults to true when not specified
        // canWrite defaults to false when not specified
    },
    truthy: {
        type: String,
        canRead: true, // regardless of context, contextProtectedRead will return this value
        canWrite: true // regardless of context, contextProtectedWrite will allow writes to this attribute
    },
    falsy: {
        type: String,
        canRead: false, // regardless of context, contextProtectedRead will NOT return this value
        canWrite: false // regardless of context, contextProtectedWrite will NOT allow writes to this attribute
    },
    func: {
        type: String,
        canRead: function (user) {
            // allow the test to dictate whether this should be allowed or not
            return user.name === 'Patrick';
        },
        canWrite: function (user) {
            // if `this` had a owner field, you could compare user with this.owner
            // if only the document owner could write to this field
            return Q.resolve(user.name === 'Daniel');
        }
    }
});

TestSchema.plugin(require('mongoose-context-protected-plugin'));
```

####doc.contextProtectedRead (context) -> [Q](https://github.com/kriskowal/q) promise

Resolves to a JSON object, similar to what you might expect from `toObject`/`toJSON`, but only returns the values that are appropriate, depending on which `context` is provided. Will return just the fields where canRead was either not specified, equal to `true`, or returned `true`.

```js
// using an instance of TestSchema defined above
user.name = 'Patrick';
test.contextProtectedRead(user);
/** -> resolved promise
  {
    implicit: XXX,
    truthy: XXX,
    func: XXX
  }
**/
```

####doc.contextProtectedWrite (context, attrs) -> [Q](https://github.com/kriskowal/q) promise

Returns a promise, which resolves with the object if successful. If any attribute's `canWrite` is not specified, equals, or returns `false`, the promise will reject with an error describing why the write was not allowed.

Failure case
```js
// using an instance of TestSchema defined above
user.name = 'Patrick';
test.contextProtectedWrite(user, {
    implicit: XXX, // will fail because canWrite was not specified
    falsy: XXX, // will fail because canWrite === false
    func: XXX // will fail because name wasn't 'Daniel'
}); // -> rejected promise
```

```js
// using an instance of TestSchema defined above
user.name = 'Daniel';
test.contextProtectedWrite(user, {
    truthy: XXX, // will succeed because canWrite === true
    func: XXX // will succeed because user.name === 'Daniel'
}); // -> resolved promise
```
