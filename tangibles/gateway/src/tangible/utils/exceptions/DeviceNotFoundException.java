/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package tangible.utils.exceptions;

import commons.ApiException;
import javax.ws.rs.core.Response;

/**
 *
 * @author leo
 */
public class DeviceNotFoundException extends ApiException {

    private static final long serialVersionUID = 1L;

    public DeviceNotFoundException(String id) {
        super(Response.Status.CONFLICT, "the id:(" + id + ") did not match any present device");
    }
}
