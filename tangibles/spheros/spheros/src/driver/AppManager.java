package driver;

import java.util.List;

public abstract class AppManager
{
	protected DriverInformation driverInfo;
	protected List<Sphero> _setOfSphero;
	protected List<Sphero> _availableSpheros;

	public abstract void setupAppManager( List<Sphero> spheroSet, String appID );
	public abstract void turnOffDriver();
	public abstract void finalizeAuthentication();

	public List<Sphero> getAvailableSpheros()
	{
		return _availableSpheros;
	}
	
	public List<Sphero> getSpheros()
	{
		return _setOfSphero;
	}
}