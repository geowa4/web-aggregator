import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

    val appName         = "web-aggregator"
    val appVersion      = "1.0"

    val appDependencies = Seq(
	  "org.joda" % "joda-convert" % "1.2",
	  "org.apache.abdera" % "abdera-parser" % "1.1.1",
	  "joda-time" % "joda-time" % "2.0",
	  "net.liftweb"    %% "lift-mongodb-record" % "2.4-RC1",
	  "com.foursquare" %% "rogue"               % "1.0.29" intransitive()
	)

    val main = PlayProject(appName, appVersion, appDependencies, 
						   mainLang = SCALA)

}
