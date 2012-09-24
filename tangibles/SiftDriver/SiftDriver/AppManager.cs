using System;
using System.Collections.Generic;
using Sifteo;
using SiftDriver;
using SiftDriver.Applications;
using SiftDriver.Communication.Protocols;

namespace SiftDriver
{
	
  public delegate void Ticking();
  public interface AppManager{
    event Ticking Ticked;
    CubeSet AvailableCubes {
      get;}
    void SetupAppManager(CubeSet cSet, string appID);
    void FinalizedAuthentication();
    DriverInformation DriverInfo {
      get;}
    Cube this[String id]{ get;}
    void TurnOffDriver();
    void Tick();
  }
  public sealed class AppManagerAccess
  {

    private sealed class AppManagerImpl : AppManager
    {
      //TODO_LATER: SortedList<Application>
      private DefaultApp _defaultApp;
      private CubeSet _setOfCube;
      private CubeSet _availableCubes;
      private string _appID;
      //public CubeSet AvailableCubes{ get{return _availableCubes;}}
      public event Ticking Ticked;
      private GeneralCommunicationProtocol _generalComm;
      public Cube this[String id]{
        get{
          Cube c = this._setOfCube.CubeByID(id);
          if(c == null){
            throw new KeyNotFoundException(id);
          }
          return c;
        }
      }
      internal AppManagerImpl ()
      {
        _defaultApp = new DefaultApp ();
        _setOfCube = null;
      }

      public CubeSet AvailableCubes {
        get {
          return _availableCubes;
        }
      }
      public void SetupAppManager (CubeSet cSet, string appID)
      {
        _setOfCube = cSet;
        _availableCubes = cSet;
        _appID = appID;
        _defaultApp.SetupDefaultApp();
        Log.Debug("SetupAppManager() over");
      }
      public void FinalizedAuthentication ()
      {
        //then start to listen for application authentication and request
        //i.e. create a GeneralCommunicationProtocol
        NetworkHandlerAccess.Instance.Socket.ReceiveTimeout = 0;
        _generalComm = new GeneralCommunicationProtocol(NetworkHandlerAccess.Instance.Socket);

      }

      public DriverInformation DriverInfo {
        get {
          return new DriverInformation(_setOfCube, _appID);
        }
      }

      public void TurnOffDriver(){
        throw new Exception("the game is over");
      }
      
      public void Tick ()
			{
				if (Ticked != null) {
					Ticked ();
//					Log.Debug ("AppManager.ticked");
				}
      }
    }

    #region Singleton setup
    private static volatile AppManagerAccess instance;
    private volatile AppManager _appMgr;
    private static object syncRoot = new Object ();

    private AppManagerAccess ()
    {
      _appMgr = new AppManagerImpl ();
    }

    public static AppManager Instance {
      get {
        if (instance == null) {
          lock (syncRoot) {
            if (instance == null)
              instance = new AppManagerAccess ();
          }
        }

        return instance._appMgr;
      }
    }
    #endregion Thread-safe singleton done
  }

}