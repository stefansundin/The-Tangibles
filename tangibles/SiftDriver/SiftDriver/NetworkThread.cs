using System;
using System.Net.Sockets;
using Sifteo;
using SiftDriver;

namespace SiftDriver
{
  public interface NetworkHandler{
    TcpClient Socket {get;}

  }
  public sealed class NetworkHandlerAccess
  {

    private sealed class NetworkHandlerImpl : NetworkHandler
    {
      private TcpClient _sock;

      internal NetworkHandlerImpl ()
      {
        _sock = new TcpClient("localhost", 60000);
        Log.Debug("NetworkHandlerImpl created and socket connected!");
      }

      public TcpClient Socket {
        get {
          return _sock;
        }
      }

    }

    #region Singleton setup
    private static volatile NetworkHandlerAccess instance;
    private volatile NetworkHandler _appMgr;
    private static object syncRoot = new Object ();

    private NetworkHandlerAccess ()
    {
      _appMgr = new NetworkHandlerImpl ();
    }

    public static NetworkHandler Instance {
      get {
        if (instance == null) {
          lock (syncRoot) {
            if (instance == null)
              instance = new NetworkHandlerAccess ();
          }
        }

        return instance._appMgr;
      }
    }
    #endregion Thread-safe singleton done
  }

}