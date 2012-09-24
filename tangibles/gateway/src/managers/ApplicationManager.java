/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package managers;

import commons.ApiException;
import javax.ws.rs.core.Response.Status;

/**
 *
 * @author leo
 */
public interface ApplicationManager {

    public static class UnsuccessfulApplicationUnRegistration extends ApiException {

        private static final long serialVersionUID = 1L;

        public UnsuccessfulApplicationUnRegistration(String appUUID) {
            this(Status.CONFLICT, "unregistration failed for " + appUUID);
        }

        public UnsuccessfulApplicationUnRegistration(Status status, String msg) {
            super(status, msg);
        }
    }

    static class Application {

        public String name, description;

        public Application(String name, String description) {
            this.name = name;
            this.description = description;
        }
    }

    public String registerApp(String name, String description);

    public String removeApplication(String uuid);

    public boolean isAppRegistred(String uuid);

    public boolean isAppRunning(String uuid);
}
