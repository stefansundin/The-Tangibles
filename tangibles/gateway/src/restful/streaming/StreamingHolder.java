/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package restful.streaming;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import java.io.IOException;
import java.net.ServerSocket;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import managers.SubscriptionManager;
import org.webbitserver.BaseWebSocketHandler;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;
import org.webbitserver.WebSocketConnection;
import tangible.utils.JsonProtocolHelper;
import tangible.utils.Listener;
import utils.exceptions.WrongProtocolJsonSyntaxException;

/**
 *
 * @author leo
 */
public class StreamingHolder {

    public static class WsStreamingSocket extends BaseWebSocketHandler {

        private Map<UUID, Listener<WebSocketConnection>> _listeners;

        public WsStreamingSocket() {
            _listeners = new HashMap<UUID, Listener<WebSocketConnection>>();
        }

        @Override
        public void onOpen(WebSocketConnection connection) throws Exception {
            System.out.println("a websocket connection just openned! " + connection.toString());
        }

        @Override
        public void onMessage(WebSocketConnection connection, String msg) throws Throwable {
            //the msg should only be the UUID of the application wrapped in a json msg...
            try {
                JsonParser parser = new JsonParser();
                JsonElement tree = parser.parse(msg);
                System.out.println("msg parsed " + tree.isJsonObject() + "/" + tree.isJsonPrimitive() + "/" + tree.isJsonArray() + "/" + tree.isJsonNull());
                JsonElement elem = JsonProtocolHelper.assertCtrlMsg(tree);
                System.out.println("ctrl msg received");
                UUID appuuid;
                try {
                    appuuid = UUID.fromString(JsonProtocolHelper.assertString(elem));
                } catch (IllegalArgumentException e) {
                    JsonObject error_message = JsonProtocolHelper.createCtrlMsg(new JsonPrimitive("A valid UUID was excpected"));
                    connection.send(new Gson().toJson(error_message));
                    connection.close();
                    return;
                }
                if (_listeners.containsKey(appuuid)) {
                    Listener<WebSocketConnection> listener = _listeners.get(appuuid);
                    listener.callback(connection);
                } else {
                    JsonObject error_message = JsonProtocolHelper.createCtrlMsg(new JsonPrimitive("The received appuuid was not excpected : " + appuuid.toString()));
                    connection.send(new Gson().toJson(error_message));
                    connection.close();
                }
            } catch (WrongProtocolJsonSyntaxException ex) {
                Logger.getLogger(WsStreamingSocket.class.getName()).log(Level.INFO, "we ignored a message on the websocket ''cause it was not a proper JSON message : \n\t{0}\trejected due to -> {1}", new Object[]{msg, ex.getMessage()});
            }
        }
    }
    private ServerSocket _tcpServer;
    private WebServer _webSockerServer;
    private WsStreamingSocket _wsStreaningSock;
    private Map<UUID, AbstractStreamingThread> _appSockets;

    public StreamingHolder() throws IOException {
        _wsStreaningSock = new WsStreamingSocket();
        _tcpServer = new ServerSocket(0);
        _tcpServer.setSoTimeout(5000);
        //any port is fine so let's try to take the next one :x
        int wsPort = _tcpServer.getLocalPort() + 1;
        System.out.println("wsPort is: " + wsPort);
        _webSockerServer = WebServers.createWebServer(wsPort).add("/streaming", _wsStreaningSock);
        _webSockerServer.start();
        _appSockets = new HashMap<UUID, AbstractStreamingThread>();
    }

    public int getTcpPort() {
        return _tcpServer.getLocalPort();
    }

    public int getWsPort() {
        return _webSockerServer.getPort();
    }

    public boolean existsStreaming(UUID appuuid) {
        return _appSockets.containsKey(appuuid);
    }

    public AbstractStreamingThread getStreamingSocket(UUID appuuid)
            throws SubscriptionManager.NoSuchSocket {
        if (!existsStreaming(appuuid)) {
            throw new SubscriptionManager.NoSuchSocket(appuuid.toString());
        }
        //else
        return _appSockets.get(appuuid);
    }

    public TcpStreamingThread createTcpStream(UUID appuuid)
            throws SubscriptionManager.AlreadyExistingSocket, IOException {
        TcpStreamingThread newSocket;
        if (existsStreaming(appuuid)) {
            throw new SubscriptionManager.AlreadyExistingSocket(appuuid.toString());
        }
        //else
        newSocket = new TcpStreamingThread(appuuid, _tcpServer, this);
        newSocket.start();
        _appSockets.put(appuuid, newSocket);
        return newSocket;
    }
    
    void deleteTcpStream(UUID uuid) {
        _appSockets.remove(uuid);
    }

    public WebSocketStreamingThread createWsStream(final UUID appuuid)
            throws SubscriptionManager.AlreadyExistingSocket, IOException {
        System.out.println("Creating a WsStream Socket");
        WebSocketStreamingThread newSocket;
        if (existsStreaming(appuuid)) {
            throw new SubscriptionManager.AlreadyExistingSocket(appuuid);
        }
        newSocket = new WebSocketStreamingThread(new Listener<Void>() {
            @Override
            public void callback(Void t) {
                _wsStreaningSock._listeners.remove(appuuid);
            }
        });
        _wsStreaningSock._listeners.put(appuuid, newSocket);
        _appSockets.put(appuuid, newSocket);
        return newSocket;
    }

    public void stopASAP() throws IOException {
        _webSockerServer.stop();
        _tcpServer.close();
    }
}
