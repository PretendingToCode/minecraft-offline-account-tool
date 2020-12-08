# Minecraft Offline Account Tool

A script used to automatically and safely create new versions folders with set account names

Usage: node createAccount.js [version] [username] [launcher name] [output directory]

Output directory option doesn't always work due to system permissions, but if it fails it will leave the folder in .minecraft\versions
Only requirement is that NodeJS be installed, all libraries used in this script should come with NodeJS by default
