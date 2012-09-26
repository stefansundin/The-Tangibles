/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package tangible.devices;

import com.google.gson.annotations.SerializedName;
import tangible.TangibleGateway;
import tangible.protocols.TangibleDeviceProtocol;

/**
 *
 * @author leo
 */
public class TangibleDevice {

    private transient TangibleGateway _gateway;
    private transient TangibleDeviceProtocol _talk;
    private final String id;
    private final String type;
    @SerializedName("protocolVersion")
    public final String protocol_version;

    public TangibleDevice(TangibleGateway gateway, String devId) {
        this._gateway = gateway;
        id = devId;
        type = _gateway.getType();
        protocol_version = _gateway.getTalk().protocol_version;
    }

    public TangibleGateway getGateway() {
        return _gateway;
    }

    public String getId() {
        return id;
    }

    public void attachDeviceProtocol(TangibleDeviceProtocol talk) {
        _talk = talk;
    }

    public TangibleDeviceProtocol getTalk() {
        return _talk;
    }

    public String getType() {
        return type;
    }
}
