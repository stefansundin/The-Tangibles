/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package managers;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 *
 * @author leo
 */
public enum ApplicationManagerAccess implements SingletonAccessor<ApplicationManager> {

    INSTANCE;
    private ApplicationManager _appMgr;

    private static class ApplicationManagerImpl implements ApplicationManager {
        //add the fields here

        private Map<UUID, Application> _apps;

        //private constructor
        private ApplicationManagerImpl() {
            _apps = new HashMap<UUID, Application>();
        }

        @Override
        public String registerApp(String name, String description) {
            UUID newAppId = UUID.randomUUID();
            _apps.put(newAppId, new Application(name, description));
            return newAppId.toString();
        }

        @Override
        public String removeApplication(String uuid) {
            UUID appId = UUID.fromString(uuid);
            if (_apps.containsKey(appId)) {
                ReservationManager mgr = ReservationManagerAccess.getInstance();
                Set<String> reservedDevices = mgr.reservedByAnApp(appId);
                for (String dev : reservedDevices) {
                    mgr.endReservation(dev, appId);
                }
                _apps.remove(appId);
                return "det är en bra succes";
            } else {
                //TODO throw exception and catch it in the RESTful part
                throw new UnsuccessfulApplicationUnRegistration(uuid);
            }
        }

        @Override
        public boolean isAppRegistred(String uuid) {
//      System.out.println("the uuid of the app is:");
//      System.out.println(uuid);

            UUID appID = UUID.fromString(uuid);
            return _apps.containsKey(appID);
        }

        @Override
        public boolean isAppRunning(String uuid) {
            throw new UnsupportedOperationException("Not supported yet.");
        }
    }

    private ApplicationManagerAccess() {
        _appMgr = new ApplicationManagerImpl();
    }

    public static ApplicationManager getInstance() {
        return INSTANCE._appMgr;
    }
}
