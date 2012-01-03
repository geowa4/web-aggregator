case class Post(url: String, content: String)

object Post { 
	
	def all = Seq(
		Post("https://www.google.com", "Lorem ipsum"),
		Post("https://www.google.com", "Lorem ipsum"),
		Post("https://www.google.com", "Lorem ipsum"),
		Post("https://www.google.com", "Lorem ipsum")
	)

}
