/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package restful.app;

import commons.ApiException;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import managers.ApplicationManager;
import managers.ApplicationManagerAccess;
import restful.utils.JSONRestResource;

/**
 *
 * @author leo
 */
@Path("tangibleapi/app")
public class RestApp extends JSONRestResource {

    ApplicationManager app = ApplicationManagerAccess.getInstance();

    @GET
    public Response getAppListing(
            @HeaderParam("Origin") String origin) {
        //just a dummy method supposed to return all the application currently running on the devices

        return createJsonCtrlResponseMsg(origin, "you cannot see the list 'cause I don't want you to do so!", Response.Status.FORBIDDEN);
    }

    @OPTIONS
    @Path("/registration/")
    public Response registerApplicationCORS(
            @HeaderParam("Access-Control-Request-Headers") String requestH,
            @HeaderParam("Origin") String origin) {
        return makeCORS(requestH, origin);
    }

    @PUT
    @Path("/registration/")
    public Response registerApplication(
            @FormParam("appname") String name,
            @FormParam("description") String description,
            @HeaderParam("Origin") String origin) {
        //TODO_LATER check that the request sender has the right to ask for that!
        System.out.println("registration: \n"
                + "appname : " + name + "\n"
                + "description: " + description);

        return createJsonCtrlResponseMsg(origin, app.registerApp(name, description), Status.OK);
    }

    @OPTIONS
    @Path("/registration/{appUUID}")
    public Response removeApplicationOption(
            @HeaderParam("Access-Control-Request-Headers") String requestH,
            @HeaderParam("Origin") String origin) {
        return makeCORS(requestH, origin);
    }

    @DELETE
    @Path("/registration/{appUUID}")
    public Response removeApplication(@PathParam("appUUID") String uuid,
            @HeaderParam("Origin") String origin) {
        //TODO_LATER error handling!
        System.out.println("unregistration: " + uuid);
        try {
            return createJsonCtrlResponseMsg(origin, app.removeApplication(uuid), Status.OK);
        } catch (ApiException e) {
            return createErrorMsg(origin, e);
        }
    }
}
