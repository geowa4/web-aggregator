package sync

import play.api.libs._
import play.api.libs.concurrent._
import play.api.libs.json._

import models.Post

object GooglePlusSync { 

  def start = { 
	val feed: Promise[ws.Response] = WS.url("http://mysite.com").get()
	val json: JsValue = feed.await(2000).get.json
  }

}
