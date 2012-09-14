package communication.protocol;

import java.awt.Color;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gson.JsonElement;
import com.google.gson.JsonStreamParser;

import communication.JsonTcpCommunication;
import communication.protocol.messages.ColorCommandParameters;
import communication.protocol.messages.CommandMessage;
import driver.AppManagerImpl;
import driver.Sphero;

public class GeneralCommunicationProtocol extends JsonTcpCommunication
{
	private JsonReaderThread _readerThread;

	public GeneralCommunicationProtocol( Socket sock ) throws IOException
	{
		super( sock );

		_readerThread = new JsonReaderThread();
	}

	public void start()
	{
		_readerThread.start();
	}

	private class JsonReaderThread extends Thread
	{
		private InputStreamReader in;
		private boolean stop = false;

		public void stopThread()
		{
			this.stop = true;
		}

		@Override
		public void run()
		{
			addShutdownHook();

			int read = -1;
			char[] buffer = new char[ 4096 ];
			in = null;
			try
			{
				in = new InputStreamReader( getSocket().getInputStream(), "UTF-8" );

				while( !stop )
				{
					read = in.read( buffer );
					if( read > 0 )
					{
						JsonStreamParser parser = new JsonStreamParser( String.copyValueOf( buffer, 0, read ) );
						while( parser.hasNext() )
							handleMessage( parser.next() );
					}
					else
					{
						Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.SEVERE, "Failed to read a proper message (message = null), closing " + this.getClass().getName() );
						this.stopThread(); // Something has happened to the stream, close
											// the application down.
					}
				}
			}
			catch( Exception e )
			{
				if( in == null )
					this.stopThread();
			}
		}

		private void addShutdownHook()
		{
			Runtime.getRuntime().addShutdownHook( new Thread( new Runnable() {
				@Override
				public void run()
				{
					Thread k = new Thread( new Runnable() {

						@Override
						public void run()
						{
							JsonReaderThread.this.stopThread();

							try
							{
								if( JsonReaderThread.this.in != null )
									JsonReaderThread.this.in.close();

								// Force thread interruption
								JsonReaderThread.this.notifyAll();
							}
							catch( Exception e )
							{
							}
						}
					} );

					try
					{
						k.join(); // Wait for our closing thread to be finished
					}
					catch( InterruptedException e )
					{
					}
				}
			} ) );
		}

		private void handleMessage( JsonElement element )
		{
			info( "Handling message " + element );

			String msgType = getMessageType( element );

			if( isEventMessage( msgType ) )
				handleEventMessage( element );
			else if( isCtrlMessage( msgType ) )
				handleCtrlMessage( element );
		}

		private boolean isCtrlMessage( String flow )
		{
			return flow.equals( "ctrl" );
		}

		private boolean isEventMessage( String flow )
		{
			return flow.equals( "event" );
		}

		private String getMessageType( JsonElement element )
		{
			return element.getAsJsonObject().get( "flow" ).getAsString();
		}

		private void handleEventMessage( JsonElement msg )
		{
			info( "The following message was received << " + msg + " >>" );
			CommandMessage cmdMsg = _gson.fromJson( msg, CommandMessage.class );

			if( cmdMsg.msg.command.equals( "show_color" ) )
			{
				ColorCommandParameters params = _gson.fromJson( cmdMsg.msg.params, ColorCommandParameters.class );

				Color to = new Color( params.color.r, params.color.g, params.color.b );
				List<Sphero> devices = AppManagerImpl.getInstance().availableSpheros();
				for( String sphero : params.devices )
				{
					for( final Sphero device : devices )
						if( device.getId().equals( sphero ) )
							device.setRGBLedColor( to );
				}
			}
		}

		private void handleCtrlMessage( JsonElement msg )
		{
			info( "Received ctrl message: " + msg );
		}
	}

	private void info( String msg )
	{
		Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, msg );
	}
}
