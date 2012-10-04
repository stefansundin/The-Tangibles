/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package restful;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import restful.utils.JSONRestResource;

/**
 *
 * @author leo
 */
@Path("/tangibleapi")
//@Produces({MediaType.APPLICATION_JSON})
public class RestTangibleAPI extends JSONRestResource {

    @GET
    public Response getWelcomeMessage(
            @HeaderParam("Origin") String origin) {
        return createJsonCtrlResponseMsg(origin, "Welcome on the tangibleAPI deployed on this computer", Response.Status.OK);
    }

//  @GET @Path("/testuri")
//  public Response getSimpleMessage(){
//    return createJsonCtrlResponseMsg("This is a simple message to test the @path stuff", Response.Status.OK);
//  }
    @GET
    @Path("/test/")
    public Response helloGet(@QueryParam("p") String param,
            @HeaderParam("Origin") String origin) {
        return this.createJsonCtrlResponseMsg(origin, "p was: " + param, Response.Status.OK);
    }

    @DELETE
    @Path("/test/")
    public Response helloDelete(@FormParam("p") String param,
            @HeaderParam("Origin") String origin) {
        return this.createJsonCtrlResponseMsg(origin, "p was: " + param, Response.Status.OK);
    }

    @POST
    @Path("/test/")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response helloPost(@FormParam("p") String param,
            @HeaderParam("Origin") String origin) {
        return this.createJsonCtrlResponseMsg(origin, "p was: " + param, Response.Status.OK);
    }

    @PUT
    @Path("/test/")
    public Response helloPut(@FormParam("p") String param,
            @HeaderParam("Origin") String origin) {
        return this.createJsonCtrlResponseMsg(origin, "p was: " + param, Response.Status.OK);
    }
}
