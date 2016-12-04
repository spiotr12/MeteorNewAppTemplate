import { Meteor } from 'meteor/meteor';

import { Logger } from '../../api/util/winston-logger.js';

Meteor.startup(() => {
	// code to run on server at startup
	Logger.info("Server has startup");
});
