package communication.protocol;

import java.io.IOException;
import java.net.Socket;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gson.JsonElement;
import com.google.gson.JsonSyntaxException;

import communication.JsonTcpCommunication;
import driver.AppManagerImpl;
import driver.DriverInformation;

public class AuthenticationProtocol extends JsonTcpCommunication
{

	public AuthenticationProtocol( Socket sock ) throws IOException
	{
		super( sock );
	}

	public boolean authenticate()
	{
		DriverInformation info = AppManagerImpl.getInstance().driverInfo();
		sendCtrlMessage( info );
		info( "Information message sent, waiting for response" );

		JsonElement answer = this.read();
		if( answer != null )
		{
			try
			{
				AuthenticationResponse resp = _gson.fromJson( answer, AuthenticationResponse.class );
				return resp.msg.success;
			}
			catch( JsonSyntaxException e )
			{
				// Failure to authenticate
			}
		}

		return false;
	}

	private void info( String msg )
	{
		Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, msg );
	}

	private class AuthenticationResponse
	{
		String flow;
		private Response msg;

		private class Response
		{
			boolean success;
			String msg;
		}
	}
}
