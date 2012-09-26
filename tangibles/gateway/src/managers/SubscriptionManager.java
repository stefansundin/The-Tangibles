/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package managers;

import java.io.IOException;
import java.util.UUID;
import javax.ws.rs.core.Response;
import restful.streaming.AbstractStreamingThread;
import utils.exceptions.ApiException;
import utils.exceptions.DeviceNotFoundException;

/**
 *
 * @author leo
 */
public interface SubscriptionManager {

    public static class NoSuchSocket extends ApiException {

        private static final long serialVersionUID = 1L;

        public NoSuchSocket(String appuuid) {
            super(Response.Status.CONFLICT, "there is no streaming socket for this application (" + appuuid + ")");
        }

        public NoSuchSocket(UUID appuuid) {
            this(appuuid.toString());
        }
    }

    public static class AlreadyExistingSocket extends ApiException {

        private static final long serialVersionUID = 1L;

        public AlreadyExistingSocket(String appuuid) {
            super(Response.Status.CONFLICT, "a socket already exist for this application (" + appuuid + ")");
        }

        public AlreadyExistingSocket(UUID appuuid) {
            this(appuuid.toString());
        }
    }

    public enum StreamingThreadType {

        TCP_SOCKET, WEB_SOCKET;
    }

    boolean existsStreaming(UUID appuuid);

    AbstractStreamingThread getStreamingSocket(UUID appuuid)
            throws NoSuchSocket;

    AbstractStreamingThread createStreamingSocket(UUID appuuid, StreamingThreadType type)
            throws AlreadyExistingSocket, IOException;

    void addEventSubscription(UUID appuuid, String device, String[] events)
            throws NoSuchSocket, DeviceNotFoundException;

    void removeEventSubscription(UUID appuuid, String device, String[] events)
            throws NoSuchSocket, DeviceNotFoundException;

    void addEventsSubscription(UUID appuuid, String device)
            throws NoSuchSocket, DeviceNotFoundException;

    void removeEventsSubscription(UUID appuuid, String device)
            throws NoSuchSocket, DeviceNotFoundException;

    public int getTcpPort();

    public int getWsPort();

    public void stopASAP();
}
