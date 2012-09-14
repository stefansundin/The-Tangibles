package driver;

import se.nicklasgavelin.bluetooth.BluetoothDevice;
import se.nicklasgavelin.sphero.Robot;
import se.nicklasgavelin.sphero.exception.InvalidRobotAddressException;
import se.nicklasgavelin.sphero.exception.RobotBluetoothException;

public class Sphero extends Robot
{
	public Sphero( BluetoothDevice bt ) throws InvalidRobotAddressException, RobotBluetoothException
	{
		super( bt );
	}

	@Override
	public boolean equals( Object s )
	{
		if( s instanceof Sphero )
			return ( (Sphero) s ).getId().equals( getId() );
		else if( s instanceof String )
			return ( (String) s ).equals( getId() );
		return false;
	}
}
