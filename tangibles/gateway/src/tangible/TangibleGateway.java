/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package tangible;

import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import managers.DeviceFinder;
import managers.DeviceFinderAccess;
import tangible.devices.TangibleDevice;
import tangible.protocols.TangibleGatewayProtocol;

/**
 *
 * @author leo
 */
public class TangibleGateway implements Collection<TangibleDevice> {

    private TangibleGatewayProtocol _talk;
    private List<TangibleDevice> _devices;

    public TangibleGateway() {
        _devices = new LinkedList<TangibleDevice>();
    }

    public TangibleGatewayProtocol getTalk() {
        return _talk;
    }

    public void handleDisconnection() {
        System.out.println("disconnecting device(s) ...");
        DeviceFinder devMgr = DeviceFinderAccess.getInstance();
        for (TangibleDevice dev : _devices) {
            devMgr.removeDevice(dev);
        }
    }

    @Override
    public int size() {
        return _devices.size();
    }

    @Override
    public boolean isEmpty() {
        return _devices.isEmpty();
    }

    @Override
    public boolean contains(Object o) {
        return _devices.contains(o);
    }

    @Override
    public Iterator<TangibleDevice> iterator() {
        return _devices.iterator();
    }

    @Override
    public Object[] toArray() {
        return _devices.toArray();
    }

    @Override
    public <T> T[] toArray(T[] ts) {
        return _devices.toArray(ts);
    }

    @Override
    public boolean add(TangibleDevice e) {
        return _devices.add(e);
    }

    @Override
    public boolean remove(Object o) {
        return _devices.remove(o);
    }

    @Override
    public boolean containsAll(Collection<?> clctn) {
        return _devices.containsAll(clctn);
    }

    @Override
    public boolean addAll(Collection<? extends TangibleDevice> clctn) {
        return _devices.addAll(clctn);
    }

    @Override
    public boolean removeAll(Collection<?> clctn) {
        return _devices.removeAll(clctn);
    }

    @Override
    public boolean retainAll(Collection<?> clctn) {
        return _devices.retainAll(clctn);
    }

    @Override
    public void clear() {
        _devices.clear();
    }

    public void attachCommunication(TangibleGatewayProtocol talk) {
        _talk = talk;
    }

    public String getType() {
        return _talk.type;
    }
}
