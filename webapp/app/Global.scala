import play._

import models._
import sync._

class Global extends GlobalSettings {
 
  override def onStart(app: Application) {
	PostMongo.connectToMongo
	GooglePlusSync.start
	GitHubSync.start
	StackOverflowSync.start
	Logger.info("Application has started.");
  }  
  
  override def onStop(app: Application) {
	GooglePlusSync.stop
	GitHubSync.stop
	StackOverflowSync.stop
	PostMongo.disconnectFromMongo
	Logger.info("Application has shutdown.");
  }  
  
}
