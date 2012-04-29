package sync

import scala.collection.JavaConversions._
import scala.xml.Unparsed
import java.net.URL
import java.util.{Timer, TimerTask}
import com.foursquare.rogue.Rogue._
import org.apache.abdera.Abdera
import org.apache.abdera.model.{Document, Feed}

import models._
import akka.actor.Actor

class StackOverflowSync extends Actor {
  private val abdera = new Abdera
  private val baseUrl = "http://stackoverflow.com/feeds/user/50214"

  def receive = {
    case Sync =>
      println("Syncing StackOverflow")
      try {
        val parser = abdera.getParser
        val url = new URL(baseUrl)
        val doc: Document[Feed] = parser.parse(url.openStream, url.toString)
        val feed = doc.getRoot
        feed.getEntries foreach {
          entry =>
            Post.where(_.rid eqs entry.getId.toString)
              .modify(_.url setTo entry.getLink("alternate").getHref.toString)
              .modify(_.title setTo entry.getTitle)
              .modify(_.content setTo "<p><em>%s</em></p><p>%s</p>".format(entry.getTitle, Unparsed(entry.getSummary).toString))
              .modify(_.published setTo entry.getPublished)
              .modify(_.updated setTo entry.getUpdated)
              .modify(_.provider setTo "StackOverflow")
              .upsertOne()
        }
      } catch {
        case e =>
          println("Error syncing StackOverflow")
      }
  }
}