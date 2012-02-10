package sync

import scala.collection.JavaConversions._
import scala.xml.Unparsed
import java.net.URL
import java.util.{Timer,TimerTask}
import com.foursquare.rogue.Rogue._
import org.apache.abdera.Abdera
import org.apache.abdera.parser.Parser
import org.apache.abdera.model.{Document,Feed}

import models._

object BloggerSync {
	val service = new Timer
	val abdera = new Abdera

	private val baseUrl = "http://geowa4.blogspot.com/feeds/posts/default"

	def start {
		service.scheduleAtFixedRate(new TimerTask { 
			def run = sync
		}, 0, 60 * 1000 * 60)
		println("Blogger Sync service started")
	}

	def stop {
		service.cancel
		println("Blogger Sync service stopped")
	}

	def sync {
		println("Syncing Blogger")
		try {
			var parser = abdera.getParser
			var url = new URL(baseUrl)
			var doc: Document[Feed] = parser.parse(url.openStream, url.toString)
			var feed = doc.getRoot
			feed.getEntries foreach { entry =>
				Post.where (_.rid eqs entry.getId.toString)
					.modify (_.url setTo entry.getLink("alternate").getHref.toString)
					.modify (_.title setTo entry.getTitle)
					.modify (_.content setTo entry.getTitle)
					.modify (_.published setTo entry.getPublished)
					.modify (_.updated setTo entry.getUpdated)
					.modify (_.provider setTo "Blogger")
					.upsertOne()
			}
		} catch { 
			case e => 
				println("Error syncing Blogger")
				println(e)
		}
	}
}
