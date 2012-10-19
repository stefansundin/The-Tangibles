package utils;

import orbotix.robot.sensor.AccelerometerData;
import orbotix.robot.sensor.DeviceSensorsData;
import orbotix.robot.sensor.GyroData;
import se.nicklasgavelin.sphero.command.SetDataStreamingCommand.DATA_STREAMING_MASKS;

public enum Event implements ReadData {	
	GYRO {
	    public String toString() {
	        return "Gyro";
	    }
	    public Point3D read(byte[] data){
	    	DeviceSensorsData datum = new DeviceSensorsData(
					DATA_STREAMING_MASKS.GYRO.ALL.FILTERED, data);

			GyroData gyro = datum.getGyroData();
			Point3D p = new Point3D();

			p.x = gyro.getRotationRateFiltered().x;
			p.y = gyro.getRotationRateFiltered().y;
			p.z = gyro.getRotationRateFiltered().z;
			
			return p;
	    }
	},
	
	ACCELEROMETER {
	    public String toString() {
	        return "Accelerometer";
	    }
	    public Point3D read(byte[] data){
			DeviceSensorsData datum = new DeviceSensorsData(
					DATA_STREAMING_MASKS.ACCELEROMETER.ALL.FILTERED, data);

			AccelerometerData acc = datum.getAccelerometerData();
			Point3D p = new Point3D();
			
			p.x = acc.getFilteredAcceleration().x;
			p.y = acc.getFilteredAcceleration().y;
			p.z = acc.getFilteredAcceleration().z;
			
			return p;	    	
	    }
	};	
}
