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
        private final String _origin;

        public RestApiException(String origin, Response.Status status, boolean isCtrl, String msg) {
            super(status);
            _status = status;
            _isCtrl = isCtrl;
            _msg = msg;
            _origin = origin;
        }

        public RestApiException(String origin, ApiException ex, boolean isCtrl) {
            this(origin, ex.getStatus(), isCtrl, ex.getMessage());
        }

        @Override
        public String getMessage() {
            return _msg;
        }

        @Override
        public Response getResponse() {
            return JSONRestResource.this.createJsonResponseMsg(_origin, getMessage(), _isCtrl, _status);
        }
    }
    protected Gson _gson = new Gson();
    /*WARN : the two following fields (corsHeaders and currentOrigin) 
     * are used in an ugly side-effect way this should be change (one day)
     */
    //protected String corsHeaders;
    //protected String currentOrigin;
    protected final String[] allowedOrigins = {
        "http://localhost",
        "http://localhost/",
        "http://satin.codemill.se",
        "http://satin.codemill.se/",
        "http://satin.codemill.se:81",
        "http://satin.codemill.se:81/",
        "http://cdn.satin.codemill.se"};

    protected String assertOrigin(String origin) {
        String currentOrigin = null;
        boolean notFound = true;
        for (int i = 0; notFound && i < allowedOrigins.length; i++) {
            notFound = !allowedOrigins[i].equalsIgnoreCase(origin);
            if (!notFound) {
                currentOrigin = allowedOrigins[i];
            }
        }
        if (notFound) {
            currentOrigin = allowedOrigins[0];
            for (int i = 1; i < allowedOrigins.length; i++) {
                currentOrigin += " " + allowedOrigins[i];
            }
        }
        return currentOrigin;
    }

    protected Response makeCORS(String requestHeader, String origin) {
        String currentOrigin = assertOrigin(origin);
        System.out.println("currentOrigin in an option answer -> " + currentOrigin);
        return Response.ok()
                .header("Access-Control-Allow-Origin", currentOrigin)
                .header("Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS")
                .header("Access-Control-Allow-Headers", requestHeader).build();
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

    protected Response createJsonResponseMsg(String origin, Object o, boolean isCtrl, Status statusCode) {
        return Response.status(statusCode)
                .entity(createJsonMsg(o, isCtrl))
                .header("Access-Control-Allow-Origin", assertOrigin(origin))
                .header("Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS")
                //.header("Access-Control-Allow-Headers", corsHeaders)
                .build();
    }

    protected Response createJsonCtrlResponseMsg(String origin, Object o, Status statusCode) {
        return createJsonResponseMsg(origin, o, true, statusCode);
    }

    protected Response createMissingCompulsoryParamMsg(String origin, String field) {
        return createErrorMsg(origin, "Missing a required parameter", field);
    }
    
    protected Response createErrorMsg(String origin, String err_msg, String reason) {
        return createErrorMsg(origin, err_msg, reason, Status.BAD_REQUEST);
    }

    protected Response createErrorMsg(String origin, String err_msg, String reason, Status status) {
        JsonObject err = new JsonObject();
        err.addProperty("err_msg", err_msg);
        err.addProperty("err_source", reason);

        return createJsonCtrlResponseMsg(origin, err, status);
    }

    protected Response createErrorMsg(String origin, ApiException e) {
        JsonObject err = new JsonObject();
        err.addProperty("err_msg", e._msg);

        return createJsonCtrlResponseMsg(origin, err, e._status);
    }

    protected Response createOKCtrlMsg(String origin) {
        return createJsonCtrlResponseMsg(origin, "OK", Status.OK);
    }
}
