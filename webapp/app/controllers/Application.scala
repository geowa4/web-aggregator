package controllers

import play.api._
import play.api.mvc._
//import play.api.libs.json._

import models._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index(Post.all))
  }

  def postsXML = Action { 
	Ok(views.xml.posts(Post.all))
  }

/*
  def postsJSON = Action { 
	Ok(toJson(Post.all))
  }
*/

}
