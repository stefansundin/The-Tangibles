using Sifteo;
using SiftDriver.Utils;
using SiftDriver.Communication.Protocols;

namespace SiftDriver.Applications
{
	public class DefaultApp : Application
	{
    private AppManager _appMgr;
    //private CubeInstallator _installator;


		public DefaultApp() :
    base("siftdriver.DefaultApp","Default Application using all the free cube for various purpose") {
      //_installator = new CubeInstallator();
    }
		
		public void SetupDefaultApp()
		{
      initAppManager();
      Color deepBlue = new Color (0,36,85);
      //Color deepBlue = new Color (0x002455);
      Color somehowRed = new Color(218, 36, 85);

      CubeSet cubestoInstall = _appMgr.AvailableCubes;
      foreach ( Cube aCube in cubestoInstall.toArray()){
        aCube.FillScreen(deepBlue);
//        aCube.ButtonEvent += delegate(Cube c, bool pressed) {
//          if(pressed){
//            Log.Debug("DefaultApp received an event!");
//            this.AuthenticateSiftDriver();
//            CubeSet stillAvaiableCubes = _appMgr.AvailableCubes;
//            //_installator.Install(stillAvaiableCubes, delegate(Cube justACube){
//            Utils.CubeInstallator.Install(stillAvaiableCubes, delegate(Cube justACube){
//              justACube.ClearEvents();
//              justACube.FillScreen(somehowRed);
//              justACube.Paint();
//            });
//          }
//        };
        aCube.Paint();
      }

      this.AuthenticateSiftDriver();
//      CubeSet stillAvaiableCubes = _appMgr.AvailableCubes;
//      //_installator.Install(stillAvaiableCubes, delegate(Cube justACube){
      Utils.CubeInstallator.Install(cubestoInstall, delegate(Cube justACube){
        justACube.ClearEvents();
        justACube.FillScreen(somehowRed);
        justACube.Paint();
      });
      Cube c = cubestoInstall[0];
      //TextDisplayer.DisplayMessageV3(c, "connected\r\nto the server", new SiftColor(255, 255, 255));
      c.Paint();
		}

    private void AuthenticateSiftDriver(){
      NetworkHandler network = NetworkHandlerAccess.Instance;
      network.Socket.ReceiveTimeout = 5000;
      bool authenticationSuccess = new AuthenticationProtocol(network.Socket).Authenticate();
      Log.Debug("authenticationSuccess? " + authenticationSuccess);
      _appMgr.FinalizedAuthentication();
    }
    private void initAppManager(){
      if(_appMgr == null){
        _appMgr = AppManagerAccess.Instance;
      }
    }
	}
}