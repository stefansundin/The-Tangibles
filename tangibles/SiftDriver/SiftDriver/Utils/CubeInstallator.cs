using System;
using Sifteo;

namespace SiftDriver.Utils
{
  public delegate void Installation(Cube c);

  public static class CubeInstallator
  {
    public static void Install(CubeSet cs, Installation installation){
      foreach(Cube c in cs.toArray()){
        installation(c);
      }
    }
  }
}

