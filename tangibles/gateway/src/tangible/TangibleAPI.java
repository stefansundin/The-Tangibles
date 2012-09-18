package tangible;

import com.sun.jersey.api.container.grizzly2.GrizzlyServerFactory;
import com.sun.jersey.api.core.PackagesResourceConfig;
import com.sun.jersey.api.core.ResourceConfig;
import java.io.IOException;
import java.net.InetAddress;
import java.net.URI;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.core.UriBuilder;
import managers.*;
import org.glassfish.grizzly.http.server.HttpServer;

/**
 *
 * @author leo
 */
public class TangibleAPI {

    private static String pathToResources;
    private static String ipAddress = "localhost";

    /**
     * @param args the command line arguments
     * @throws IOException
     */
    public static void main(String[] args) throws IOException {
        ipAddress = InetAddress.getLocalHost().getHostAddress();
        ipAddress = "0.0.0.0";
        System.out.println("IP address is: " + ipAddress);
        if (args.length == 1) {
            pathToResources = args[0];
        } else {
            pathToResources = "resources";
        }
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
            Logger.getLogger(TangibleAPI.class.getName()).log(Level.INFO,
                    "an exception occured when initializing tangibleAPI", e);
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
