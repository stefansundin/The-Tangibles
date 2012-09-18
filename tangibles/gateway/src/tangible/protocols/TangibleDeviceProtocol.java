/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package tangible.protocols;

import java.awt.image.BufferedImage;
import restful.streaming.AbstractStreamingThread;
import tangible.devices.TangibleDevice;
import tangible.enums.Capacity;
import utils.ColorHelper;

/**
 *
 * @author leo
 */
public class TangibleDeviceProtocol {

    private TangibleGatewayProtocol _talk;
    private TangibleDevice _dev;

    public TangibleDeviceProtocol(TangibleDevice dev) {
        _dev = dev;
        _talk = _dev.getGateway().getTalk();
    }

    private String[] getDevId() {
        return new String[]{_dev.getId()};
    }

    public void showColor(int r, int g, int b) {
        _talk.showColor(r, g, b, getDevId());
    }

    public void showColor(int color) {
        int[] rgb = ColorHelper.decompose(color);
        _talk.showColor(rgb[0], rgb[1], rgb[2], getDevId());
    }

    public void showPicture(BufferedImage img) {
        _talk.showPicture(img, getDevId());
    }

    public void addAllEventsNotification(AbstractStreamingThread sTh) {
        _talk.startAllEventReporting(sTh, getDevId());
    }

    public void showText(String msg) {
        _talk.showText(msg, getDevId());
    }

    public void showText(String msg, int color) {
        _talk.showText(msg, color, getDevId());
    }

    public void fadeColor(int color) {
        _talk.fadeColor(color, getDevId());
    }

    public Capacity[] getCapacities() {
        return _talk.getCapacities();
    }
}