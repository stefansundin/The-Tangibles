package driver;

import listener.RobotListener;
import se.nicklasgavelin.bluetooth.BluetoothDevice;
import se.nicklasgavelin.sphero.Robot;
import se.nicklasgavelin.sphero.command.SetDataStreamingCommand;
import se.nicklasgavelin.sphero.command.SetDataStreamingCommand.DATA_STREAMING_MASKS;
import se.nicklasgavelin.sphero.exception.InvalidRobotAddressException;
import se.nicklasgavelin.sphero.exception.RobotBluetoothException;
import utils.Event;

public class Sphero extends Robot {
	public boolean active = false;

	public Sphero(BluetoothDevice bt) throws InvalidRobotAddressException,
			RobotBluetoothException {
		super(bt);
	}

	@Override
	public boolean equals(Object s) {
		if (s instanceof Sphero)
			return ((Sphero) s).getId().equals(getId());
		else if (s instanceof String)
			return ((String) s).equals(getId());
		return false;
	}

	public void activateEvents(Event[] events) {
		if (!active) {
			RobotListener listener = new RobotListener(events, getId());
			addListener(listener);
			activateDataStreaming();
		}
	}
	
	public void activateDataStreaming(){
		if (!active) {
			int accMask = DATA_STREAMING_MASKS.ACCELEROMETER.ALL.FILTERED;
			int gyroMask = DATA_STREAMING_MASKS.GYRO.ALL.FILTERED;
			int imoMask = DATA_STREAMING_MASKS.IMU.ALL.FILTERED;
			
			sendCommand(new SetDataStreamingCommand(1, 17, imoMask, 200));//imomask?10,  acc 17
		}
		active = true;
	}
}
