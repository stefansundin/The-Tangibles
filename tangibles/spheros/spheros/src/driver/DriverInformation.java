package driver;

import java.util.List;

public class DriverInformation
{
	public String appMgrId;
	public String type;
	public String id;
	public String[] devices;
	public String protocolVersion;
	public String[] capacities = {"show_color", "report_events", "spin_right", "spin_left"};
	
	public DriverInformation( List<Sphero> set, String appId )
	{
		appMgrId = appId;
		Sphero[] spheros = set.toArray( new Sphero[]{} );
		devices = new String[ spheros.length ];
		
		for( int i = 0; i < spheros.length; i++ )
			devices[ i ] = spheros[i].getId();
		
		type = "SpheroDevices";
		id = "myUniqueIdThatIsNotARealOneYetSpheroFTW";
		protocolVersion = "0.3";
	}
}
