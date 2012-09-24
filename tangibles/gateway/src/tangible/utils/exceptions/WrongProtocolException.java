/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tangible.utils.exceptions;

/**
 *
 * @author leo
 */
public abstract class WrongProtocolException extends RuntimeException {

    public final String exception;

    public WrongProtocolException(String exception) {
        initCause(null);
        this.exception = exception;
    }

    @Override
    public String getMessage() {
        return "exception: " + exception;
    }
}
