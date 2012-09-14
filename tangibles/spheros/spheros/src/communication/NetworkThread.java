package communication;

import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

public class NetworkThread
{
	private Socket s;

	private final String host;
	private final int port;

// private final ReadingThread readingThread;

	private static final Object syncRoot = new Object();
	private static Map<String, NetworkThread> instances;

	public static NetworkThread getInstance( String host, int port, String key )
	{
		if( instances == null )
			instances = new HashMap<String, NetworkThread>();

		if( instances.keySet().contains( key ) )
			return instances.get( key );
		else
		{
			NetworkThread nt = new NetworkThread( host, port );
			synchronized( syncRoot )
			{
				instances.put( key, nt );
			}

			return nt;
		}
	}

	public static NetworkThread getInstance( String key )
	{
		if( instances == null )
			return null;
		
		if( instances.keySet().contains( key  ) )
			return instances.get( key );
		
		return null;
	}

	private NetworkThread( String host, int port )
	{
		this.host = host;
		this.port = port;

		this.connect();
	}

	public boolean isConnected()
	{
		return this.s.isConnected();
	}

	public Socket getSocket()
	{
		return this.s;
	}

	private void connect() throws UnableToConnectException
	{
		try
		{
			this.s = new Socket( host, port );
		}
		catch( Exception e )
		{
			throw new UnableToConnectException( e.getMessage() );
		}
	}
}
