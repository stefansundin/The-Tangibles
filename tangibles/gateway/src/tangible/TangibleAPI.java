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
import org.glassfish.grizzly.http.server.StaticHttpHandler;

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
//			SubscriptionManager subsMgr = 
            SubscriptionManagerAccess.getInstance();
            //    System.out.println("DeviceFinder is started!");

            //let's start the REST part
//			HttpServer restServer = 
            startServer();
            //    System.out.println("the Rest Server is started!");

            System.out.println("TANGIBLE_API_READY");


//			BufferedReader reader = 
//					new BufferedReader(new InputStreamReader(System.in));
//			System.out.println("Press enter to shut down the TangibleAPI daemon");
//			try {
//				reader.readLine();
//				finder.stopASAP();
//				restServer.stop();
//				subsMgr.stopASAP();
//				System.out.println("The system should turn off soon");
//			} catch (IOException ex) {
//				Logger.getLogger(TangibleAPI.class.getName())
//						.log(Level.SEVERE, null, ex);
//			}
//			
        } catch (Exception e) {
            System.out.println("TANGIBLE_API_FAILED");
            Logger.getLogger(TangibleAPI.class.getName()).log(Level.INFO,
                    "an exception occured when initializing tangibleAPI", e);
        }



    }

    private static URI getBaseURI() {
//    return UriBuilder.fromUri("http://130.240.94.8/").port(9998).build();
        return UriBuilder.fromUri("http://" + ipAddress + "/").port(9998).build();
    }
//  public static final URI BASE_URI = getBaseURI();

    protected static HttpServer startServer() throws IOException {
//    System.out.println("Starting grizzly...");
        ResourceConfig rc = new PackagesResourceConfig("restful");

        HttpServer server = GrizzlyServerFactory.createHttpServer(getBaseURI(), rc);
//    server.getServerConfiguration()
//			.addHttpHandler(new StaticHttpHandler("resources\\"), "/resources");
        server.getServerConfiguration()
                .addHttpHandler(new StaticHttpHandler(pathToResources), "/resources");

        return server;
    }
}
