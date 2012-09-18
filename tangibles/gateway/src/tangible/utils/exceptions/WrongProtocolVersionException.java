/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tangible.utils.exceptions;

/**
 *
 * @author leo
 */
public class WrongProtocolVersionException extends WrongProtocolException {

    public final String driver_version;
    public final String tangibleAPI_version;

    public WrongProtocolVersionException(String dr_version, String api_version) {
        super("WrongProtocolVersionException");
        driver_version = dr_version;
        tangibleAPI_version = api_version;
    }
}
