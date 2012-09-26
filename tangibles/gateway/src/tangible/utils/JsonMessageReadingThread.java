/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package tangible.utils;

import com.google.gson.JsonElement;
import com.google.gson.JsonIOException;
import com.google.gson.JsonObject;
import com.google.gson.JsonStreamParser;
import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author leo
 */
public class JsonMessageReadingThread extends StreamReadingThread<BufferedReader> {

    public interface JsonEventListener extends Listener<JsonObject> {
    }
    private JsonStreamParser _parser;
    private List<JsonEventListener> _eventListener;
    private BlockingQueue<JsonObject> _ctrlQueue;
    private Listener<Void> _streamOverListener;

    public JsonMessageReadingThread(BufferedReader reader) {
        super(reader);
        _parser = new JsonStreamParser(_reader);
        _eventListener = new ArrayList<JsonEventListener>();
        _ctrlQueue = new LinkedBlockingDeque<JsonObject>();
        _streamOverListener = null;
    }

    @Override
    public void read() {
        //read one JsonElement and finish
        try {
            if (!_parser.hasNext()) {
                Logger.getLogger(JsonMessageReadingThread.class.getName()).log(Level.INFO, "Nothing more to read!");
                this._running = false;
                this.handleStreamOver();
                return;
            }
        } catch (JsonIOException e) {
            Logger.getLogger(JsonMessageReadingThread.class.getName()).log(Level.INFO, "The parse is over!");
            this._running = false;
            this.handleStreamOver();
            return;
        }
        JsonElement elm = _parser.next();
        //TODO filter the event and control message and add them in their respective stack
        //the driver will take care of reading them
        if (!elm.isJsonObject()) {
            Logger.getLogger(JsonMessageReadingThread.class.getName()).log(Level.INFO, "received an incorrect message, let's ignore it");
            return;
        }
        //else
        JsonObject msg = elm.getAsJsonObject();
        if (!msg.has("flow")) {
            Logger.getLogger(JsonMessageReadingThread.class.getName()).log(Level.INFO, "received a message without specified flow, let's trash it");
            return;
        }
        JsonElement flow_elem = msg.get("flow");
        String flow;
        try {
            flow = flow_elem.getAsString();
        } catch (IllegalStateException ex) {
            Logger.getLogger(JsonMessageReadingThread.class.getName()).log(Level.INFO, "incorrect flow, trashing the message");
            return;
        } catch (ClassCastException ex) {
            Logger.getLogger(JsonMessageReadingThread.class.getName()).log(Level.INFO, "incorrest flow, ignoring");
            return;
        }
        if (flow.equals("event")) {
            this.handleEventMsg(msg);
        } else if (flow.equals("ctrl")) {
            this.handleCtrlMsg(msg);
        } else {
            Logger.getLogger(JsonMessageReadingThread.class.getName()).log(Level.INFO, "received an incorrect flow value, ignoring the message");
        }
    }

    public void addEventListener(JsonEventListener listener) {
        this._eventListener.add(listener);
    }

    public void removeEventListener(JsonEventListener listener) {
        this._eventListener.remove(listener);
    }

    private void handleCtrlMsg(JsonObject msg) {
        _ctrlQueue.add(msg);
    }

    private void handleEventMsg(JsonObject msg) {
        for (Iterator<JsonEventListener> ite = _eventListener.iterator(); ite.hasNext();) {
            JsonMessageReadingThread.JsonEventListener jsonEventListener = ite.next();
            jsonEventListener.callback(msg);
        }
    }

    private void handleStreamOver() {
        if (_streamOverListener != null) {
            this._streamOverListener.callback(null);
        }
    }

    public void setStreamOverListener(Listener<Void> listener) {
        _streamOverListener = listener;
    }

    public JsonObject readCtrlMessage() throws InterruptedException {
        return _ctrlQueue.poll(1, TimeUnit.DAYS);
    }
}
