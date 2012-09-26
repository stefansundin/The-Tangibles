/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package managers;

import java.io.IOException;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import restful.streaming.AbstractStreamingThread;
import restful.streaming.StreamingHolder;
import tangible.devices.TangibleDevice;
import tangible.protocols.TangibleDeviceProtocol;
import utils.exceptions.DeviceNotFoundException;

/**
 *
 * @author leo
 */
public enum SubscriptionManagerAccess {

    INSTANCE;
    private SubscriptionManager _singleton;

    private SubscriptionManagerAccess() {
        try {
            _singleton = new SubscriptionManagerImpl();
        } catch (IOException ex) {
            Logger.getLogger(SubscriptionManagerAccess.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static SubscriptionManager getInstance() {
        return INSTANCE._singleton;
    }

    private class SubscriptionManagerImpl implements SubscriptionManager {

        private final StreamingHolder _streams;
        //TODO add the database so we can have a better control and add filtering
        private DeviceFinder _devMgr = DeviceFinderAccess.getInstance();

        private SubscriptionManagerImpl() throws IOException {
            _streams = new StreamingHolder();
            System.out.println("SubscriptionManagerImpl constructor done");
        }

        @Override
        public boolean existsStreaming(UUID appuuid) {
            synchronized (_streams) {
                return _streams.existsStreaming(appuuid);
            }
        }

        @Override
        public AbstractStreamingThread getStreamingSocket(UUID appuuid) throws NoSuchSocket {
            synchronized (_streams) {
                if (!existsStreaming(appuuid)) {
                    throw new NoSuchSocket(appuuid.toString());
                }
                //else
                return _streams.getStreamingSocket(appuuid);
            }
        }

        @Override
        public AbstractStreamingThread createStreamingSocket(UUID appuuid, StreamingThreadType type) throws AlreadyExistingSocket, IOException {
            synchronized (_streams) {
                System.out.println("createStreamingSocket");
                AbstractStreamingThread newSocket;
                if (existsStreaming(appuuid)) {
                    throw new AlreadyExistingSocket(appuuid.toString());
                }
                //else
                switch (type) {
                    case TCP_SOCKET:
                        newSocket = _streams.createTcpStream(appuuid);
                        break;
                    case WEB_SOCKET:
                        newSocket = _streams.createWsStream(appuuid);
                        break;
                    default:
                        throw new AssertionError();
                }
                return newSocket;
            }
        }

        @Override
        public void addEventSubscription(UUID appuuid, String device, String[] events) throws NoSuchSocket {
            throw new UnsupportedOperationException("Not supported yet.");
        }

        @Override
        public void removeEventSubscription(UUID appuuid, String device, String[] events) throws NoSuchSocket {
            throw new UnsupportedOperationException("Not supported yet.");
        }

        @Override
        public void addEventsSubscription(UUID appuuid, String device) throws NoSuchSocket, DeviceNotFoundException {
            if (!existsStreaming(appuuid)) {
                throw new NoSuchSocket(appuuid.toString());
            }
            //else
            //find the device, get the talk, add a call back for all event messages
            //NOTE: we assume that the device exists and that the application is associated to it
            TangibleDevice dev = _devMgr.getDevice(device);
            final TangibleDeviceProtocol talk = dev.getTalk();
            synchronized (talk) {
                talk.addAllEventsNotification(_streams.getStreamingSocket(appuuid));
            }
        }

        @Override
        public void removeEventsSubscription(UUID appuuid, String device) {
            throw new UnsupportedOperationException("Not supported yet.");
        }

        @Override
        public int getTcpPort() {
            return _streams.getTcpPort();
        }

        @Override
        public int getWsPort() {
            return _streams.getWsPort();
        }

        @Override
        public void stopASAP() {
            try {
                _streams.stopASAP();
            } catch (IOException ex) {
                Logger.getLogger(SubscriptionManagerAccess.class.getName()).log(Level.SEVERE, "couldn't stop the TcpServer for streaming", ex);
            }
        }
    }
}
