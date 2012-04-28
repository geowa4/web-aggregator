package sync

import scala.collection.JavaConversions._
import scala.xml.Unparsed
import java.net.URL
import java.util.{Timer, TimerTask}
import com.foursquare.rogue.Rogue._
import org.apache.abdera.Abdera
import org.apache.abdera.model.{Document, Feed}

import models._

object GitHubSync {
  private val baseURL = "https://github.com/geowa4"
  val service = new Timer
  val abdera = new Abdera

  def start {
    service.scheduleAtFixedRate(new TimerTask {
      def run = sync
    }, 0, 60 * 1000 * 30)
    println("GitHub Sync service started")
  }

  def stop {
    service.cancel
    println("GitHub Sync service stopped")
  }

  def sync {
    println("Syncing GitHub")
    try {
      val parser = abdera.getParser
      val url = new URL(baseURL + ".atom")
      val doc: Document[Feed] = parser.parse(url.openStream, url.toString)
      val feed = doc.getRoot
      feed.getEntries foreach {
        entry =>
          var content = Unparsed(entry.getContent).toString
          content = content.replaceAllLiterally("href=\"/geowa4", "href=\"" + baseURL)

          Post.where(_.rid eqs entry.getId.toString)
            .modify(_.url setTo entry.getLink("alternate").getHref.toString)
            .modify(_.title setTo entry.getTitle)
            .modify(_.content setTo content)
            .modify(_.published setTo entry.getPublished)
            .modify(_.updated setTo entry.getUpdated)
            .modify(_.provider setTo "GitHub")
            .upsertOne()
      }
    } catch {
      case _ => println("Error syncing GitHub")
    }
  }
}
