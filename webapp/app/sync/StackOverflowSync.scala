package sync

import scala.collection.JavaConversions._
import scala.xml.Unparsed
import java.net.URL
import java.util.{Timer, TimerTask}
import com.foursquare.rogue.Rogue._
import org.apache.abdera.Abdera
import org.apache.abdera.parser.Parser
import org.apache.abdera.model.{Document, Feed}

import models._

object StackOverflowSync {
  val service = new Timer
  val abdera = new Abdera

  private val baseUrl = "http://stackoverflow.com/feeds/user/50214"

  def start {
    service.scheduleAtFixedRate(new TimerTask {
      def run = sync
    }, 0, 60 * 1000 * 30)
    println("StackOverflow Sync service started")
  }

  def stop {
    service.cancel
    println("StackOverflow Sync service stopped")
  }

  def sync {
    println("Syncing StackOverflow")
    try {
      var parser = abdera.getParser
      var url = new URL(baseUrl)
      var doc: Document[Feed] = parser.parse(url.openStream, url.toString)
      var feed = doc.getRoot
      feed.getEntries foreach {
        entry =>
          Post.where(_.rid eqs entry.getId.toString)
            .modify(_.url setTo entry.getLink("alternate").getHref.toString)
            .modify(_.title setTo entry.getTitle)
            .modify(_.content setTo "<p><em>%s</em></p><p>%s</p>"
            .format(entry.getTitle, Unparsed(entry.getSummary).toString))
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
