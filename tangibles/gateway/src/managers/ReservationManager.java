/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package managers;

import java.util.Set;
import java.util.UUID;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import utils.exceptions.ApiException;

/**
 *
 * @author leo
 */
public interface ReservationManager {

    public static class UnsuccessfulReservationException extends ApiException {

        private static final long serialVersionUID = 1L;

        public UnsuccessfulReservationException() {
            this(Response.Status.CONFLICT, "");
        }

        public UnsuccessfulReservationException(Status status, String cause) {
            super(status, "Reservation unsuccessful" + ((cause == null || cause.equals("")) ? "" : " (" + cause + ")"));
        }
    }

    public static class NoSuchReservationException extends ApiException {

        private static final long serialVersionUID = 1L;

        public NoSuchReservationException() {
            this(Response.Status.CONFLICT, "Reservation not found");
        }

        public NoSuchReservationException(Status status, String cause) {
            super(status, "Reservation not found" + ((cause == null || cause.equals("")) ? "" : " (" + cause + ")"));
        }
    }

    String reserveDeviceById(String device_id, UUID app_id)
            throws UnsuccessfulReservationException;

    String reserveDeviceByType(String type, UUID app_id)
            throws UnsuccessfulReservationException;

    Set<String> reservedByAnApp(UUID app_id)
            throws UnsuccessfulReservationException;

    void endReservation(String device_id, UUID app_id) throws NoSuchReservationException;

    boolean isAReservation(String devID, UUID appUUID);
}
