package sync

import java.util.{Timer,TimerTask}
import play.api.libs._
import play.api.libs.concurrent._
import play.api.libs.json._
import com.foursquare.rogue.Rogue._

import models._

object GooglePlusSync { 

  val service = new Timer

  def start { 
	service.scheduleAtFixedRate(new TimerTask { 
	  def run = sync
	}, 0, 60 * 1000 * 30)
	println("Google Plus Sync service started")
  }

  def stop { 
	service.cancel
	println("Google Plus Sync service stopped")
  }

  def sync { 
	println("Syncing Google+")
	val feed: Promise[ws.Response] = WS.url("https://www.googleapis.com/plus/v1/people/107365737413130005765/activities/public?key=AIzaSyBaWFITSxalsX9sG9Qb2GmO0AQzDCgNlD4").get()
	feed.await(5000).get.json \ "items" match { 
	  case JsArray(value) => 
        value foreach { jsPost =>
		  Post.where (_.rid eqs (jsPost \ "id" match { 
			case JsString(data) => data
			case _ => ""
		  })).modify (_.url setTo (jsPost \ "url" match { 
		    case JsString(data) => data
		    case _ => ""
		  })).modify (_.title setTo (jsPost \ "title" match { 
		    case JsString(data) => data 
		    case _ => ""
		  })).modify (_.content setTo (jsPost \ "object" \ "content" match { 
		    case JsString(data) => data 
		    case _ => ""
		  })).modify (_.published setTo (jsPost \ "published" match { 
		    case JsString(data) => data 
		    case _ => ""
		  })).modify (_.updated setTo (jsPost \ "updated" match { 
		    case JsString(data) => data 
		    case _ => ""
		  })).modify (_.provider setTo (jsPost \ "provider" \ "title" match {
		    case JsString(data) => data 
		    case _ => ""
		  })).upsertOne()
		}
      case _ => None
	}
  }
}
