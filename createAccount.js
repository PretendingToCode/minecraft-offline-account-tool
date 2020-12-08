const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

var version = process.argv[2]
var username = process.argv[3]
var launcherName = process.argv[4]
var outputDirectory = process.argv[5]

if(version == undefined || username == undefined || launcherName == undefined){
  console.log("Error: Missing arguments")
  process.kill(0)
}

var versions = fs.readdirSync(process.env.APPDATA + "\\.minecraft\\versions")

if(versions.includes(version) && fs.lstatSync(process.env.APPDATA + "\\.minecraft\\versions\\" + version).isDirectory()){
  console.log("Version found: " + version)

  var files = fs.readdirSync(process.env.APPDATA + "\\.minecraft\\versions\\" + version)
  console.log("Making new version directory")
  fs.mkdirSync(process.env.APPDATA + "\\.minecraft\\versions\\" + launcherName)

  console.log("Copying version files to new directory")
  files.forEach(function(item){
    fs.copyFileSync(process.env.APPDATA + "\\.minecraft\\versions\\" + version + "\\" + item, process.env.APPDATA + "\\.minecraft\\versions\\" + launcherName + "\\" + item)
  })

  console.log("Renaming files to match parent directory")
  fs.renameSync(process.env.APPDATA + "\\.minecraft\\versions\\" + launcherName + "\\" + version + ".jar", process.env.APPDATA + "\\.minecraft\\versions\\" + launcherName + "\\" + launcherName + ".jar")
  fs.renameSync(process.env.APPDATA + "\\.minecraft\\versions\\" + launcherName + "\\" + version + ".json", process.env.APPDATA + "\\.minecraft\\versions\\" + launcherName + "\\" + launcherName + ".json")

  console.log("Updating version settings in JSON file")
  var data = JSON.parse(fs.readFileSync(process.env.APPDATA + "\\.minecraft\\versions\\" + launcherName + "\\" + launcherName + ".json"))

  data.arguments.game[1] = username
  data.id = launcherName

  fs.writeFileSync(process.env.APPDATA + "\\.minecraft\\versions\\" + launcherName + "\\" + launcherName + ".json", JSON.stringify(data))

  if(outputDirectory){
    if(fs.existsSync(outputDirectory.replace(/\\/g, "\\\\")) && fs.lstatSync(outputDirectory.replace(/\\/g, "\\\\")).isDirectory()){
      try{
        fs.renameSync(process.env.APPDATA + "\\.minecraft\\versions\\" + launcherName, outputDirectory.replace(/\\/g, "\\\\"))
      }
      catch(e){
        if(e.code == "EPERM"){
          console.log("Error: Couldn't move file to output directory, insufficient permissions, placing in .minecraft\\versions")
        }
      }
    } else {
      console.log("Error: Specified output directory does not exist, placing in .minecraft\\versions")
    }
  }

  console.log("Done!")

  console.log("\nCheck .minecraft\\versions for your new version folder, or other output directory if specified. You may use this version folder on any system.  Note that a new launcher profile still needs to be created for this profile.  You can do this from within the launcher or by adding a new entry to .minecraft\\launcher_profiles.json")
  console.log("To add the profile from by changing launcher_profiles.json, add the following code to the file under \"profiles\":")

  var profiles = {}

  profiles[crypto.randomBytes(16).toString("hex")] = {
    created: "1970-01-01T00:00:00.000Z",
    icon: "Crafting_Table",
    lastUsed: "1970-01-01T00:00:00.000Z",
    lastVersionId: "*Version folder name here*",
    name: "*Version folder name here* (can be random too, just whats shown in the launcher)",
    type: "custom"
  }

  console.log(profiles)
} else {
  console.log("Error: Version provided cannot be found in versions folder. The following versions were found on your system:")
  versions.forEach(function(item){
    if(fs.lstatSync(process.env.APPDATA + "\\.minecraft\\versions\\" + item).isDirectory()){
      console.log(item)
    }
  })
}
