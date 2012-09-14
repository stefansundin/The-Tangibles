package driver;

import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import communication.NetworkThread;
import communication.protocol.GeneralCommunicationProtocol;

import application.DefaultApp;

public class AppManagerImpl extends AppManager
{
	private String _appID;
	private DefaultApp _defaultApp;

	private GeneralCommunicationProtocol _generalComm;

	private static AppManagerImpl instance;

	public static AppManagerImpl getInstance()
	{
		if( instance == null )
			instance = new AppManagerImpl();
		return instance;
	}

	private AppManagerImpl()
	{
		_setOfSphero = null;
		_defaultApp = new DefaultApp( "localhost", 60000 );
	}

	public void setupAppManager( List<Sphero> spheroSet, String appID )
	{
		_setOfSphero = spheroSet;
		_availableSpheros = spheroSet;
		_appID = appID;

		_defaultApp.setupDefaultApp();

		Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, "setupAppManager() over" );
	}

	public void turnOffDriver()
	{

	}

	public DriverInformation driverInfo()
	{
		return new DriverInformation( _setOfSphero, _appID );
	}

	public List<Sphero> availableSpheros()
	{
		return _availableSpheros;
	}

	@Override
	public void finalizeAuthentication()
	{
		try
		{
			_generalComm = new GeneralCommunicationProtocol( NetworkThread.getInstance( _defaultApp.getApplicationId() ).getSocket() );
			_generalComm.start();
		}
		catch( IOException e )
		{
			e.printStackTrace();
		}
	}
}
