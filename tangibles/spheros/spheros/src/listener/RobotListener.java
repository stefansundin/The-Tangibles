package listener;

import java.io.IOException;

import javax.xml.ws.Response;

import communication.protocol.GeneralCommunicationProtocol;
import driver.AppManagerImpl;

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
import utils.Point3D;


public class RobotListener implements se.nicklasgavelin.sphero.RobotListener {
	String[] lisentypes;
	private String devId;
	public RobotListener(String[] lisentypes, String devId){this.lisentypes = lisentypes;this.devId=devId;}
	
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

		for (String type : lisentypes) {		
			if(type == "gyro"){			
				DeviceSensorsData datum = new DeviceSensorsData(DATA_STREAMING_MASKS.GYRO.ALL.FILTERED, d);
	
		        //Show gyro data
		        GyroData gyro = datum.getGyroData();
	
		        Point3D p = new Point3D();
		        p.x = gyro.getRotationRateFiltered().x;
		        p.y = gyro.getRotationRateFiltered().y;
		        p.z = gyro.getRotationRateFiltered().z;
		        System.out.println("Gyro: "+p);
		        try {
		        	AppManagerImpl.getInstance().getGeneralComm().sendEventMessage(type, devId, p);
				} catch (IOException e) {
					e.printStackTrace();
				}	        
			} else if (type == "acc") {		
				DeviceSensorsData datum = new DeviceSensorsData(DATA_STREAMING_MASKS.ACCELEROMETER.ALL.FILTERED, d);
	
		        //Show accelerometer data
				AccelerometerData acc = datum.getAccelerometerData();
		        Point3D p = new Point3D();
		        p.x = acc.getFilteredAcceleration().x;
		        p.y = acc.getFilteredAcceleration().y;
		        p.z = acc.getFilteredAcceleration().z;
		        System.out.println("acc: "+p);
		        try {
		        	AppManagerImpl.getInstance().getGeneralComm().sendEventMessage(type, devId, p);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

}
