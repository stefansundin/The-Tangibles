package listener;

import java.util.logging.Level;
import java.util.logging.Logger;

import se.nicklasgavelin.sphero.Robot;
import se.nicklasgavelin.sphero.command.CommandMessage;
import se.nicklasgavelin.sphero.response.InformationResponseMessage;
import se.nicklasgavelin.sphero.response.ResponseMessage;
import se.nicklasgavelin.sphero.response.information.DataResponse;
import utils.Event;
import utils.Point3D;
import driver.AppManagerImpl;

public class RobotListener implements se.nicklasgavelin.sphero.RobotListener {
	private Event[] events;
	private String devId;

	public RobotListener(Event[] events, String devId) {
		this.events = events;
		this.devId = devId;
	}

	@Override
	public void responseReceived(Robot r, ResponseMessage response,
			CommandMessage dc) {
		System.out.println("response received: " + dc.getCommand().toString());

	}

	@Override
	public void event(Robot r, EVENT_CODE code) {
		System.out.println("EVENT CODE " + code);
	}

	@Override
	public void informationResponseReceived(Robot r,
			InformationResponseMessage response) {

		DataResponse dataResponse = (DataResponse) response;
		byte[] data = dataResponse.getSensorData();

		for (Event event : events) {
			Point3D p = event.read(data);

			Logger.getLogger(RobotListener.class.getName()).log(Level.INFO,
					event.toString() + ": " + p);

			AppManagerImpl.getInstance().getGeneralComm()
					.sendEventMessage(event.toString(), devId, p);
		}
	}

}
