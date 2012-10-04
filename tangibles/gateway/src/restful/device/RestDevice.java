/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package restful.device;

import java.util.List;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import managers.DeviceFinder;
import managers.DeviceFinderAccess;
import managers.ReservationManager;
import managers.ReservationManagerAccess;
import restful.utils.ConditionalAccessResource;
//import sun.reflect.generics.reflectiveObjects.NotImplementedException;
import tangible.devices.TangibleDevice;

/**
 *
 * @author leo
 */
@Path("/tangibleapi/{appuuid}/device")
public class RestDevice extends ConditionalAccessResource {
//public class RestDevice extends JSONRestResource {

    private DeviceFinder _finder = DeviceFinderAccess.getInstance();
    private ReservationManager _mgr = ReservationManagerAccess.getInstance();

    public RestDevice(@PathParam("appuuid") String uuid) {
        super(uuid, new Condition[]{Condition.APP_REGISTERED});
//    System.out.println("the received uuid is : "+uuid);
    }

    @OPTIONS
    public Response getDeviceListOption(
            @HeaderParam("Access-Control-Request-Headers") String requestH,
            @HeaderParam("Origin") String origin) {
        return makeCORS(requestH, origin);
    }

    @GET
    public Response getDeviceList(
            @HeaderParam("Origin") String origin) {
        System.out.println("listing devices");
        List<TangibleDevice> list = _finder.getDevices();
        if (list.isEmpty()) {
            return createErrorMsg(origin, "no registered devices", "Connect some devices to the API to solve this problem");
        } else {
            return createJsonCtrlResponseMsg(origin, _finder.getDevices(), Status.OK);
        }
    }

    @OPTIONS
    @Path("/reservation")
    public Response reservationOptions(
            @HeaderParam("Access-Control-Request-Headers") String requestH,
            @HeaderParam("Origin") String origin) {
        return makeCORS(requestH, origin);
    }

    @PUT
    @Path("/reservation")
    public Response makeReservationByCapability(
            @HeaderParam("Origin") String origin) {
        return createJsonCtrlResponseMsg(origin, new Exception(), Response.Status.SERVICE_UNAVAILABLE);
    }

    @OPTIONS
    @Path("/reservation/{deviceId}")
    public Response reservationDeviceOptions(
            @HeaderParam("Access-Control-Request-Headers") String requestH,
            @HeaderParam("Origin") String origin) {
        return makeCORS(requestH, origin);
    }

    @PUT
    @Path("/reservation/{deviceId}")
    public Response makeReservationById(
            @PathParam("deviceId") String id,
            @PathParam("appuuid") String appUUID,
            @HeaderParam("Origin") String origin) {
        System.out.println("Reserving device #" + id + " for application " + appUUID);
        try {
            String reservation = _mgr.reserveDeviceById(id, _appuuid);
            return createJsonCtrlResponseMsg(origin, reservation, Status.OK);
        } catch (ReservationManager.UnsuccessfulReservationException ex) {
            return new RestApiException(origin, ex, true).getResponse();
        }
    }

    @DELETE
    @Path("/reservation/{deviceId}")
    public Response cancelReservation(
            @PathParam("deviceId") String id,
            @PathParam("appuuid") String appUUID,
            @HeaderParam("Origin") String origin) {
        System.out.println("Releasing device #" + id + " hold by app " + appUUID);
        try {
            _mgr.endReservation(id, _appuuid);
            return createJsonResponseMsg(origin, id, true, Status.OK);
        } catch (ReservationManager.NoSuchReservationException ex) {
            return createErrorMsg(origin, "this reservation doesn't exist", "device: " + id + " / appUUID: " + appUUID);
        }
    }

    @OPTIONS
    @Path("/info")
    public Response infoOptions(
            @HeaderParam("Access-Control-Request-Headers") String requestH,
            @HeaderParam("Origin") String origin) {
        return makeCORS(requestH, origin);
    }

    @GET
    @Path("/info")
    public Response getInformations(
            @HeaderParam("Origin") String origin) {
        return createJsonCtrlResponseMsg(origin, new Exception(), Response.Status.SERVICE_UNAVAILABLE);
    }

    @OPTIONS
    @Path("/info/{deviceUUID}")
    public Response infoDeviceOptions(
            @HeaderParam("Access-Control-Request-Headers") String requestH,
            @HeaderParam("Origin") String origin) {
        return makeCORS(requestH, origin);
    }

    @GET
    @Path("/info/{deviceUUID}")
    public Response getDeviceInformation(
            @HeaderParam("Origin") String origin) {
        return createJsonCtrlResponseMsg(origin, new Exception(), Response.Status.SERVICE_UNAVAILABLE);
    }
}
