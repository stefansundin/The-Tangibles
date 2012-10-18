import se.nicklasgavelin.sphero.exception.InvalidRobotAddressException;
import se.nicklasgavelin.sphero.exception.RobotBluetoothException;
import application.DefaultApp;


public class TestApplication extends DefaultApp{

	public TestApplication(String host, int port) {
		super(host, port);
	}
	
	public static void main( String[] args ) throws InvalidRobotAddressException, RobotBluetoothException
    {
		
		//SpheroDriver spheroD = new SpheroDriver();
		new Thread(new SpheroDriver(),"driver").start();
		try {
			Thread.sleep(6000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//String host = "localhost";
		String host = "0.0.0.0";
		//int port = 9998;
		int port = 60000;
		TestApplication thisApp = new TestApplication(host, port);
        thisApp.setupDefaultApp();
    }

}
