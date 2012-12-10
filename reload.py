#!/usr/bin/python
# Change paths below!!
# Important: Run this as superuser!

import BaseHTTPServer
import SocketServer
import time
from subprocess import call

PORT_NUMBER = 55555

class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(s):
        print "reload"
        
        call(["sudo", "/home/ubuntu/run.sh"])
        s.send_response(302)
        s.send_header('Location', 'http://dev.tangible.se/')
        s.end_headers()
        s.wfile.write("reloaded")

        
# Enable multi-threading
class ThreadedHTTPServer(SocketServer.ThreadingMixIn, BaseHTTPServer.HTTPServer):
    """Handle requests in a separate thread."""

if __name__ == '__main__':
    httpd = ThreadedHTTPServer(('', PORT_NUMBER), MyHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

