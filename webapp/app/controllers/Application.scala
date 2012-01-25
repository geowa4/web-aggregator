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
	Ok(views.xml.posts(Post.last(20).fetch))
  }

  def show(id: String) = Action { 
	Ok(toJson(Post.byId(id).fetch(1)))
  }

  def list = Action { 
	Ok(toJson(Post.last(20).fetch))
  }

}
