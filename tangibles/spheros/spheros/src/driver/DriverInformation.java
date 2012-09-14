package driver;

import java.util.List;

public class DriverInformation
{
	public String appMgrId;
	public String type;
	public String id;
	public String[] spheroId;
	public String protocolVersion;
	
	public DriverInformation( List<Sphero> set, String appId )
	{
		appMgrId = appId;
		Sphero[] spheros = set.toArray( new Sphero[]{} );
		spheroId = new String[ spheros.length ];
		
		for( int i = 0; i < spheros.length; i++ )
			spheroId[ i ] = spheros[i].getId();
		
		type = "SpheroDevices";
		id = "myUniqueIdThatIsNotARealOneYetSpheroFTW";
		protocolVersion = "0.3";
	}
}
