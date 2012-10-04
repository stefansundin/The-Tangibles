package tangible.utils.exceptions;

/**
 *
 * @author leo
 */
public class UnSupportedDeviceType extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public UnSupportedDeviceType(String string) {
        super(string);
    }
}
