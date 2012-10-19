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
    public Response getAppListing() {
        return createJsonCtrlResponseMsg("you cannot see the list 'cause I don't want you to do so!", Response.Status.FORBIDDEN);
    }

    @OPTIONS
    @Path("/registration/")
    public Response registerApplicationCORS() {
        return makeCORS();
    }

    @PUT
    @Path("/registration/")
    public Response registerApplication(
            @FormParam("appname") String name,
            @FormParam("description") String description) {
        //TODO_LATER check that the request sender has the right to ask for that!
        System.out.println("registration: \n"
                + "appname : " + name + "\n"
                + "description: " + description);

        return createJsonCtrlResponseMsg(app.registerApp(name, description), Status.OK);
    }

    @OPTIONS
    @Path("/registration/{appUUID}")
    public Response removeApplicationOption() {
        return makeCORS();
    }

    @DELETE
    @Path("/registration/{appUUID}")
    public Response removeApplication(@PathParam("appUUID") String uuid) {
        System.out.println("unregistration: " + uuid);
        try {
            return createJsonCtrlResponseMsg(app.removeApplication(uuid), Status.OK);
        } catch (ApiException e) {
            return createErrorMsg(e);
        }
    }
}
