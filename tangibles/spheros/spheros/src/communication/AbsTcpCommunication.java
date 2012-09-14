package communication;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.logging.Level;
import java.util.logging.Logger;

public class AbsTcpCommunication extends AbsCommunication
{
	protected Socket _sock;
	protected BufferedInputStream _in;
	protected BufferedOutputStream _out;

	protected OutputStreamWriter _outString;

	public AbsTcpCommunication( Socket sock ) throws IOException
	{
		this._sock = sock;
		_in = new BufferedInputStream( sock.getInputStream() );
		_out = new BufferedOutputStream( sock.getOutputStream() );

		_outString = new OutputStreamWriter( sock.getOutputStream() );
	}

	public Socket getSocket()
	{
		return _sock;
	}
	
	public void sendBytes( byte[] bytes ) throws IOException
	{
		_out.write( bytes, 0, bytes.length );
		_out.flush();
	}

	public void sendString( String msg ) throws IOException
	{
		Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, "Sending << " + msg + ">>" );

		_outString.write( msg.toCharArray() );
		_outString.flush();

		Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, "<< Message sent >>" );
	}
}
