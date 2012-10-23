package driver;

import java.util.ArrayList;

import listener.RobotListener;
import se.nicklasgavelin.bluetooth.BluetoothDevice;
import se.nicklasgavelin.sphero.Robot;
import se.nicklasgavelin.sphero.command.SetDataStreamingCommand;
import se.nicklasgavelin.sphero.exception.InvalidRobotAddressException;
import se.nicklasgavelin.sphero.exception.RobotBluetoothException;
import utils.Event;

public class Sphero extends Robot {
	public boolean active = false;
	private ArrayList<Event> events;

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

	public void activateEvents(ArrayList<Event> events) {
		if (!active) {
			this.events = events;
			RobotListener listener = new RobotListener(events, getId());
			addListener(listener);
			activateDataStreaming();
		}
	}
	
	public void activateDataStreaming(){
		if (!active) {
			long mask = 0;
			if(this.events.size() == 0) return;
			
			// TODO figure out how to enable all
			for (Event event : this.events) {
				mask |= event.getMask();
				break;
			}			
			sendCommand(new SetDataStreamingCommand(1, 17, (int) mask, 200));//imomask?10,  acc 17
		}
		active = true;
	}
}
