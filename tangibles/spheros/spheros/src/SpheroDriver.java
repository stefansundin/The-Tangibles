import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import se.nicklasgavelin.bluetooth.Bluetooth;
import se.nicklasgavelin.bluetooth.Bluetooth.EVENT;
import se.nicklasgavelin.bluetooth.BluetoothDevice;
import se.nicklasgavelin.bluetooth.BluetoothDiscoveryListener;
import se.nicklasgavelin.sphero.Robot;
import se.nicklasgavelin.sphero.exception.InvalidRobotAddressException;
import se.nicklasgavelin.sphero.exception.RobotBluetoothException;

import driver.AppManager;
import driver.AppManagerImpl;
import driver.Sphero;

public class SpheroDriver extends Thread implements BluetoothDiscoveryListener
{
	private AppManager _appMgr = AppManagerImpl.getInstance();
	private List<Sphero> _availableSpheroDevices;
	private Bluetooth bt;

	public static void main( String[] args ) throws UnknownHostException, IOException
	{
		SpheroDriver sd = new SpheroDriver();
		sd.start();
	}
	
	public SpheroDriver()
	{
	}

	@Override
	public void run()
	{
		bt = new Bluetooth( this, Bluetooth.SERIAL_COM );
		_availableSpheroDevices = new LinkedList<Sphero>();
// bt.discover();
		BluetoothDevice btd = new BluetoothDevice( bt, "btspp://000666440DB8:1;authenticate=true;encrypt=false;master=false" );
		try
		{
			Sphero s = new Sphero( btd );
			if( s.connect() )
			{
				_availableSpheroDevices.add( s );
			}
		}
		catch( InvalidRobotAddressException e )
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch( RobotBluetoothException e )
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if( _availableSpheroDevices.size() > 0 )
			registerApplication();

		addShutdownHook();
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
						for( Sphero s : _availableSpheroDevices )
							s.disconnect();
					}
				} );

				try
				{
					k.join();
				}
				catch( InterruptedException e )
				{
				}
			}
		} ) );
	}

	private void registerApplication()
	{
		_appMgr.setupAppManager( _availableSpheroDevices, "DefaultApp" );
	}

	@Override
	public void deviceSearchCompleted( Collection<BluetoothDevice> devices )
	{
		for( BluetoothDevice btd : devices )
		{
			if( btd.getAddress().startsWith( Robot.ROBOT_ADDRESS_PREFIX ) )
			{
				// Create robot
				try
				{
					Sphero s = new Sphero( btd );
					if( s.connect() )
					{
						// Connected
						Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, "Connected to Sphero device " + s.getId() + "(" + s.getAddress() + ")" );
						_availableSpheroDevices.add( s );
//						System.out.println( btd.getConnectionURL() );
					}
				}
				catch( Exception e )
				{
					e.printStackTrace();
				}
			}
		}

		if( _availableSpheroDevices.size() > 0 )
			registerApplication();
	}

	@Override
	public void deviceDiscovered( BluetoothDevice device )
	{
	}

	@Override
	public void deviceSearchFailed( EVENT error )
	{
		Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.SEVERE, "Failed to perform device search " + error );
	}

	@Override
	public void deviceSearchStarted()
	{
		Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, "Starting device search" );
	}
}
