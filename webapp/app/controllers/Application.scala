package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json._

import models._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index(Post.all))
  }

  def atom = Action { 
	Ok(views.xml.posts(Post.all))
  }

  def show(id: String) = Action { 
	Post.findById(id).map { post =>
	  Ok(toJson(post))
	} getOrElse NotFound
  }

  def list = Action { 
	Ok(toJson(Post.all))
  }

}
