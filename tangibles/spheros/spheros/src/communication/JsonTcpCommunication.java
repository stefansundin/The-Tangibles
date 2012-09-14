package communication;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonStreamParser;

public class JsonTcpCommunication extends AbsTcpCommunication
{
	protected Gson _gson;

	public JsonTcpCommunication( Socket sock ) throws IOException
	{
		super( sock );
		this._gson = new Gson();
	}

	public void sendCtrlMessage( Object obj )
	{
		this.sendMessage( obj, false );
	}

	public void sendEventMessage( Object obj )
	{
		this.sendMessage( obj, true );
	}

	private void sendMessage( Object msg, boolean isEvent )
	{
		try
		{
			sendString( constructJsonMessageString( msg, isEvent ) );
		}
		catch( IOException e )
		{
			Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.SEVERE, "Failed to send JSON message to API" );
		}
	}

	private String constructJsonMessageString( Object msg, boolean isEvent )
	{
		JsonObject obj = new JsonObject();

		if( isEvent )
			obj.addProperty( "flow", "event" );
		else
			obj.addProperty( "flow", "ctrl" );
		obj.add( "msg", _gson.toJsonTree( msg ) );
		return _gson.toJson( obj );
	}

	public JsonElement read()
	{
		JsonStreamParser reader;
		try
		{
			reader = new JsonStreamParser( new InputStreamReader( _sock.getInputStream(), "UTF-8" ) );
			if( reader.hasNext() )
				return reader.next();
		}
		catch( Exception e )
		{
			e.printStackTrace();
		}

		return null;
	}
}
