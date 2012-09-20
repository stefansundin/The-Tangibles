/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package restful.utils;

import java.util.UUID;
import managers.ApplicationManager;
import managers.ApplicationManagerAccess;

/**
 *
 * @author leo
 */
public abstract class ConditionalAccessResource extends JSONRestResource {

    protected enum Condition {

        APP_REGISTERED("registred application required"),
        APP_RUNNING("running application required");
        
        private ApplicationManager mgr = ApplicationManagerAccess.getInstance();
        private String toStringName;

        Condition(String name) {
            toStringName = name;
        }

        @Override
        public String toString() {
            return toStringName;
        }

        protected boolean conditionMatches(String appUUID) {
            switch (this) {
                case APP_REGISTERED:
                    return isAppRegistered(appUUID);
                case APP_RUNNING:
                    return isAppRunning(appUUID);
                default:
                    throw new RuntimeException(new EnumConstantNotPresentException(Condition.class, "this enum is not a valid condition"));
            }
        }

        private boolean isAppRegistered(String appUUID) {
            return mgr.isAppRegistred(appUUID);
        }

        private boolean isAppRunning(String appUUID) {
            return mgr.isAppRunning(appUUID);
        }
    }
    protected final UUID _appuuid;

    public ConditionalAccessResource(String strUUID,
            Condition[] conditions) throws UnauthorizedAccessException {
        super();
        String finaluuid = null;
        if (strUUID != null) {
            finaluuid = strUUID;
        }
        if (finaluuid == null) {
            throw new UnauthorizedAccessException("the application's assigned uuid is required!");
        }
        try {
            _appuuid = UUID.fromString(finaluuid);
        } catch (IllegalArgumentException ex) {
            throw new UnauthorizedAccessException("the given uuid is not valid! ->" + finaluuid);
        }
        for (Condition c : conditions) {
            if (!c.conditionMatches(finaluuid)) {
                throw new UnauthorizedAccessException(c.toString());
            }
        }
    }
}
