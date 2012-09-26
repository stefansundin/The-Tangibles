package tangible;

import com.sun.jersey.api.container.grizzly2.GrizzlyServerFactory;
import com.sun.jersey.api.core.PackagesResourceConfig;
import com.sun.jersey.api.core.ResourceConfig;
import java.io.IOException;
import java.net.URI;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.core.UriBuilder;
import managers.ApplicationManagerAccess;
import managers.DeviceFinder;
import managers.DeviceFinderAccess;
import managers.ReservationManagerAccess;
import managers.SubscriptionManagerAccess;
import org.glassfish.grizzly.http.server.HttpServer;

/**
 *
 * @author leo
 */
public class TangibleAPI {

    private static String ipAddress = "0.0.0.0";

    public static void main(String[] args) throws IOException {
        try {
            DeviceFinder finder = DeviceFinderAccess.getInstance();
            finder.start();

            //let's initialise all the singleton to avoid delay error later on.. 
            ApplicationManagerAccess.getInstance();
            ReservationManagerAccess.getInstance();
            SubscriptionManagerAccess.getInstance();

            startServer();
            System.out.println("TANGIBLE_API_READY");
		
        } catch (Exception e) {
            System.out.println("TANGIBLE_API_FAILED");
        }
    }

    private static URI getBaseURI() {
        return UriBuilder.fromUri("http://" + ipAddress + "/").port(9998).build();
    }

    protected static HttpServer startServer() throws IOException {
        ResourceConfig rc = new PackagesResourceConfig("restful");

        HttpServer server = GrizzlyServerFactory.createHttpServer(getBaseURI(), rc);
        return server;
    }
}
