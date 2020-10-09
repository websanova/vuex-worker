# Vuex Worker

A super simpley lightweight extension for Vuex.


## Sponsor

If you like this component please consider sponsoring.

* [GitHub](https://github.com/sponsors/websanova)
* [Patreon](https://patreon.com/websanova)


## Demo

Check the [live demo](https://vue-worker.websanova.com) to see vue-worker in action.


## Issues

For any issues or errors with the plugin or docs:

* [Get in touch on Reddit](https://reddit.com/r/websanova)
* [Submit an issue on GitHub](https://github.com/websanova/vuex-worker/issues)


## Resources

* Coming soon...


## License

MIT licensed

Copyright (C) 2011-2020 Websanova https://websanova.com


## TODO

- setup List component (as example).




## Problems

So after many years of playing with Vue and Vuex I found I had quite a common set of problems which mainly came from fetching, displaying and manipulating data.

These problems became quite routine and I watned a nice and consistent way to deal with them. We also want a way to easily deal with non-consistent scenarios in a way that doesn't confuse any patterns we use for reptitive code scenarios.

One main thing I came to realize is that Vuex works very well as a nice data/state and code layer between my API and components. Sort of like the "C" in MVC type of pattern.

So vuex should primary
  a) store our data
  b) sync / update data
  c) handle all requests to the api

Our components are then primary split into "logic" based and "element" based components. The "logic" based components then act as the glue layer between our Vuex store and our elements. The elements are done complete dummies that only accept props and emit events.

Optionally we may create "widget" logic components which are something between a layout and element, for common arrangements such as listing a set of articles or items which are used throughout the app. This also useful for things like forms that we may want to repeatedly instert through the app. For instance a login box that might be used on a page and perhaps in a modal as well.


- deal with multiple competing filters (for instance resetting state, also sets page to 1, hitting home link clearing all filters, etc)
- filters in query params with watchers.
- restore query filters when coming back to a page.
- query filters on refresh should restore the data state.
- data sync across components.
- request handling (fire off requests in a consistent manner).
- request error handling (consistent way to deal with errors).
- response message handling (be able to manage message displays on requests, these should be optional).
- form handling (able to hold state in cases like wizards where you can go back/forward).
- data staging / "current" data (for tracking lists with alternate "current" / "selected" item).
- namesapcing and organization.
- consistent interface to deal with vuex.
- dispatch chaining to avoid retyping namespaces.
- able to hold state when moving across pages (with easy option to reset or not, should be able to toggle this easily with 1 line of code or option in a config/properties).
- Vuex hooks for initializing things directly in Vuex (rather then peppering these things around in our page components).




## Primer

The conception of this Vuex extension came from the idea of a (for the lack of a better term) "worker" pattern for Vuex stores.

The idea is to keep store modules as single actions to take advantage of reusability for common tasks like forms, filtering and requests to the api.

From there it was a matter of adding some syntax sugaring to remove repetitive typing and to also provide a cleaner way to dispatch calls to our stores.

**NOTE:** That there are more details on the "worker" pattern below and how it all fits together.

### Demo

Always the best way is to just try it yourself. There is a basic demo available with a bunch of sample code to try out.

(Code Samples)[]


### Examples

A few examples to help illustrate some of the core concepts in more detail.

#### Namespacing

First off there are two main things to accomplish.

1. Avoid requiring messy mappers all over our components.
2. Avoid reptitively typing the full paths to access our module actions.

This is done by always first setting the worker namespace, which all `dispatch` calls will then be relative to.

```js
this.$store
    .worker('user/account/update')
    .dispatch('update')
    .dispatch('send')
    .dispatch('clear')
;
```

It's important to note that these calls all part of a `Promise` chain and will behave accordingly. So if any of those dispatch calls returns a `Promise` they will run asynchronously otherwise they will run synchronously.

#### Workers

Each of our module actions should have a worker assigned to it from a predefined set which gives it actions to common tasks for forms, filtering and requests.

A store module will look something like the following.

```js
import list from '@websanova/vuex-worker/src/actions/list.js';

export default {
    namespaced: true,

    modules: {
        worker: list
    },

    actions: {
        send(ctx) {
            return ctx.dispatch('worker/send', {
                url: 'projects/list'
            });
        }
    }
}
```

The worker will then give us access to....







```js
this.$store
    .worker('user/account/update')
    .dispatch('update')
    .dispatch('send')
    .dispatch('clear')
;
```


So if the module action `send` returns a Promise / resolve




url: 'users/' + user.id +  '/projects/all'




#### Dispatch chaining.


```js

```



## Caveats

hooks only works when use addModule since it's built in manually....






 to Vuex so that dispatch calls to our store could be chanined together and simplify our action module code.

Here are a few examples to help better illustrate.



Further explanation and details on the Vuex "worker" pattern below.





*** Also handles param filter, form request with async changes....





This allows us to create sub modules which can act as "workers" for these common tasks.

For example, take the following user account and project actions:

```
./store
  ./modules
    ./user
      ./account
        ./avatar.js
        ./close.js
        ./password.js
        ./update.js
      ./project
        ./create.js
        ./list.js
        ./destroy.js
```

They will share from a common pool of tasks. For instance the `account/password`, `account/update` and `project/create` actions would need some "form" tasks, hile the `project/list` action may need some "filter" tasks. Furthermore all of them will need some "request" tasks to make a request to the api.











---

There is a lot to take in here, so I'll start with the syntax sugar.

There are a couple main principles we want to achieve.
 - keep our components light on logic
 - use our store as the main intermediary between api and components.
 - store should have reusable and consistent logic.
 - provide chaining to allow mulitple dispatch calls and reduce/remove need for mappers.
 - allow some data staging rather than passing data to dispatch via objects.


Note that this assumes we are using the "worker" sub modules as outlined further below.

Let's jump straight into some examples


So the idea is that we can have something like

this.$store
    .worker('user/account/update')
    .work('stage/update', {
        user: this.user
    })
    .work('form/update', {
        first_name: 'Rob'
    })
    .dispatch('send')
    .work('from/clear')
    .work('stage/clear')


The important thing to note here is that the "worker" just creates a namespace to chain on. So that "dispatch" calls are then relative and otherwise behave 100% as the normal $store.dispatch call.

A few things that are important to note:

".work()" is just a shortcut for ".dispatch()" just it prepends "worker/" in fron of our namespace.

So for instance

this.$store
    .worker('user/account/update')
    .work('stage/update', {});

and

this.$store
    .worker('user/account/update')
    .dispatch('worker/stage/update', {});

are the exact same thing.

The nice thing is we can dispatch to our predeinfed actions in our worker modules or just call our own.

For instance say we want a custom clear function that clears both form/stage


actions: {
    clear(ctx) {
        ctx.dispatch('worker/form/clear');
        ctx.dispatch('worker/stage/clear');
    }
}


Then we could do:

this.$store
    .worker('user/account/update')
    .work('stage/update', {
        user: this.user
    })
    .work('form/update', {
        first_name: 'Rob'
    })
    .dispatch('send')
    .dispatch('clear')



Basically we can mix and match whatever way is needed.


- this essentially takes out a lot of common boiler plate logic for
  - making a request
  - having status on the request (loading, success, error, etc)
  - handling errors (with consistent formatting).
  - handling a message alert / response (success or error)
  - handling filters for requests (especially with lists of items).
  - 


---




We have to start by introducting the concept of a worker first. The idea here is that we have some common logic to use through out our application which will be kept in our modules and sub modules.

At the end of the day there are a few main things that will happen

We'll call an http request with some filtes, keys or data such as a user id..... and such as ...., get back some data and store it. This is going to be 90% of our store code.

So let's split them up into separate actions. This has many benefits
 - a lot of reusable code
 - consistency
 - easy navigation such as user/acount/avatar/worker/send, or user/account/avatar/worker/form/update, etc...

From there we just want some syntax sugaring to simply things and create some chainging which can be very useful...

- this.$store.worker('user/account/avatar').dispatch().then().then().dispatch()
- we can do whatever we want it's just one long promise chain in the end.

Also added syntax sugar is the $store.worker('user/account/avatar').request() call.
- this peeks inside our store for a "request" object parameter, which in there we can define url, success, etc... to remove unnecessary repeating "promise wrapped http calls logic"
- these calls are all the same where pretty much just the url changes and occassionally we also want to fire off some success/error callbacks.
- everything else is done automagically for use, we don't need to set our store data each time.
- we are using the action module helpers which provides a consistent syntax.
- this also helps remove other annotying things with vuex such as the mappers, which IMHO is just a lot of ugly mapping



The other main design principle here is that we are keeping our components as "light" as possible. Meaning they are design heavy with little to no logic. Vuex acts as our intermediary layer between an api and our components.
 - So it stores our data
 - and also handles our calls to the api.
 - We should rarely make calls to our components, some exceptions might be a sepcial component like a modal that list some set of items to select so that is 100% local to that component and nowhere else.

From these concepts we'll want to setup what I'll call for lack of a better term a "worker" design pattern for Vuex.

A more complex vuex modules directory will look something like this:

./user
  ./account
    ./avatar.js
    ./password.js
    ./update.js
    ./billing.js
  ./projects
    ./avatar.js
    ./create.js
    ./current.js
    ./delete.js
    ./destroy.js
    ./list.js
    ./shared.js
    ./shares.js
    ./update.js
  ./subscribe
    ./create.js
    ./update.js
  ./share
    ./project.js
  ...
/admin
  /user
    ./create.js
    ./invite.js
    ./list.js
  /project
  /article
  /log
  ...



So the idea is that every thing is described as an action that we can perform with it's own file. This allows us to standardize things with calls such as:

form/update
form/clear
form/send
form/errors

filter/udpate
filter/reset

stage/update
stage/clear

etc...

each of our "actions" will have access to these predefined submodules that will do all the "work" for us.

From there we can create a set of standard actions (CRUD) that we make available to our individual actions.












Personally, I never kept much logic in the components to begin with, the stores are the main handler.

Event with Vue 3 composition api, it still seems messy to connect your composables with data. It can be useful but you still need to centralize your logic.