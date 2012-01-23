package sync

import java.util.{Timer,TimerTask}
import play.api.libs._
import play.api.libs.concurrent._
import play.api.libs.json._
import com.foursquare.rogue.Rogue._
import org.joda.time.DateTime

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
		  Post.where (_.rid eqs (jsPost \ "id").as[String])
            .modify (_.url setTo (jsPost \ "url").as[String])
            .modify (_.title setTo (jsPost \ "title").as[String])
            .modify (_.content setTo (jsPost \ "object" \ "content").as[String])
            .modify (_.published setTo new DateTime((jsPost \ "published").as[String]).toDate)
            .modify (_.updated setTo new DateTime((jsPost \ "updated").as[String]).toDate)
            .modify (_.provider setTo (jsPost \ "provider" \ "title").as[String])
            .upsertOne()
		}
      case _ => Unit
	}
  }
}
