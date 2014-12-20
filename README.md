# Ember-auth-tutorial

This is a tutorial outlining how to create an [Ember.js](http://emberjs.com) app with authorization using

- [Ember-CLI](http://www.ember-cli.com/)
- [Ember-Simple-Auth](https://github.com/simplabs/ember-simple-auth)
- [Torii](https://github.com/Vestorly/torii)


# Tutorial

This assumes you have git, node, bower, and ember-cli installed

### Create a new ember app

`ember init` or `ember new` see the ember-cli docs for more info



### Get dependencies

```
npm install --save-dev torii ember-cli-simple-auth-torii
ember generate ember-cli-simple-auth-torii
```



### Basic App setup

```
ember g route application
ember g route protected
ember g route login
ember g controller login
```



### Add Mixins

```
//--- /app/routes/application.js
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin);
```

```
//--- /app/routes/protected.js
import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin);
```



### Add Login Actions and setup controller

You could add more torii providers, see the [documentation](https://github.com/Vestorly/torii) for more info

```
//--- /app/controllers/login.js
import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
  authenticator: 'authenticator:torii'
});
```

```
//--- /app/routes/login.js
import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		googleLogin: function() {
			this.get('session').authenticate('simple-auth-authenticator:torii', 'google-oauth2');
			return;
		}
	}
});
```



### Update your templates

See [example](app/templates)



### Get google setup

This is likely analgous to other torii providers, I have only used google
- client_id from [google](https://console.developers.google.com/project) under API & auth > credentials
- update your authorized origins (ex. http://localhost:4200/)
- update the redirect URI (ex. http://localhost:4200)



### Update environment.js

```
//--- config/environment.js
ENV['torii'] = {
  providers: {
    'google-oauth2': {
      apiKey: 'client_id from google',
      scope: 'profile',
      redirectUri: 'http://localhost:4200'
    }
  }
};
```



### Test & Enjoy

run `ember server` and try it out!



### Bonus: Get user info from google

We are going to create a custom torii provider that will also get the users information from google.
We need the custom provider because the default google-ouath2 uses the code workflow rather than the
token workflow that the google plus api's need. This code extends [torii oauth2-bearer](https://github.com/Vestorly/torii/blob/master/lib/torii/providers/oauth2-bearer.js) and borrows from [torri google-oauth2](https://github.com/Vestorly/torii/blob/master/lib/torii/providers/google-oauth2.js). It also uses jQuery for the GET request, if there is a better way let me know!

- [Custom Provider](app/torii-providers/google-token)

Then update:

- [environment.js](config/environment.js) torii provider to match the custom providers name (this provider also uses scope `profile email`)
- Your [login action](app/routes/login.js) to match the custom providers name

Then enable the Google+ API in your [google dev console](https://console.developers.google.com/project)

You now will have access to `session.content.userName` and `session.content.userEmail`
