import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

  val appName = "web-aggregator"
  val appVersion = "1.0"

  val appDependencies = Seq(
    "maven-plugins" % "maven-cobertura-plugin" % "1.4",
    "maven-plugins" % "maven-findbugs-plugin" % "1.4",
    "org.apache.abdera" % "abdera-parser" % "1.1.1",
    "org.joda" % "joda-convert" % "1.2",
    "joda-time" % "joda-time" % "2.0",
    "net.liftweb" %% "lift-mongodb-record" % "2.4",
    "com.foursquare" %% "rogue" % "1.1.2" intransitive()
  )

  val main = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA).settings(

  )
}
