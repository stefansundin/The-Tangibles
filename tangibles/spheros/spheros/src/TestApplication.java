import se.nicklasgavelin.sphero.exception.InvalidRobotAddressException;
import se.nicklasgavelin.sphero.exception.RobotBluetoothException;
import application.DefaultApp;


public class TestApplication extends DefaultApp{

	public TestApplication(String host, int port) {
		super(host, port);
		// TODO Auto-generated constructor stub
	}
	
	public static void main( String[] args ) throws InvalidRobotAddressException, RobotBluetoothException
    {
		String host = "localhost";
		int port = 14;
        TestApplication experimental_Main = new TestApplication(host, port);
        experimental_Main.setupDefaultApp();
    }

}
