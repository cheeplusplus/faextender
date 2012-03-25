#!/usr/bin/python

import os
import zipfile

def zip_dirs(zipFile, directory):
	rootLen = len(os.path.abspath(directory))
	
	for root, dirs, files in os.walk(directory):
		archiveRoot = os.path.abspath(root)[rootLen:]
		for file in files:
			fullPath = os.path.join(root, file)
			archiveName = os.path.join(archiveRoot, file)
			zipFile.write(fullPath, archiveName, zipfile.ZIP_DEFLATED)

print "-- Building FAExtender extension --"

with zipfile.ZipFile("faextender.xpi", "w", compression=zipfile.ZIP_DEFLATED) as xpiFile:
	zip_dirs(xpiFile, "src")

print "Complete!"