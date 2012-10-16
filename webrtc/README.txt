Hi there.

server.js is the nodejs server handling web page accessing and webrtc related things.
It uses the things located in the node_modules folder.

Room things are located in the room folder and workspace things in the workspace folder.

The lobby is located in the index.html in this folder.


NOTE:

Just adding a file and expecting it to be accessible does not work. If you want to add a new page, it has to be added to server.js (rather obvious if you see how the others are done).

The above is true as long as we want to use the nodejs server.