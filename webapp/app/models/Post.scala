package models

import play.api.libs.json._
import com.foursquare.rogue._
import com.foursquare.rogue.Rogue._
import com.mongodb.{Mongo, ServerAddress}
import net.liftweb.mongodb.{MongoDB, MongoIdentifier}
import net.liftweb.mongodb.record._
import net.liftweb.mongodb.record.field._
import net.liftweb.record.field._
import net.liftweb.record._
import org.bson.types.ObjectId

object PostMongo extends MongoIdentifier { 
  override def jndiName = "post_mongo"

  private var mongo: Option[Mongo] = None

  def connectToMongo = { 
    val MongoPort = 27017
    mongo = Some(new Mongo(new ServerAddress("localhost", MongoPort)))
    MongoDB.defineDb(PostMongo, mongo.get, "web-aggregator")
  }

  def disconnectFromMongo = {
    mongo.foreach(_.close)
    MongoDB.close
    mongo = None
  }

}

class Post extends MongoRecord[Post] with MongoId[Post] with IndexedRecord[Post] {

  def meta = Post
  object url extends StringField(this, 255)
  object title extends StringField(this, 255)
  object content extends StringField(this, 1000)
  object published extends StringField(this, 255)
  object updated extends StringField(this, 255)
  object provider extends StringField(this, 255)

}

object Post extends Post with MongoMetaRecord[Post] { 
  override def collectionName = "posts"
  override def mongoIdentifier = PostMongo 

  val idIdx = Post.index(_._id, Asc)
  val urlIdx = Post.index(_.url, Asc)
  val updatedIdx = Post.index(_.updated, Desc)
  override val mongoIndexList = List(idIdx, urlIdx, updatedIdx)

  def all = Post where (_._id exists true) orderDesc (_.updated) fetch()

  def byId(id: String) = Post where (_._id eqs new ObjectId(id)) get()

  implicit object PostFormat extends Format[Post] { 
	def reads(json: JsValue): Post = null
	def writes(p: Post): JsValue = JsObject(List(
      "id" -> JsString(p._id.toString()),
	  "url" -> JsString(p.url.toString()),
      "title" -> JsString(p.title.toString()),
	  "content" -> JsString(p.content.toString()),
	  "published" -> JsString(p.published.toString()),
	  "updated" -> JsString(p.updated.toString()),
	  "provider" -> JsString(p.provider.toString())
	))
  }
}
