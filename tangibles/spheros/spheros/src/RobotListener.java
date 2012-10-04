import se.nicklasgavelin.sphero.Robot;
import se.nicklasgavelin.sphero.command.CommandMessage;
import se.nicklasgavelin.sphero.response.InformationResponseMessage;
import se.nicklasgavelin.sphero.response.ResponseMessage;


public class RobotListener implements se.nicklasgavelin.sphero.RobotListener {

	@Override
	public void responseReceived(Robot r, ResponseMessage response,
			CommandMessage dc) {
		// TODO Auto-generated method stub
		System.out.println("response received: "+dc.getCommand().toString());
		
	}

	@Override
	public void event(Robot r, EVENT_CODE code) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void informationResponseReceived(Robot r,
			InformationResponseMessage response) {
		//System.out.println("response type:"+response.getInformationResponseType());
		//System.out.println("response type:"+response.getResponseType());
		System.out.println("response:"+response.toString());
	}

}
