import play._

import models._

class Global extends GlobalSettings {
 
  override def onStart(app: Application) {
	PostMongo.connectToMongo
	Logger.info("Application has started.");
  }  
  
  override def onStop(app: Application) {
	PostMongo.disconnectFromMongo
	Logger.info("Application has shutdown.");
  }  
  
}
