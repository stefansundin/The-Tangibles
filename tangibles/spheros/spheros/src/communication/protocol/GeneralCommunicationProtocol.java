package communication.protocol;

import java.awt.Color;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import listener.RobotListener;

import se.nicklasgavelin.sphero.DriveAlgorithm;
import se.nicklasgavelin.sphero.command.CalibrateCommand;
import se.nicklasgavelin.sphero.command.FrontLEDCommand;
import se.nicklasgavelin.sphero.command.RGBLEDCommand;
import se.nicklasgavelin.sphero.command.RawMotorCommand;
import se.nicklasgavelin.sphero.command.RollCommand;
import se.nicklasgavelin.sphero.command.SetDataStreamingCommand;
import se.nicklasgavelin.sphero.command.SpinLeftCommand;
import se.nicklasgavelin.sphero.command.SpinRightCommand;
import se.nicklasgavelin.sphero.command.SetDataStreamingCommand.DATA_STREAMING_MASKS;
import se.nicklasgavelin.sphero.exception.InvalidRobotAddressException;
import se.nicklasgavelin.sphero.exception.RobotBluetoothException;
import se.nicklasgavelin.sphero.macro.MacroObject;
import se.nicklasgavelin.sphero.macro.command.RGB;
import se.nicklasgavelin.sphero.macro.command.RawMotor;
import se.nicklasgavelin.sphero.macro.command.Roll;
import utils.Event;
import utils.Point3D;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonStreamParser;

import communication.JsonTcpCommunication;
import communication.protocol.messages.ColorCommandParameters;
import communication.protocol.messages.CommandMessage;
import communication.protocol.messages.CommandMessage.Command;
import communication.protocol.messages.ParamsDevices;
import driver.AppManagerImpl;
import driver.Sphero;
import experimental.sphero.macro.Rotate;

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
	
	public void sendEventMessage(String eventName, String devId, Point3D p){
		JsonObject params = new JsonObject();
		params.addProperty("x", p.x);
		params.addProperty("y", p.y);
		params.addProperty("z", p.z);
		
		JsonObject jsonObj = new JsonObject();
		jsonObj.addProperty("event", eventName);		
		jsonObj.addProperty("devId", devId);
		jsonObj.add("params",params);
		
		JsonObject complete = new JsonObject();
		complete.addProperty("flow", "event");
		complete.add("msg",jsonObj);
		
		// Best would be to use JsonTcpCommunication.sendEventMessage(obj)
		// but since it gson.toJsonTree(msg) for me add members it is done this way.
		try {
			sendString(complete.toString());
		} catch (IOException e) {
			e.printStackTrace();
		} 
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
			List<Sphero> devices = AppManagerImpl.getInstance().availableSpheros();
			System.out.println("Avaliable spheros: "+devices);
			
			
			info( "The following message was received << " + msg + " >>..?" );
			CommandMessage cmdMsg = _gson.fromJson( msg, CommandMessage.class );
			System.out.println("command: "+cmdMsg.msg.command);
			ColorCommandParameters params = _gson.fromJson( cmdMsg.msg.params, ColorCommandParameters.class );
			
			if( cmdMsg.msg.command.equals( "show_color" ) )
			{
				System.out.println("command match!");
				
				System.out.println(cmdMsg.msg.params);
				System.out.println("color r: "+params.color.r);
				System.out.println("list of devices: "+params.devices);

				Color to = new Color( params.color.r, params.color.g, params.color.b );
				
//				for( String sphero : params.devices )
//				{
				System.out.println("local sphero name: "+devices.get(0));
				System.out.println("called sphero: "+params.devices[0]);	
				System.out.println("about to set color...");
				for( final Sphero device : devices )
					//if( device.getId().equals( sphero ) ){
					if( device.getId().equals(params.devices[0]) ){
					    System.out.println("color changed.");
						device.setRGBLedColor( to );
					}
					
//				}
			}
			else if( cmdMsg.msg.command.equals( "spin_right" ) ) { // Calibrate-command
				for( final Sphero device : devices )
					if( device.getId().equals(params.devices[0]) ){
//						device.sendCommand(new SpinRightCommand(155),0);
//						device.sendCommand(new SpinRightCommand(0),5000);
					    device.calibrate(MIN_PRIORITY);
					    device.sendCommand( new RGBLEDCommand( 0, 255, 0 ), 2500 );
					    
					}
			}
			else if( cmdMsg.msg.command.equals( "spin_left" ) ) {
				for( final Sphero device : devices )
					if( device.getId().equals(params.devices[0]) ){
						
						//////try1 - fastnar
//						device.sendCommand(new SpinLeftCommand(155),0);
//						device.sendCommand(new SpinLeftCommand(0),5000);
						
						//////try2 - fastnar
					    //1.0 leftPower:255 rightMode:1.0 rightPower:0
					    //device.stabilization(false);
					    //device.sendCommand(new RawMotorCommand(RawMotorCommand.MOTOR_MODE.valueOf(1), 255, RawMotorCommand.MOTOR_MODE.valueOf(1), 0));

						//////try3 - fastnar inte, dock inte en snurrning
//					    device.sendCommand( new RGBLEDCommand( 0, 255, 0 ), 0 ); //turn green
//					    device.sendCommand( new RollCommand( 1, 20, false ), 0 );
//					    device.sendCommand( new RGBLEDCommand( 255, 255, 255 ), 400 ); //turn white after 400
//					    device.sendCommand( new RollCommand( 1, 0, true ), 2500); //stop after 2500
					    
						
					    /////try4 - macro - spinner ibland! (och åker framåt ibland...)
					    MacroObject o = new MacroObject();
					    //o.addCommand(new Roll(speed, heading, delay));
					    o.addCommand(new RGB(255, 255, 255, 0));

					    device.stopMacro();
					    for(int i=0, turns=3, delay=Roll.MAX_DELAY/3, speedDivisor = 5; i<turns ; i++){
					    	o.addCommand(new Roll(Roll.MAX_SPEED/speedDivisor, Roll.MIN_HEADING , delay));
						    o.addCommand(new Roll(Roll.MAX_SPEED/speedDivisor, Roll.MAX_HEADING/4 ,delay));
						    o.addCommand(new Roll(Roll.MAX_SPEED/speedDivisor, Roll.MAX_HEADING/2 ,delay));
						    o.addCommand(new Roll(Roll.MAX_SPEED/speedDivisor, (int)(Roll.MAX_HEADING*0.75) ,delay));
						    //o.addCommand(new RGB((255/turns)*i, 255/i, (255/turns)*i, 0));
					    }
					    o.addCommand(new Roll(Roll.MIN_SPEED, (int)(Roll.MAX_HEADING*0.75) ,Roll.MAX_DELAY));
					    
					    device.sendCommand(o);
					    //device.sendCommand( new RGBLEDCommand( 0, 255, 0 ), 0 ); //turn green
//					    pause(5000);
//					    device.sendCommand( new RGBLEDCommand( 255,0, 0 ), 0 ); //turn red
//					    device.stopMotors();
					    
					    
					    
					    
					    
//					    device.stabilization(true);
//					    device.sendCommand(new RollCommand( 0, 0, true ),0);
					    //device.sendCommand(new orbotix.robot.base.RawMotorCommand(leftMode, leftSpeed, rightMode, rightSpeed), leftSpeed, rightMode, rightSpeed);
					    //orbotix.robot.base.StabilizationCommand c = new orbotix.robot.base.StabilizationCommand(true);
					    //device.sendCommand(c);
//						MacroObject o = new MacroObject();
//						o.addCommand(new RawMotor(MOTOR_MODE.FORWARD, RawMotor.MAX_SPEED/4, MOTOR_MODE.REVERSE, RawMotor.MAX_SPEED/4, RawMotor.MIN_DELAY));
//						device.sendCommand(o);
//						try {
//							Thread.sleep(6000);
//						} catch (InterruptedException e) {
//							// TODO Auto-generated catch block
//							e.printStackTrace();
//						}
//						device.stopMotors();
//						device.stabilization(true);
//						device.stopMacro();
					}
			}
		}

		private void handleCtrlMessage( JsonElement msg )
		{
			info( "Received ctrl message: " + msg );
			
			
			List<Sphero> devices = AppManagerImpl.getInstance().availableSpheros();			
			
			info( "The following message was received << " + msg + " >>..?" );
			CommandMessage cmdMsg = _gson.fromJson( msg, CommandMessage.class );
			
			if( cmdMsg.msg.command.equals( "report_all_events" )){
			
				ParamsDevices paramsD = _gson.fromJson( cmdMsg.msg.params, ParamsDevices.class );
				
				for (String devID : paramsD.devices) {
					// TODO return error message when devID is not found
					for (Sphero sphero : devices) {
						if(sphero.getId().equals(devID)){
							System.out.println("Found your device");
							
							
							ArrayList<Event> events = new ArrayList<Event>();
							//events.add(utils.Event.GYROATTITUDE);
							events.add(utils.Event.ACCELEROMETER);
							
							sphero.activateEvents(events);														
						}
					}
				}
			}
		}
	}

	private void info( String msg )
	{
		Logger.getLogger( this.getClass().getCanonicalName() ).log( Level.INFO, msg );
	}
	
	private void pause(int ms){
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
