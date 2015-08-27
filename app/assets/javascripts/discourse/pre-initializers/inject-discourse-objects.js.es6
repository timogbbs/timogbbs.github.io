import Session from 'discourse/models/session';
import AppEvents from 'discourse/lib/app-events';
import Store from 'discourse/models/store';
import DiscourseURL from 'discourse/lib/url';
import DiscourseLocation from 'discourse/lib/discourse-location';

function inject() {
  const app = arguments[0],
        name = arguments[1],
        singletonName = Ember.String.underscore(name).replace(/_/, '-') + ':main';

  Array.prototype.slice.call(arguments, 2).forEach(dest => app.inject(dest, name, singletonName));
}

function injectAll(app, name) {
  inject(app, name, 'controller', 'component', 'route', 'view', 'model');
}

export default {
  name: "inject-discourse-objects",

  initialize(container, app) {
    const appEvents = AppEvents.create();
    app.register('app-events:main', appEvents, { instantiate: false });
    injectAll(app, 'appEvents');
    DiscourseURL.appEvents = appEvents;

    app.register('store:main', Store);
    inject(app, 'store', 'route', 'controller');

    const site = Discourse.Site.current();
    app.register('site:main', site, { instantiate: false });
    injectAll(app, 'site');

    app.register('site-settings:main', Discourse.SiteSettings, { instantiate: false });
    injectAll(app, 'siteSettings');

    app.register('session:main', Session.current(), { instantiate: false });
    injectAll(app, 'session');

    app.register('current-user:main', Discourse.User.current(), { instantiate: false });
    inject(app, 'currentUser', 'component', 'route', 'controller');

    app.register('message-bus:main', window.MessageBus, { instantiate: false });
    injectAll(app, 'messageBus');

    app.register('location:discourse-location', DiscourseLocation);
  }
};
