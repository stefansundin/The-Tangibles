package communication.protocol.messages;

import com.google.gson.annotations.SerializedName;

public class ColorCommandParameters
{
	public RGBColor color;
	
	@SerializedName( "devices" )
	public String[] devices;

	public class RGBColor
	{
		public int r, g, b;
	}
}
