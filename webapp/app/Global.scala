import play._

import models._
import sync._

class Global extends GlobalSettings {
 
  override def onStart(app: Application) {
	PostMongo.connectToMongo
	GooglePlusSync.start
	Logger.info("Application has started.");
  }  
  
  override def onStop(app: Application) {
	PostMongo.disconnectFromMongo
	Logger.info("Application has shutdown.");
  }  
  
}