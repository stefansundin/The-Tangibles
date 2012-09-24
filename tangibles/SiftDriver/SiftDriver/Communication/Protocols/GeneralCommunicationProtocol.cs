using System;
using System.Net.Sockets;
using System.Threading;
using System.Collections.Generic;

using SiftDriver.Communication;
using SiftDriver.Events;
using SiftDriver.Utils;

using Sifteo;

using JsonFx.Json;


namespace SiftDriver.Communication.Protocols
{
  public class GeneralCommunicationProtocol: JsonTcpCommunication
  {
    private JsonReaderThread _readerThread;
    private Thread _containingThread;
    private AppManager _appMgr = AppManagerAccess.Instance;
    private event Ticking _onTick;

    public GeneralCommunicationProtocol (TcpClient socket) : base(socket)
		{
			_readerThread = new JsonReaderThread (this);
			_containingThread = new Thread (new ThreadStart (_readerThread.ReadingLoop));
			//then setup the callbacks and run it!
			_readerThread.IncomingMessage += delegate(Dictionary<string,object> msg) {
				if (msg == null) {
					Log.Info ("the comminucation with the API is over or lost, we should do something about it");
					AppManagerAccess.Instance.TurnOffDriver ();
				}
				if (msg.ContainsKey ("flow")
					&& msg ["flow"].GetType ().Equals (typeof(String))
					&& msg.ContainsKey ("msg")
					&& msg ["msg"].GetType ().Equals (typeof(Dictionary<String,Object>))
           ) {
					switch ((string)msg ["flow"]) {
					case "ctrl":
						onCtrlMessage ((Dictionary<string, object>)msg ["msg"]);
						break;
					case "event":
						onEventMessage ((Dictionary<string, object>)msg ["msg"]);
						break;
					default:
						Log.Info ("this message is invalid: <<<" + new JsonWriter ().Write (msg) + ">>>");
						break;
					}
				} else {
					Log.Info ("this message is invalid: <<<" + new JsonWriter ().Write (msg) + ">>>");
				}
			};
			_appMgr.Ticked += delegate() {
//				Log.Debug ("about to call GeneralComPro._onTick()");
				if (_onTick != null) {
					_onTick ();
//					Log.Debug ("called");
				} //else {
//					Log.Debug("not called");
//				}
			};
      _containingThread.Start();
    }

    private void onCtrlMessage(Dictionary<string,object> msg){
      Log.Info("the following message has been received: <<<"+ new JsonWriter().Write(msg)+">>>" );
      try{
        string command = JsonProtocolHelper.AssertTypeInDic<string>(msg, "command");
        switch(command){
        case "reportAllEvents":
          Log.Debug("dealing with the command reportAllEvents");
          String[] devices = JsonProtocolHelper.AssertTypeInDic<String[]>(msg, "params");
          StartAllEventsReporting(devices);
          break;
        default:
          break;
        }
      }catch (Exception ex){
        Log.Error("something was wrong with this control message: <<<"+new JsonWriter().Write(msg)+" >>> \n\tThe exception was: "+ex.Message );
      }
    }

    private void onEventMessage (Dictionary<string,object> msg)
		{
			Log.Info ("the following message has been received: <<<" + new JsonWriter ().Write (msg) + ">>>");
			//this is just a simple ugly draft: it needs to be done in a much better way later! this treatment need to be moved to the folder Command and to be sent to a CommandFactory and then apply from here
			String command = JsonProtocolHelper.AssertTypeInDic<String> (
				msg,
				"command"
			);
			Log.Debug (DateTime.Now.ToLongTimeString () + " >> dealing with the command: " + command);
			Dictionary<string,object> param = JsonProtocolHelper.AssertTypeInDic<Dictionary<String,Object>> (
				msg,
				"params"
			);
			String[] affectedCubes = JsonProtocolHelper.AssertTypeInDic<String[]> (
				param,
				"cubes"
			);
			
			// we need to stop the ticking only for the cube newly affected to something in the recevied command!
			BrowseCubes (delegate(Cube c) {
				FaderHelper fh = FaderLookup.getFaderHelper (c);
				_onTick -= fh.Fade;
			}, affectedCubes );
			
			switch (command) {
			case "show_color":
				this.ShowColor (affectedCubes, param);
				break;
			case "show_json_picture":
				this.ShowJsonPicture (affectedCubes, param);
				break;
			case "show_picture":
				this.ShowPicture (affectedCubes, param);
				break;
			case "show_message":
				this.ShowMessage (affectedCubes, param);
				break;
			case "fade_color":
				this.FadeColor (affectedCubes, param);
				break;
      default:
        break;
      }
    }

    private void StartAllEventsReporting(string[] devices){
      //TODO_LATER: move some of this code somewhere else to make it more readable
      AppManager mgr = AppManagerAccess.Instance;
      foreach(string cubeId in devices){
        try{
          Cube c  = mgr[cubeId];
          if(!CubeEventReporter.ExistsReporter(cubeId)){
            //CubeEventReporter cReporter = 
            new CubeEventReporter(this,c);
          }else{
            Log.Debug("this cube is already being reported");
          }
        } catch (KeyNotFoundException ex){
          Log.Error("the following id doesn't match any cube! --> "+cubeId+"\n\t exception message: "+ex.Message);
        }
      }
    }

    private delegate void OnCube(Cube c);
    private void BrowseCubes(OnCube method, String[] affectedCubes){
      CubeSet cubes = _appMgr.AvailableCubes;
      foreach(Cube c in cubes){
        if (Array.Exists (affectedCubes, delegate(String obj) {
          return obj.Equals (c.UniqueId);
        })){
          //TODO_LATER : remove the found Id of the affectedCubes array to speed up the process
          method(c);
        }
      }
    }

    private void ShowColor (String[] affectedCubes, Dictionary<string, object> param)
		{
			//then read which color is asked
//      Dictionary<string,object> param = JsonProtocolHelper.AssertTypeInDic<Dictionary<String,Object>>(msg, "params");
			//read the consered cubes
			//read the rgb value!
			Dictionary<string, object> colors = JsonProtocolHelper.AssertTypeInDic<Dictionary<String, Object>> (
				param,
				"color"
			);
			Color fillingColor =
        new Color (
          JsonProtocolHelper.AssertTypeInDic<int> (colors, "r"),
          JsonProtocolHelper.AssertTypeInDic<int> (colors, "g"),
          JsonProtocolHelper.AssertTypeInDic<int> (colors, "b")
			);
			BrowseCubes (delegate(Cube c) {
//          c.FillScreen(fillingColor);
//          //TextDisplayer.DisplayMessage(c,"this is a color", new SiftColor(Color.White));
//          c.Paint();
				//the new way of doing this:
				CubeScreenManager mgr = ScreenManagerLookup.getScreenManager (c);
				mgr.DisplayColor (fillingColor);
        }, affectedCubes);
    }
    private void ShowJsonPicture(String[] affectedCubes, Dictionary<string, object> param) {
//      Dictionary<string,object> param = JsonProtocolHelper.AssertTypeInDic<Dictionary<String,Object>> (msg, "params");
      //JsonPicture picture = JsonPicture.createFromDictionary(JsonProtocolHelper.AssertTypeInDic<Dictionary<String, Object>>(param, "picture"));
      object objPicture = JsonProtocolHelper.AssertField(param, "picture");
      JsonPicture picture = new JsonReader().Read<JsonPicture>(new JsonWriter().Write(objPicture));
      BrowseCubes( delegate(Cube c) {
          ImageDisplayer.DisplayPicture(c, picture);
          //Log.Info("the picture is ready to be displayed on the cube!");
          Log.Debug (DateTime.Now.ToLongTimeString()+" before c.paint()");
          c.Paint ();
          Log.Debug (DateTime.Now.ToLongTimeString()+" after c.paint()");
        }, affectedCubes);

    }
    private void ShowPicture (String[] affectedCubes, Dictionary<string, object> param)
		{
			int[] pixels_str = JsonProtocolHelper.AssertTypeInDic<int[]> (
				param,
				"picture"
			);
			byte[] pixels_bytes = new byte[pixels_str.Length];
			for (int i = 0; i < pixels_str.Length; i++) {
//				pixels_bytes [i] = Byte.Parse (pixels_str [i]);
				pixels_bytes [i] = (byte)pixels_str [i];
			}
			BrowseCubes (delegate(Cube c) {
				CubeScreenManager mgr = ScreenManagerLookup.getScreenManager (c);
				mgr.DisplayPicture (pixels_bytes);
			}, affectedCubes);
    }
    private void ShowMessage (String[] affectedCubes, Dictionary<string, object> param)
		{
			String text_msg = JsonProtocolHelper.AssertTypeInDic<String> (
				param,
				"text_msg"
			);
			Dictionary<string, object> colors = JsonProtocolHelper.AssertTypeInDic<Dictionary<String, Object>>(param, "color");
      SiftColor textColor = new SiftColor(colors);
//			SiftColor textColor = new SiftColor (255, 255, 255);
//      Color textColor =
//        new Color(
//          JsonProtocolHelper.AssertTypeInDic<int>(colors,"r"),
//          JsonProtocolHelper.AssertTypeInDic<int>(colors,"g"),
//          JsonProtocolHelper.AssertTypeInDic<int>(colors,"b")
//          );
			BrowseCubes (delegate(Cube c) {
				CubeScreenManager mgr = ScreenManagerLookup.getScreenManager (c);
				mgr.WriteText (text_msg, textColor.ToSifteo());
			}, affectedCubes);
    }

		private void FadeColor (String[] affectedCubes, Dictionary<string, object> param)
		{
			Dictionary<string, object> colors = JsonProtocolHelper.AssertTypeInDic<Dictionary<String, Object>> (
				param,
				"color"
			);
			SiftColor fadingColor =
        new SiftColor (
          JsonProtocolHelper.AssertTypeInDic<int> (colors, "r"),
          JsonProtocolHelper.AssertTypeInDic<int> (colors, "g"),
          JsonProtocolHelper.AssertTypeInDic<int> (colors, "b")
			);
			BrowseCubes (delegate(Cube c) {
				FaderHelper fh = FaderLookup.getFaderHelper (c);
				fh.Color = fadingColor;
				//startFading: 
				_onTick += fh.Fade;
			}, affectedCubes );
		}

    private class JsonReaderThread {
      private volatile bool _running = true;
      private JsonTcpCommunication _communication;
      public delegate void IncomingMessageHandler(Dictionary<string,object> msg);

      public event IncomingMessageHandler IncomingMessage;

      public JsonReaderThread(JsonTcpCommunication comm){
        _communication = comm;

      }

      public void ReadingLoop(){
        Log.Debug("Reading loop starting!");

        if(_communication == null){
          return;
        }//else

        while(_running){
          //Log.Debug("reading a dictionary ... ");
          Dictionary<string, object> msg = _communication.Read();
          IncomingMessage(msg);//notify it!
        }
      }
    }
  }
}

