/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package restful.utils;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

/**
 *
 * @author leo
 */
public class UnauthorizedAccessException extends WebApplicationException {

    private static final long serialVersionUID = 1L;

    public UnauthorizedAccessException() {
        super(Response.status(Response.Status.UNAUTHORIZED).build());
    }

    public UnauthorizedAccessException(String failedCondition) {
        super(Response.status(Response.Status.UNAUTHORIZED).entity("Access unauthorized because the following condition was not fullfilled: " + failedCondition).build());
    }
}
