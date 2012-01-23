package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json._

import models._

object Application extends Controller {

  def index(path: String) = Action {
    Ok(views.html.index())
  }

  def atom = Action { 
	Ok(views.xml.posts(Post.all))
  }

  def show(id: String) = Action { 
	Ok(toJson(Post.byId(id).get))
  }

  def list = Action { 
	Ok(toJson(Post.all))
  }

}
