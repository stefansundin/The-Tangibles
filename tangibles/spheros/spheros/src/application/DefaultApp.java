package application;

import java.awt.Color;
import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import communication.NetworkThread;
import communication.protocol.AuthenticationProtocol;

import driver.AppManager;
import driver.AppManagerImpl;
import driver.Sphero;

public class DefaultApp extends Application
{
	private AppManager _appMgr;
	private String _host;
	private int _port;

	public DefaultApp( String host, int port )
	{
		super( "application.DefaultApp", "Default application using all the Sphero devices available" );
		_host = host;
		_port = port;
	}

	public void setupDefaultApp()
	{
		initAppManager();

		List<Sphero> spheroSet = _appMgr.getAvailableSpheros();
		for( Sphero s : spheroSet )
		{
			s.setRGBLedColor( Color.PINK );
			s.setFrontLEDBrightness( 0 );
			
			Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, "Running setupDefaultApp with Sphero device " + s.getId() );
		}

		this.authenticateSpheroDriver();
	}

	private void authenticateSpheroDriver()
	{
		NetworkThread nt = NetworkThread.getInstance( _host, _port, _id );
		if( nt.isConnected() )
		{
			try
			{
				boolean authenticationProtocol = new AuthenticationProtocol( nt.getSocket() ).authenticate();
				Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, "AuthenticationSuccess ? " + ( authenticationProtocol ? "yes" : "no" ) );
				_appMgr.finalizeAuthentication();
			}
			catch( IOException e )
			{
				Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.SEVERE, null, e );
			}
		}
		else
			Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.SEVERE, "Failed to authenticate " + this.getClass().getCanonicalName() );
	}

	private void initAppManager()
	{
		if( _appMgr == null )
			_appMgr = AppManagerImpl.getInstance();
	}
}
