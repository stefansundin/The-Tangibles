/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package restful.utils;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import commons.ApiException;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

/**
 *
 * @author leo
 */
@Produces(MediaType.APPLICATION_JSON)
//@Consumes(MediaType.APPLICATION_JSON)
public class JSONRestResource {

    public class RestApiException extends WebApplicationException {

        private static final long serialVersionUID = 1L;
        private final Response.Status _status;
        private final boolean _isCtrl;
        private final String _msg;
        
        public RestApiException(Response.Status status, boolean isCtrl, String msg) {
            super(status);
            _status = status;
            _isCtrl = isCtrl;
            _msg = msg;
        }

        public RestApiException(ApiException ex, boolean isCtrl) {
            this(ex.getStatus(), isCtrl, ex.getMessage());
        }

        @Override
        public String getMessage() {
            return _msg;
        }

        @Override
        public Response getResponse() {
            return JSONRestResource.this.createJsonResponseMsg(getMessage(), _isCtrl, _status);
        }
    }
    protected Gson _gson = new Gson();

    protected Response makeCORS() {
        return Response.ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                .build();
    }

    protected String createJsonMsg(Object o, boolean isCtrl) {
        JsonObject msg = new JsonObject();
        msg.addProperty("flow", isCtrl ? "ctrl" : "event");
        if (o instanceof JsonElement) {
            msg.add("msg", (JsonElement) o);
        } else {
            msg.add("msg", _gson.toJsonTree(o));
        }
        return _gson.toJson(msg);
    }

    protected String createJsonCtrlMsg(Object o) {
        return createJsonMsg(o, true);
    }

    protected Response createJsonResponseMsg(Object o, boolean isCtrl, Status statusCode) {
        return Response.status(statusCode)
                .entity(createJsonMsg(o, isCtrl))
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                .build();
    }

    protected Response createJsonCtrlResponseMsg(Object o, Status statusCode) {
        return createJsonResponseMsg(o, true, statusCode);
    }

    protected Response createMissingCompulsoryParamMsg(String field) {
        return createErrorMsg("Missing a required parameter", field);
    }

    protected Response createErrorMsg(String err_msg, String reason) {
        return createErrorMsg(err_msg, reason, Status.BAD_REQUEST);
    }

    protected Response createErrorMsg(String err_msg, String reason, Status status) {
        JsonObject err = new JsonObject();
        err.addProperty("err_msg", err_msg);
        err.addProperty("err_source", reason);

        return createJsonCtrlResponseMsg(err, status);
    }

    protected Response createErrorMsg(ApiException e) {
        JsonObject err = new JsonObject();
        err.addProperty("err_msg", e._msg);

        return createJsonCtrlResponseMsg(err, e._status);
    }

    protected Response createOKCtrlMsg() {
        return createJsonCtrlResponseMsg("OK", Status.OK);
    }
}
