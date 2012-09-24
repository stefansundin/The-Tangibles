using Sifteo;
using System;
using System.Net.Sockets;

using SiftDriver;

namespace SiftDriver
{
  public class SiftDriver : BaseApp
  {
		private AppManager _appMgr = AppManagerAccess.Instance;
    //private TcpClient _sock;

    override public int FrameRate
    {
      get { return 20; }
    }

    // called during intitialization, before the game has started to run
    override public void Setup()
    {
      _appMgr.SetupAppManager(this.CubeSet,this.AppID);
      //Create a socket and store it
      Log.Debug("Setup() over");
    }

    override public void Tick ()
		{
			//Log.Debug("Tick()");
			if(this.IsIdle){
				_appMgr.Tick ();
			}
    }

    // development mode only
    // start SiftDriver as an executable and run it, waiting for Siftrunner to connect
    static void Main(string[] args) {
      try{
        new SiftDriver().Run();
      }catch (Exception ex){
        Log.Info(ex.Message);
      }
    }
  }
}

