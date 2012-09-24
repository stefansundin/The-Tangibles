using System;
using System.Net.Sockets;
using System.IO;
using System.Collections.Generic;
using Sifteo;
using SiftDriver.Communication;

namespace SiftDriver.Communication.Protocols
{
  public class AuthenticationProtocol : JsonTcpCommunication
  {
    public AuthenticationProtocol (TcpClient socket) : base(socket)
    {
    }

    public bool Authenticate(){
      DriverInformation info = AppManagerAccess.Instance.DriverInfo;
      this.SendCtrlMessage(info);
      Log.Debug("infomartion message sent, waiting for an answer");
      //then wait for an answer and return
      Dictionary<string,object> returned = this.Read();
      //let's check the content of this message:
      //just some retoric tests:
      if(!returned.ContainsKey("flow") || !returned["flow"].Equals("ctrl"))
      {
        string returnedStr = "";
        foreach(string key in returned.Keys){
          returnedStr += key+" = "+returned[key]+" ; ";
        }
        throw new MissingFieldException("returned",returnedStr);
      }//else

      if(!returned.ContainsKey("msg") || !returned["msg"].GetType().Equals(typeof(Dictionary<String,Object>))){
        throw new InvalidCastException ("cannot cast msg into a dictionnary<string,object>");
      }
      Dictionary<string,object> msg = (Dictionary<string, object>) returned["msg"];
      if(!msg.ContainsKey("success") || !msg["success"].GetType().Equals(typeof(bool)) || !msg.ContainsKey("msg")){
        string returnedStr = "";
        foreach(string key in msg.Keys){
          returnedStr += key+" = "+msg[key]+" ; ";
        }
        throw new MissingFieldException("msg",returnedStr);
      }
      return (Boolean) msg["success"];
    }
  }
}

