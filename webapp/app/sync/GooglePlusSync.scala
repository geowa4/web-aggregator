package sync

import play.api.libs._
import play.api.libs.concurrent._
import play.api.libs.json._
import com.foursquare.rogue.Rogue._

import models._

object GooglePlusSync { 

  def start = { 
	val feed: Promise[ws.Response] = WS.url("https://www.googleapis.com/plus/v1/people/107365737413130005765/activities/public?key=AIzaSyBaWFITSxalsX9sG9Qb2GmO0AQzDCgNlD4").get()
	feed.await(2000).get.json \ "items" match { 
	  case JsArray(value) => 
        value foreach { jsPost =>
		  Post.where (_.url eqs (jsPost \ "url" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })).modify (_.title setTo (jsPost \ "title" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })).modify (_.content setTo (jsPost \ "object" \ "content" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })).modify (_.published setTo (jsPost \ "published" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })).modify (_.updated setTo (jsPost \ "updated" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })).modify (_.provider setTo (jsPost \ "provider" \ "title" match {
		    case JsString(data) => data; 
		    case _ => ""
		  })).upsertOne()
		}
	   /* value foreach { jsPost =>
	      val post = Post.createRecord
	      post.url(jsPost \ "url" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })
	      post.title(jsPost \ "title" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })
	      post.content(jsPost \ "object" \ "content" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })
	      post.published(jsPost \ "published" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })
	      post.updated(jsPost \ "updated" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })
	      post.provider(jsPost \ "provider" \ "title" match { 
		    case JsString(data) => data; 
		    case _ => ""
		  })
		  post.save
	    }*/
      case _ => None
	}
  }
}
