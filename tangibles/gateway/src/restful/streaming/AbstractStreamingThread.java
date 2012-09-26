/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package restful.streaming;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import tangible.utils.CallBack;

/**
 *
 * @author leo
 */
public class AbstractStreamingThread extends Thread {
    /**
     * A simple import managers.*;e interface used to unify every kind of event streaming from the
     * server to the clients
     */
    protected interface EventStreaming {

        public void sendEvent(JsonElement event);

        public void sendEvent(Object event);
    }

    /**
     * class used to stack all the event sent by the device until the connection
     * is set up (typically create in the constructor of a StreamingThread and
     * then removed for a regular EventStreamingProtocol
     */
    protected class EventStreamingStacker
            implements CallBack<Void, Void>, EventStreaming {

        private List<JsonElement> _waitingEvents;

        public EventStreamingStacker() {
            _waitingEvents = new LinkedList<JsonElement>();
        }

        @Override
        public Void callback(Void arg) {
            //now that the end app is connected...
            //... let's send it all the messages it missed
            for (JsonElement event : _waitingEvents) {
                AbstractStreamingThread.this._talk.sendEvent(event);
            }
            return null;
        }

        @Override
        public void sendEvent(JsonElement event) {
            //while waiting for the end app to connect, we still stack the events
            //althought this feature might not be wishable... 
            _waitingEvents.add(event);
        }

        @Override
        public void sendEvent(Object event) {
            this.sendEvent(new Gson().toJsonTree(event));
        }
    }
    protected EventStreaming _talk;
    protected List<CallBack<Void, Void>> _onReadylisteners;
    protected boolean _setup;

    public AbstractStreamingThread() {
        _setup = false;
        _onReadylisteners = new ArrayList<CallBack<Void, Void>>();
        EventStreamingStacker stacker = new EventStreamingStacker();
        _talk = stacker;
        _onReadylisteners.add(stacker);
    }

    public boolean isReady() {
        return _setup;
    }

    public void addOnReadyCallBack(CallBack<Void, Void> cb) {
        _onReadylisteners.add(cb);
    }

    public void sendEvent(JsonElement event) {
        this._talk.sendEvent(event);
    }

    public void sendEvent(Object event) {
        this._talk.sendEvent(event);
    }

    public void unregister() {
    }

    protected void setupCompleted(EventStreaming oldTalk) {
        for (CallBack<Void, Void> callBack : _onReadylisteners) {
            callBack.callback(null);
        }
        if (oldTalk instanceof EventStreamingStacker) {
            EventStreamingStacker stacker = (EventStreamingStacker) oldTalk;
            _onReadylisteners.remove(stacker);
        }
    }
}
