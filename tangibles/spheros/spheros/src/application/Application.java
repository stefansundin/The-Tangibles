package application;

public class Application
{
	protected String _id;
	protected String _description;
	
	public Application( String id, String description )
	{
		_id = id;
		_description = description;
	}

	public String getApplicationId()
	{
		return _id;
	}
}
