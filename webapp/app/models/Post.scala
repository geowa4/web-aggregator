package models

import play.api.libs.json._

case class Post(id: String, url: String, title: String, content: String, published: String, updated: String, provider: String)

object Post { 

  val empty = Post("", "", "", "", "", "", "")

  val sample = Post("1",
		 "https://plus.google.com/107365737413130005765/posts/RYanxDo7Q7Y", 
		 "Tonight, +Melissa Palumbo and I were choosing readings for our wedding. We were supposed to pick ...",
		 "Tonight, <span class=\"proflinkWrapper\"><span class=\"proflinkPrefix\">+</span><a href=\"https://plus.google.com/116280018791576760522\" class=\"proflink\" oid=\"116280018791576760522\">Melissa Palumbo</a></span> and I were choosing readings for our wedding. We were supposed to pick ones that conveyed a message of some kind about our love. We ended up picking some of the <i>shortest</i> ones (that weren&#39;t horribly misogynistic). How nice!",
		 "2012-01-06T02:01:48.000Z", 
		 "2012-01-06T02:01:48.496Z", 
		 "Google+")

  def all = Seq(
	Post.sample
  )

  def findById(id: String) = Post.all.find { _.id == id }
  

  implicit object PostFormat extends Format[Post] { 
	def reads(json: JsValue): Post = Post.empty
	def writes(p: Post): JsValue = JsObject(List(
      "id" -> JsString(p.id),
	  "url" -> JsString(p.url),
      "title" -> JsString(p.title),
	  "content" -> JsString(p.content),
	  "published" -> JsString(p.published),
	  "updated" -> JsString(p.updated),
	  "provider" -> JsString(p.provider)
	))
  }
}
