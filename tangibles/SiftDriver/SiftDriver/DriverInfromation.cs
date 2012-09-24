using System;
using System.Runtime.Serialization;
using Sifteo;

namespace SiftDriver
{
  //[DataContract]
  public class DriverInformation
  {
    //[DataMember(Name="appId")]
    public string AppMgrId {
      get; private set;
    }
    //[DataMember(Name="type")]
    public string Type{
      get; private set;
    }
    //[DataMember(Name="id")]
    public string Id{
      get; private set;
    }
    //[DataMember(Name="cubeId")]
    public string[] CubesId{
      get; private set;
    }

    public string ProtocolVersion{
      get; private set;
    }
    public DriverInformation (CubeSet set, string appId)
    {
      AppMgrId = appId;
      Cube[] cubes = set.toArray();
      CubesId = new string[cubes.Length];
      int i = 0;
      foreach(Cube c in cubes){
        CubesId[i++] = c.UniqueId;
      }

      //TODO_LATER: get the protocol version from a file!
      Type = "SifteoCubes";
      //TODO_LATER: find a way to create a unique ID (using the mac address for instance?)
      Id = "myUniqueIdThatIsNotARealOneYet";
      ProtocolVersion = "0.3";
    }
  }
}

