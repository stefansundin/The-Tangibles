/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package restful.streaming;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import org.webbitserver.WebSocketConnection;
import tangible.utils.Listener;

/**
 *
 * @author leo
 */
public class WebSocketStreamingThread extends AbstractStreamingThread
        implements Listener<WebSocketConnection> {

    private static class WsEventStreamingProtocol implements EventStreaming {

        private WebSocketConnection _connection;

        public WsEventStreamingProtocol(WebSocketConnection wsConnection) {
            this._connection = wsConnection;
        }

        @Override
        public void sendEvent(JsonElement event) {
            _connection.send(new Gson().toJson(event));
        }

        @Override
        public void sendEvent(Object event) {
            this.sendEvent(new Gson().toJsonTree(event));
        }
    }
    private final Listener<Void> _onSetupCompleteListener;

    public WebSocketStreamingThread(Listener<Void> onSetupCompletedListener) {
        super();
        _onSetupCompleteListener = onSetupCompletedListener;
    }

    @Override
    public void callback(WebSocketConnection wsConnection) {
        EventStreaming oldTalk = this._talk;
        this._talk = new WsEventStreamingProtocol(wsConnection);
        this.setupCompleted(oldTalk);
        _onSetupCompleteListener.callback(null);
    }
}
