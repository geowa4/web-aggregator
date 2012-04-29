import akka.actor._
import akka.util.duration._
import play._

import models._
import sync._

class Global extends GlobalSettings {
  private val system = ActorSystem("Aggregator")
  private var actors: Vector[ActorRef] = _
  private var cancellables: Vector[Cancellable] = _

  override def onStart(app: Application) {
    PostMongo.connectToMongo
    val googlePlusActor = system.actorOf(Props[GooglePlusSync])
    val githubActor = system.actorOf(Props[GitHubSync])
    val stackoverflowActor = system.actorOf(Props[StackOverflowSync])
    val bloggerActor = system.actorOf(Props[BloggerSync])
    actors = Vector(googlePlusActor, githubActor, stackoverflowActor, bloggerActor)
    cancellables = Vector(
      system.scheduler.schedule(0 milliseconds, 30 minutes, googlePlusActor, Sync),
      system.scheduler.schedule(0 milliseconds, 30 minutes, githubActor, Sync),
      system.scheduler.schedule(0 milliseconds, 30 minutes, stackoverflowActor, Sync),
      system.scheduler.schedule(0 milliseconds, 30 minutes, bloggerActor, Sync)
    )
    Logger.info("Application has started.");
  }  

  override def onStop(app: Application) {
    actors.foreach(_ ! PoisonPill)
    cancellables.foreach(_.cancel())
    PostMongo.disconnectFromMongo
    Logger.info("Application has shutdown.");
  }  

}
