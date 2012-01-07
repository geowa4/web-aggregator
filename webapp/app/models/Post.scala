package models

case class Post(id: String, url: String, title: String, content: String, published: String, updated: String, provider: String)

object Post { 

  val empty = Post("", "", "", "", "", "", "")

  def all = Seq(
	Post("1",
		 "https://plus.google.com/107365737413130005765/posts/RYanxDo7Q7Y", 
		 "Tonight, +Melissa Palumbo and I were choosing readings for our wedding. We were supposed to pick ...",
		 "Tonight, <span class=\"proflinkWrapper\"><span class=\"proflinkPrefix\">+</span><a href=\"https://plus.google.com/116280018791576760522\" class=\"proflink\" oid=\"116280018791576760522\">Melissa Palumbo</a></span> and I were choosing readings for our wedding. We were supposed to pick ones that conveyed a message of some kind about our love. We ended up picking some of the <i>shortest</i> ones (that weren&#39;t horribly misogynistic). How nice!",
		 "2012-01-06T02:01:48.000Z", 
		 "2012-01-06T02:01:48.496Z", 
		 "Google+")
  )
  
}

implicit object PostFormat extends Format[Post] { 
  def reads(json: JsValue): User = Post.empty
  def writes(p: Post): JsValue = JsObject(List(
    "id" -> JsString(p.id),
	"url" -> JsString(p.url),
    "title" -> JsString(p.name),
	"content" -> JsString(p.content),
	"published" -> JsString(p.published),
	"updated" -> JsString(p.updated),
	"provider" -> JsString(p.provider)
  ))
}
