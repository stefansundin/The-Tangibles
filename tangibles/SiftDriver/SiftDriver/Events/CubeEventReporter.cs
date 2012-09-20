using System;
using System.Collections.Generic;
using Sifteo;
using SiftDriver.Communication;

namespace SiftDriver.Events
{
  public class CubeEventReporter
  {
    private static List<CubeEventReporter> Reporters = new List<CubeEventReporter>();
    private JsonTcpCommunication _com;
    private Cube _c;
    public String CubeId{
      get{ return _c.UniqueId;}}

    public CubeEventReporter(JsonTcpCommunication com, Cube c){
      _com = com;
      _c = c;
      Reporters.Add(this);
      ReportAllEvents();
    }

    private void ReportAllEvents ()
    {
      //report all the possible event!

      _c.ButtonEvent += ButtonNotification;
      _c.FlipEvent += FlipNotification;
      _c.NeighborAddEvent += NeighborAddNotification;
      _c.NeighborRemoveEvent += NeighborRemoveNotification;
      _c.ShakeStartedEvent += ShakeStartedNofitication;
      _c.ShakeStoppedEvent += ShackStoppedNotification;
      _c.TiltEvent += TiltNotification;
    }

    private void TiltNotification (Cube c, int x, int y, int z)
    {
      if(!c.IsShaking){
        //same remark than for flipnotification
        Dictionary<String, Object> parameters = new Dictionary<String, Object>();
        String msg = "tilt";
        parameters.Add("x", x);
        parameters.Add("y", y);
        parameters.Add("z", z);
        this.NotifyEvent(msg, c, parameters);
      }
    }

    private void ShackStoppedNotification (Cube c, int duration)
    {
      Dictionary<String, Object> parameters = new Dictionary<String, Object>();
      String msg = "shackingOver";
      parameters.Add("duration", duration);
      this.NotifyEvent(msg, c, parameters);
    }

    private void ShakeStartedNofitication (Cube c)
    {
      String msg = "shackingStarting";
      this.NotifyEvent(msg, c);
    }

    private void NeighborRemoveNotification (Cube c, Cube.Side side, Cube neighbor, Cube.Side neighborSide)
    {
      Dictionary<String, Object> parameters = new Dictionary<String, Object>();
      String msg = "neighborRemoved";
      parameters.Add("neighborId",neighbor.UniqueId);
      parameters.Add("cubeSide", side.ToString());
      parameters.Add("neighborSide" , neighborSide.ToString());
      this.NotifyEvent(msg, c, parameters);
    }

    private void NeighborAddNotification (Cube c, Cube.Side side, Cube neighbor, Cube.Side neighborSide)
    {
      Dictionary<String, Object> parameters = new Dictionary<String, Object>();
      String msg = "neighborAdded";
      parameters.Add("neighborId",neighbor.UniqueId);
      parameters.Add("cubeSide", side.ToString());
      parameters.Add("neighborSide" , neighborSide.ToString());
      this.NotifyEvent(msg, c, parameters);
    }

    private void FlipNotification (Cube c, bool newOrientationIsUp)
    {
      if(!c.IsShaking){//NOTE during the test I noticed that shaking a cube fire randomly some flip event...
        //Thus this test should prevent it
        String msg;
        if(newOrientationIsUp){
          msg = "flipedUp";
        }else{
          msg = "flipDown";
        }
        this.NotifyEvent(msg, c);
      }
    }

    private void ButtonNotification(Cube c , bool isPressed){
      String msg;
      if(isPressed){
        msg = "pressed";
      }else{
        msg = "released";
      }
      this.NotifyEvent(msg, c);
    }

    private void NotifyEvent(String str, Cube c){
      Dictionary<String, Object> msg = new Dictionary<String, Object>();
      msg.Add("event", str);
      msg.Add("devId", c.UniqueId);
      _com.SendEventMessage(msg);
    }
    private void NotifyEvent(String str, Cube c, Dictionary<String, Object> parameters){
      Dictionary<String, Object> msg = new Dictionary<String, Object>();
      msg.Add("event", str);
      msg.Add("devId", c.UniqueId);
      msg.Add("params", parameters);
      _com.SendEventMessage(msg);
    }

    public static bool ExistsReporter(String cubeId){
      foreach(CubeEventReporter r in Reporters){
        if(r.CubeId.Equals(cubeId)){
          return true;
        }
      }
      return false;
    }
  }
}

