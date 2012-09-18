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
//    VALID_UUID("the given app id is not a valid UUID");
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
//        case VALID_UUID:
//          return isUUID(appUUID);
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
//    private boolean isUUID(String appUUID){
//      try{
//        UUID.fromString(appUUID);
//        return true;
//      } catch(IllegalArgumentException ex){
//        return false;
//      }
//    }
    }
    protected final UUID _appuuid;

    public ConditionalAccessResource(String strUUID,
            Condition[] conditions) throws UnauthorizedAccessException {
        super();
        //Logger.getLogger(ConditionalAccessResource.class.getName()).log(Level.INFO, "constructor starting");
        String finaluuid = null;
        if (strUUID != null) {
            finaluuid = strUUID;
//    }else if(strAltUUID != null){
//      finaluuid = strAltUUID;
        }
        if (finaluuid == null) {
            //System.out.println("the received uuid is null!");
            throw new UnauthorizedAccessException("the application's assigned uuid is required!");
        }
        try {
            _appuuid = UUID.fromString(finaluuid);
        } catch (IllegalArgumentException ex) {
            throw new UnauthorizedAccessException("the given uuid is not valid! ->" + finaluuid);
        }
        for (Condition c : conditions) {
            if (!c.conditionMatches(finaluuid)) {
                //throw new UnauthorizedAccessException("the application does not match this condition: "+c);
                throw new UnauthorizedAccessException(c.toString());
            }
        }
    }
//  public void assertConditions(String strUUID, String strAltUUID,
//      Condition[] conditions) throws UnauthorizedAccessException{
////    Logger.getLogger(ConditionalAccessResource.class.getName()).log(Level.INFO, "constructor starting");
//    String finaluuid = null;
//    if(strUUID != null && !strUUID.equals("")){
//      finaluuid = strUUID;
//    }else if(strAltUUID != null && !strAltUUID.equals("")){
//      finaluuid = strAltUUID;
//    }
//    if(finaluuid == null){
//      //System.out.println("the received uuid is null!");
//      throw new UnauthorizedAccessException("the application's assigned uuid is required!");
//    }
//    for(Condition c : conditions){
//      if(!c.conditionMatches(finaluuid))
//      {
//        //throw new UnauthorizedAccessException("the application does not match this condition: "+c);
//        throw new UnauthorizedAccessException(c.toString());
//      }
//    }
//  }
}
