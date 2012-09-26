/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package managers;

import java.util.List;
import java.util.Properties;
import tangible.devices.TangibleDevice;
import tangible.utils.LoopingThread;
import utils.exceptions.DeviceNotFoundException;

/**
 *
 * @author leo
 */
public interface DeviceFinder extends LoopingThread {

    public void removeDevice(TangibleDevice dev);

    public static final class DeviceFinderProperties extends Properties {

        private static final long serialVersionUID = 1L;

        public enum Behaviour {

            AT_START_UP, ALWAYS, MANUAL;
        }

        public DeviceFinderProperties() {
            super();
        }

        public String protocolVersion() {
            return super.getProperty("discovery_protocol_version");
        }

        public int port() {
            return Integer.parseInt(super.getProperty("discovery_port"));
        }

        public Behaviour behaviour() {
            return Behaviour.valueOf(super.getProperty("discovery_behaviour"));
        }

        public int timeout() {
            return Integer.parseInt(super.getProperty("discovery_timeout"));
        }
    }

    void makeManualDeviceAuthenticationAttempt();

    DeviceFinderProperties getProperty();

    List<TangibleDevice> getDevices();

    boolean reserveDevice(String id);

    public boolean existsDevice(String id);

    public TangibleDevice getDevice(String device_id) throws DeviceNotFoundException;
}
