/* by /Leoj -- /Lekko -- /Lojeuv
 *
 */
package utils.exceptions;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

/**
 *
 * @author LeoGS
 */
public class ApiException extends WebApplicationException {

    private static final long serialVersionUID = 1L;
    public final Response.Status _status;
    public final String _msg;

    public ApiException(Response.Status status, String msg) {
        _status = status;
        _msg = msg;
    }

    @Override
    public String getMessage() {
        return this.getClass().getName() + ": " + _msg;
    }

    public Response.Status getStatus() {
        return _status;
    }

    @Override
    public Response getResponse() {
        return Response.status(_status).entity(_msg).build();
    }
}
