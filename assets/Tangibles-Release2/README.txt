To simply use the video conferencing capabilities, follow these instructions:
Use Google Chrome.
Open chrome://flags/ and enable PeerConnection.
Make sure your webcam is functioning (e.g. by testing it at this site).
You may now use the website without Sifteo support. Sifteos have only been tested on Windows 7. They are also available for OS X but this has not been tested.

To use the Sifteos: 
Install Siftdev. This is a developer version of the normal Siftrunner application.
Make sure Java is installed.
Install Mono.
Download and extract Tangibles-Release1.zip.
Open run_TangibleAPI.bat. If it's working you will see "TANGIBLE_API_READY" at the bottom of the console window.
Open run_SiftDriver.bat. If your Mono version is not 2.10.9, then you first have to edit run_SiftDriver.bat and update the path.
Connect at least three Sifteos in Siftdev.
Load app in Siftdev. Menu: Developer -> Load Apps -> select Sifteo directory.
Press Play.
The Sifteos should now work. Enjoy.
To enable shared workspace:
Set up a projector and web camera, preferably in the roof, pointing down on your table.
(Optional) Print out or draw Left marker and Right marker on two separate papers. These will be used to move(Left) and resize(Right) the share workspace by moving them around on the table in front of your camera.
Press enter or press with the mouse anywhere in the browser to finish the workspace configuration
Make sure to select the proper webcam when opening the workspace view.
This should now be working but you may have to adjust the distance of your projector and camera to get the optimal settings. We will show you how to do this at a later time.


To use the Sphero:
1. Connect the usb-bluetooth-dongle to the computer.
1. Connect the sphero charger to the wall outlet.
3. Shake the sphero to turn it on/wake it until it blinks in two or three different colors.
4. Place the sphero in the charger, it is placed right when the sphero blinks in many different colors. This will reset the sphero and may be needed before you use it.
5. At this stage you will pair the Sphero. This only needs to be done once or when you change Sphero.
   In windows 7, right click on the bluetooth trayicon(found near the clock) and choose add a device. Select sphero and choose to enter a code. The code is 1234.
6. If run_TangibleAPI is not already running, then start it now.
7. Start run_Sphero.bat.
8. If the Sphero turns pink constant, then the bluetooth connection to the sphero is working.

