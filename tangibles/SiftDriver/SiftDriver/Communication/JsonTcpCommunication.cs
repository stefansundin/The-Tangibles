using System;
using System.Net.Sockets;
using System.Collections.Generic;
using System.Runtime.Serialization;

using Sifteo;

using JsonFx.Json;
using JsonFx.Serialization;
using JsonFx.Serialization.Resolvers;
using JsonFx.Json.Resolvers;
using JsonFx.Model;


namespace SiftDriver.Communication
{
//  [DataContract]
//  internal class JsonMessage{
//    [DataMember(Name="flow")] public string Flow {get; set;}
//    [DataMember(Name="msg")] public object Message {get; set; }
//  }

	public class JsonTcpCommunication : AbsTcpCommunication
	{
    private JsonWriter _jsonOut;
    private JsonReader _jsonIn;
    //public JsonWriter JsonOut { get { return _jsonOut; } }
    //public JsonReader JsonIn { get {return _jsonIn;} }


		public JsonTcpCommunication (TcpClient socket) : base(socket)
		{
      JsonResolverStrategy resolver = new JsonResolverStrategy();
      _jsonIn = new JsonReader(new DataReaderSettings(resolver));
      _jsonOut = new JsonWriter(new DataWriterSettings(new ConventionResolverStrategy(ConventionResolverStrategy.WordCasing.CamelCase)));
		}

    public void SendCtrlMessage(object obj){
      this.SendMsg(obj, false);
    }
    public void SendEventMessage(object obj){
      this.SendMsg(obj, true);
    }

    private void SendMsg(object obj, bool isEvent){
      Dictionary<string, object> jsonMsg = new Dictionary<string, object>(2);
      if(isEvent){
        jsonMsg["flow"] = "event";
      }else{
        jsonMsg["flow"] = "ctrl";
      }
      jsonMsg["msg"] = obj;

      _jsonOut.Write(jsonMsg, this.Output);
      //Log.Info("sending: --> \n\t"+_jsonOut.Write(jsonMsg));
      this.Output.Flush();
    }

    public Dictionary<string,object> Read(){
      return _jsonIn.Read<Dictionary<string,object>>(this.Input);
    }

    //TODO_LATER make that less ugly ... and use the readMany feature or allow it at least... 
	}
}

