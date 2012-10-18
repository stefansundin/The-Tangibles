import javax.xml.ws.Response;

import orbotix.robot.sensor.AccelerometerData;
import orbotix.robot.sensor.AttitudeData;
import orbotix.robot.sensor.DeviceSensorsData;
import orbotix.robot.sensor.GyroData;

import se.nicklasgavelin.sphero.Robot;
import se.nicklasgavelin.sphero.command.CommandMessage;
import se.nicklasgavelin.sphero.command.SetDataStreamingCommand;
import se.nicklasgavelin.sphero.command.SetDataStreamingCommand.DATA_STREAMING_MASKS;
import se.nicklasgavelin.sphero.response.InformationResponseMessage;
import se.nicklasgavelin.sphero.response.ResponseMessage;
import se.nicklasgavelin.sphero.response.ResponseMessage.ResponseHeader;
import se.nicklasgavelin.sphero.response.information.DataResponse;


public class RobotListener implements se.nicklasgavelin.sphero.RobotListener {
	Point3D acc_sum = new Point3D();
	@Override
	public void responseReceived(Robot r, ResponseMessage response,
			CommandMessage dc) {
		// TODO Auto-generated method stub
		System.out.println("response received: "+dc.getCommand().toString());
		
	}

	@Override
	public void event(Robot r, EVENT_CODE code) {
		// TODO Auto-generated method stub
		System.out.println("EVENT CODE "+code);
		
	}

	@Override
	public void informationResponseReceived(Robot r,
			InformationResponseMessage response) {
		
//		//////////////////ACCELEROMETER
//		DataResponse data = (DataResponse)response;
//		byte[] d = data.getSensorData();
//		int len=d.length;
//		int i=0;
//		
//		System.out.println("");
//		DeviceSensorsData datum = new DeviceSensorsData(DATA_STREAMING_MASKS.ACCELEROMETER.ALL.FILTERED, d);
//		AttitudeData attitude = datum.getAttitudeData();
//        //Show accelerometer data
//        AccelerometerData accel = datum.getAccelerometerData();
//        //if(attitude != null){
//        Point3D acc = new Point3D();
//        acc.x=accel.getFilteredAcceleration().x;
//        acc.y=accel.getFilteredAcceleration().y;
//        acc.z=accel.getFilteredAcceleration().z;
//        System.out.println("Accelerometer: "+acc);
        
        ////////////////GYRO
        DataResponse data = (DataResponse)response;
		byte[] d = data.getSensorData();
		int len=d.length;
		int i=0;
		
		System.out.println("");
		DeviceSensorsData datum = new DeviceSensorsData(DATA_STREAMING_MASKS.GYRO.ALL.FILTERED, d);
		AttitudeData attitude = datum.getAttitudeData();
        //Show accelerometer data
        GyroData gyro = datum.getGyroData();
        //if(attitude != null){
        Point3D p = new Point3D();
        p.x=gyro.getRotationRateFiltered().x;
        p.y=gyro.getRotationRateFiltered().y;
        p.z=gyro.getRotationRateFiltered().z;
        System.out.println("Gyro: "+p);
        
        
        
        
        
        //}
		//System.out.println("payload: "+response.getMessageHeader().getPacketPayload());
		
	}
	class Point3D{
		double x,y,z;
		
		public String toString(){
			return("("+Math.round(x*100)/100+ ","+Math.round(y*100)/100+","+Math.round(z*100)/100+")");
		}
	}

}
