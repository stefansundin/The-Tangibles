package main;


import java.io.IOException;
import java.net.UnknownHostException;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import listener.AliveListener;
import se.nicklasgavelin.bluetooth.Bluetooth;
import se.nicklasgavelin.bluetooth.Bluetooth.EVENT;
import se.nicklasgavelin.bluetooth.BluetoothDevice;
import se.nicklasgavelin.bluetooth.BluetoothDiscoveryListener;
import se.nicklasgavelin.sphero.Robot;
import utils.SpheroConfig;
import driver.AppManagerImpl;
import driver.Sphero;

public class SpheroDriver extends Thread implements BluetoothDiscoveryListener
{
	private AppManagerImpl _appMgr = AppManagerImpl.getInstance();
	private List<Sphero> _availableSpheroDevices;
	private Bluetooth bt;
	private SpheroConfig config;

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
		_availableSpheroDevices = new LinkedList<Sphero>();
		
		
		config = new SpheroConfig();
		try {
			String devID = config.load();
			directConnect(devID);
		} catch (Exception e) {
			deviceSearch();
		}		
	}
	
	private void deviceSearch(){
		bt = new Bluetooth( this, Bluetooth.SERIAL_COM );
		bt.discover(); // # COMMENT THIS IF UNCOMMENTING THE BELOW AREA #		
	}

	private void addShutdownHook() {
		Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {

			@Override
			public void run() {
				Thread k = new Thread(new Runnable() {

					@Override
					public void run() {
						for (Sphero s : _availableSpheroDevices)
							s.disconnect();
					}
				});

				try {
					k.join();
				} catch (InterruptedException e) {
				}
			}
		}));
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
						config.save(s.getId());
						
						AliveListener aliveListener = new AliveListener(this);
						s.addListener(aliveListener);
						
						System.out.println( btd.getConnectionURL() );
					} else {
						throw new Exception("Sphero not connected");
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
	
	public void directConnect(String id) throws Exception{
		//String id = "000666440DB8";   //WBG     "<BluetoothIdForSphero>";
		//String id = "0006664438B8";  //BBR     "<BluetoothIdForSphero>";
		//String id = "000666441796";  //RBR     "<BluetoothIdForSphero>";
		Bluetooth bt = new Bluetooth( this, Bluetooth.SERIAL_COM );
		BluetoothDevice btd = new BluetoothDevice( bt, "btspp://" + id + ":1;authenticate=true;encrypt=false;master=false" );
					
		if( btd.getAddress().startsWith( Robot.ROBOT_ADDRESS_PREFIX ) )
		{
			 //Create robot
			/*try
			{*/
				Sphero s = new Sphero( btd );
				if( s.connect() )
				{
					
					// Connected
					Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, "Connected to Sphero device " + s.getId() + "(" + s.getAddress() + ")" );

					_availableSpheroDevices.add( s );
					
					if( _availableSpheroDevices.size() > 0 ){
						registerApplication();
					}
					
					/*
					ArrayList<Event> events = new ArrayList<Event>();
					events.add(Event.ACCELEROMETER);
					s.activateEvents(events);
					*/
					
					AliveListener aliveListener = new AliveListener(this);
					s.addListener(aliveListener);
					
					addShutdownHook();
				} else {
					throw new Exception("Sphero not connected");
				}
			/*}
			catch( Exception e )
			{
				e.printStackTrace();
			}*/
		}
		
		
			
			//a completely different kind of connect
//			Robot r;
//			try {
//				r = new Robot( btd );
//				if( r.connect() )
//				{
//					
//					Logger.getLogger( SpheroDriver.class.getName() ).log( Level.INFO, "Connected to robot!" );
					
				
			    // Successfully connected to Sphero device
			    // may start sending commands now

			    // Send a RGB command that will turn the RGB LED red
			    //r.sendCommand( new RGBLEDCommand( 255, 155, 0 ) );

			    // Send a roll command to the Sphero with a given heading
			    // Notice that we havn't calibrated the Sphero so we don't know
			    // which way is which atm.
				
				
				//blue - roll
//			    r.sendCommand( new RGBLEDCommand( 255, 0, 0 ) );    //turn blue
//			    r.sendCommand( new RollCommand( 180, 1, false ) );
//			    r.sendCommand( new RollCommand( 180, 1, true ),500); //stop after ..
//			    r.sendCommand( new RGBLEDCommand( 255, 0, 0 ), 500);  //turn red
//			    
//			    pause(2000);
//			    
//
//			    r.addListener(this.r);
//			    r.sendCommand(new SetDataStreamingCommand(10, 17, DATA_STREAMING_MASKS.GYRO.X.FILTERED, 200));
			    
//			    r.sendCommand( new RGBLEDCommand( 255, 0, 0 ) );    //turn blue
//			    r.sendCommand( new RollCommand( 180, 1, false ) );
//			    r.sendCommand( new RollCommand( 180, 1, true ),500); //stop after 2500
//			    r.sendCommand( new RGBLEDCommand( 255, 0, 0 ), 500);  //turn red
//			    pause(3000);
//			    
//			    //yellow - slow spin
//			    r.sendCommand(new SpinLeftCommand(155),0);
//			    r.sendCommand( new RGBLEDCommand( 255, 255, 0 ) );
//			    pause(1500);
//			    
//			    //green - fast spin
//			    r.sendCommand(new SpinLeftCommand(255),0);
//			    r.sendCommand( new RGBLEDCommand( 0,255, 0 ) );
//			    pause(1500);
//			    
//			   //yellow - slow spin
//			    r.sendCommand(new SpinLeftCommand(155),0);
//			    r.sendCommand( new RGBLEDCommand( 255, 255, 0 ) );
//			    pause(1500);
//			    
//			    //red - stop spin
//			    r.sendCommand(new SpinLeftCommand(0),0);
//			    r.sendCommand( new RGBLEDCommand( 255, 0, 0 ) );    //turn red
//			    pause(1500);
//			    //r.sendCommand( new RollCommand( 1, 180, true ),0); //stop after 2500
//			    r.resetHeading();
//			    
//			    //blue - roll
//			    r.sendCommand( new RollCommand( 1, 180, false ) );
//			    r.sendCommand( new RGBLEDCommand( 255, 0, 0 ) );    //turn blue
//			    r.sendCommand( new RollCommand( 1, 180, true ),2500); //stop after 2500
//			    MacroObject m =new MacroObject();
//			    //m.addCommand(new MacroCommand());
//			    r.sendCommand(m);
			    
//			    
//			}
//			else{
//			    // Failed to connect to Sphero device due to an error
//			}
//			
//			
//		} catch (InvalidRobotAddressException e) {
//			e.printStackTrace();
//		} catch (RobotBluetoothException e) {
//			e.printStackTrace();
//		}
//		
	}
	
	public void restartConnection(Sphero oldSphero){
		String devID = oldSphero.getId();
		String msg = "Connection to sphero "+devID+" is lost and trying to restart.";
		Logger.getLogger( this.getClass().getName() ).log( Level.WARNING, msg );
		
		boolean connectedSphero = false;
		while(!connectedSphero){
			try {
				directConnect(devID);
				connectedSphero = true;
				_availableSpheroDevices.remove(oldSphero); // Prevent registerapp to run again in directconnect
				
				if(oldSphero.active){ // If it got eventreporting activated
					for (Sphero sphero : _availableSpheroDevices) {
						if(devID.equals(sphero.getId())){
							sphero.activateEvents(oldSphero.events); // Reactivate old events
							break;
						}
					}
				}				
			} catch (Exception e){			
			}
		}
		
	}
	
	private static void pause(int ms){
		try
		{
			Thread.sleep( ms );
		} catch( Exception e )
		{
			// Failure in searching for devices for some reason.
			e.printStackTrace();
		}
	}
}
