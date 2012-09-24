#!/usr/bin/python2.7
#
# Copyright 2012 The Tangibles. All Rights Reserved.


import webapp2 as webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class Test(webapp.RequestHandler):
    def get(self):
        self.response.write("It Works!") 

application = webapp.WSGIApplication([
    ('/', Test),
  ], debug=True)

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()
