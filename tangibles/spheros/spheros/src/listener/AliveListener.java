package listener;

import java.util.logging.Level;
import java.util.logging.Logger;

import driver.Sphero;

import main.SpheroDriver;
import se.nicklasgavelin.sphero.Robot;
import se.nicklasgavelin.sphero.command.CommandMessage;
import se.nicklasgavelin.sphero.response.InformationResponseMessage;
import se.nicklasgavelin.sphero.response.ResponseMessage;

public class AliveListener implements se.nicklasgavelin.sphero.RobotListener {
	private SpheroDriver sd;

	public AliveListener(SpheroDriver sd) {
		this.sd = sd;
	}

	@Override
	public void responseReceived(Robot r, ResponseMessage response,
			CommandMessage dc) {
		Logger.getLogger(this.getClass().getName()).log(Level.INFO,
				"response received: " + dc.getCommand().toString());
	}

	@Override
	public void event(Robot r, EVENT_CODE code) {
		Sphero sphero = (Sphero) r;
		if(code.equals(EVENT_CODE.CONNECTION_CLOSED_UNEXPECTED)){
			sphero.removeListener(this);
			sd.restartConnection(sphero);			
		}
		
	}

	@Override
	public void informationResponseReceived(Robot r,
			InformationResponseMessage response) {
	}

}
