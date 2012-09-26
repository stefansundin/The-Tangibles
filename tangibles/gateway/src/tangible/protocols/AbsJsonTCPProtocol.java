package tangible.protocols;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonIOException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSyntaxException;
import com.google.gson.stream.JsonReader;
import java.io.IOException;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author leo
 */
public abstract class AbsJsonTCPProtocol extends AbsTCPProtocol {

    private final Gson gson = new Gson();
    private final JsonReader reader;

    public AbsJsonTCPProtocol(Socket s) throws IOException {
        super(s);
        reader = new JsonReader(this.getInput());
    }

    protected synchronized void sendJSON(Object o) {
        try {
            gson.toJson(o, this.getOutput());
            this.getOutput().flush();
        } catch (JsonIOException e) {
            handleDisconnection();
        }
    }

    protected synchronized void sendJSON(JsonElement elm) {
        try {
            gson.toJson(elm, this.getOutput());
            this.getOutput().flush();
        } catch (JsonIOException e) {
            handleDisconnection();
        }
    }

    protected void sendJsonMsg(Object o, boolean isControlFlow) {
        Map<String, Object> msg = new HashMap<String, Object>(2);
        if (isControlFlow) {
            msg.put("flow", "ctrl");
        } else {
            msg.put("flow", "event");
        }

        msg.put("msg", o);
        sendJSON(msg);
    }

    protected void sendJsonMsg(JsonElement elm, boolean isControlFlow) {
        JsonObject msg = new JsonObject();
        if (isControlFlow) {
            msg.add("flow", new JsonPrimitive("ctrl"));
        } else {
            msg.add("flow", new JsonPrimitive("event"));
        }

        msg.add("msg", elm);
        sendJSON(msg);
    }

    protected void sendJsonEventMsg(Object o) {
        sendJsonMsg(o, false);
    }

    protected void sendJsonCtrlMsg(Object o) {
        sendJsonMsg(o, true);
    }

    protected void sendJsonEventMsg(JsonElement o) {
        sendJsonMsg(o, false);
    }

    protected void sendJsonCtrlMsg(JsonElement o) {
        sendJsonMsg(o, true);
    }

    protected <T> T readJSON(Class<T> c) throws JsonSyntaxException {
        return gson.fromJson(this.getInput(), c);
    }

    protected JsonElement readJSON() {
        JsonParser parser = new JsonParser();
        return parser.parse(reader);
    }

    protected abstract void handleDisconnection();
}
