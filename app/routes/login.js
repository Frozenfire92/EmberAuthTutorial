import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		googleLogin: function() {
			this.get('session').authenticate('simple-auth-authenticator:torii', 'google-token');
			return;
		}
	}
});
