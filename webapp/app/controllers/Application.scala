package controllers

import play.api.mvc._
import play.api.libs.json.Json._

import models._

object Application extends Controller {

  def index(path: String) = Action {
    Ok(views.html.index())
  }

  def atom = Action { 
    Ok(views.xml.posts(Post.list()))
  }

  def show(id: String) = Action { 
    Ok(toJson(Post.byId(id)))
  }

  def list(skip: Int) = Action {
    Ok(toJson(Post.list(skip)))
  }

}
