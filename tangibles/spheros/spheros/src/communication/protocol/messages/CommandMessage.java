package communication.protocol.messages;

import com.google.gson.JsonElement;
import com.google.gson.annotations.SerializedName;

public class CommandMessage
{
	public String flow;

	@SerializedName( "msg" )
	public Command msg;

	public class Command
	{
		public String command;
		public JsonElement params;
	}
}
