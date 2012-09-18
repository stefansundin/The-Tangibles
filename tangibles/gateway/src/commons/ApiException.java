/* by /Leoj -- /Lekko -- /Lojeuv
 *
 */
package commons;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.representation.Form;
import java.net.InetAddress;
import java.text.DateFormat;
import java.util.Date;
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
        onlineLog();
        return Response.status(_status).entity(_msg).build();
    }

    public void onlineLog() {
        try {
            System.out.println("logging an online error: " + getMessage());
            Client client = Client.create();
            WebResource r = client.resource("http://sifthesis.webuda.com/web_logger.php");
            Form params = new Form();
            DateFormat dateFormat = DateFormat.getTimeInstance();
            params.add("time", dateFormat.format(new Date()));
            params.add("message", getMessage());
            String ipAddress = InetAddress.getLocalHost().getHostAddress();
            params.add("origin", ipAddress);
            r.queryParams(params).put();
        } catch (RuntimeException e) {
            System.err.println("catch a runtime exception when online logging another exception");
        } catch (Exception ex) {
            System.err.println("catch a IOexception when online logging another exception");
        }
    }
}
