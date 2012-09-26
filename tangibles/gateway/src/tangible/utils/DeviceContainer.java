/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package tangible.utils;

import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import tangible.devices.TangibleDevice;
import utils.exceptions.DeviceNotFoundException;

/**
 *
 * @author leo
 */
public class DeviceContainer implements Collection<TangibleDevice> {

    private static class DeviceContainerIterator implements Iterator<TangibleDevice> {

        private Map<String, Set<TangibleDevice>> _container;
        private Iterator<String> _map_keys_ite;
        private Iterator<TangibleDevice> _current_set_ite;

        public DeviceContainerIterator(Map<String, Set<TangibleDevice>> devices) {
            _container = devices;
            _map_keys_ite = _container.keySet().iterator();
            _current_set_ite = null;
        }

        @Override
        public boolean hasNext() {
            if (_current_set_ite != null && _current_set_ite.hasNext()) {
                return true;
            } else {
                if (_map_keys_ite.hasNext()) {
                    _current_set_ite = _container.get(_map_keys_ite.next()).iterator();
                    return _current_set_ite.hasNext();
                } else {
                    return false;
                }
            }
            //there is obviously more elements if there are keys unexplored in the Map
            // or if there are elements left to see in the current set (checked only if the set is the last one unexplored)
        }

        @Override //WARNING: this next algorithm will probably explode if the DeviceContainer allow empty Set within the Map!!!
        public TangibleDevice next() {
            TangibleDevice dev;
            //first check that the set iterator is initialized.
            if (_current_set_ite == null) {
                //if not then do it...
                _current_set_ite = _container.get(_map_keys_ite.next()).iterator();
            }
            //then try to read the next item from it
            try {
                dev = _current_set_ite.next();
            } catch (NoSuchElementException ex) {
                //if there are no more elements avaiable in this set it's time to take the next one!
                _current_set_ite = _container.get(_map_keys_ite.next()).iterator();
                //the line above will send a NoSuchElementException if there are no more set to visit
                //which is good.
                //if there is at least a set to visit then:
                dev = _current_set_ite.next();
                //that should do it!
            }
            return dev;
        }

        @Override
        public void remove() {
            if (_current_set_ite != null) {
                _current_set_ite.remove();
            } else {
                throw new IllegalStateException();
            }
        }
    }
    private Map<String, Set<TangibleDevice>> _devices;

    public DeviceContainer() {
        _devices = new LinkedHashMap<String, Set<TangibleDevice>>();

    }

    @Override
    public int size() {
        int size = 0;
        for (Iterator<String> ite = _devices.keySet().iterator();
                ite.hasNext();) {
            size += _devices.get(ite.next()).size();
        }
        return size;
    }

    @Override
    public boolean isEmpty() {
        return _devices.isEmpty();
    }

    @Override
    public boolean contains(Object o) {
        if (o instanceof TangibleDevice) {
            TangibleDevice dev = (TangibleDevice) o;
            return _devices.get(dev.getType()).contains(o);
        } else {
            return false;
        }
    }

    @Override
    public Iterator<TangibleDevice> iterator() {
        return new DeviceContainerIterator(_devices);
    }

    @Override
    public Object[] toArray() {
        return _devices.values().toArray();
    }

    @Override
    public <T> T[] toArray(T[] ts) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public boolean add(TangibleDevice e) {
        //the mainly interesting method in this class:
        String type = e.getType();
        if (!_devices.containsKey(type)) {
            _devices.put(type, new LinkedHashSet<TangibleDevice>());
        }
        return _devices.get(type).add(e);
    }

    @Override
    public boolean remove(Object o) {
        if (o instanceof TangibleDevice) {
            TangibleDevice dev = (TangibleDevice) o;
            if (!_devices.containsKey(dev.getType())) {
                // no such type of device!
                return false;
            } else {
                return _devices.get(dev.getType()).remove(o);
            }
        } else {
            return false;
        }
    }

    @Override
    public boolean containsAll(Collection<?> clctn) {
        boolean contains = true;
        for (Iterator<?> ite = clctn.iterator(); contains && ite.hasNext();) {
            Object obj = ite.next();
            contains = (obj instanceof TangibleDevice)
                    && this.contains((TangibleDevice) obj);
        }
        return contains;
    }

    @Override
    public boolean addAll(Collection<? extends TangibleDevice> clctn) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public boolean removeAll(Collection<?> clctn) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public boolean retainAll(Collection<?> clctn) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void clear() {
        _devices.clear();
    }

    public boolean containsId(String id) {
        boolean find = false;
        for (Iterator<TangibleDevice> ite = this.iterator(); !find && ite.hasNext();) {
            if (ite.next().getId().equals(id)) {
                //we found it!
                find = true;
            }
        }
        return find;
    }

    public TangibleDevice getById(String id) throws DeviceNotFoundException {
        Iterator<TangibleDevice> ite = this.iterator();
        while (ite.hasNext()) {
            TangibleDevice dev = ite.next();
            if (dev.getId().equals(id)) {
                //we found it!
                return dev;
            }//else let's go on looking for it
        }
        //all the container has been searched, there is no such device in here!
        throw new DeviceNotFoundException(id);
    }
}
