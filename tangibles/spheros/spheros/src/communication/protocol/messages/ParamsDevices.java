package communication.protocol.messages;

import com.google.gson.annotations.SerializedName;

public class ParamsDevices
{	
	@SerializedName( "devices" )
	public String[] devices;
}