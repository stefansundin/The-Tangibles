using Sifteo;
using System;
using System.Net.Sockets;

using SiftDriver;

namespace SiftDriver
{
	public class SiftDriver : BaseApp
	{
		private AppManager _appMgr = AppManagerAccess.Instance;

		override public int FrameRate {
			get { return 20; }
		}

		// called during intitialization, before the game has started to run
		override public void Setup ()
		{
			_appMgr.SetupAppManager (this.CubeSet, this.AppID);
		}

		override public void Tick ()
		{
			if (this.IsIdle) {
				_appMgr.Tick ();
			}
		}

		static void Main (string[] args)
		{
			try {
				new SiftDriver ().Run ();
			} catch (Exception ex) {
				Log.Info (ex.Message);
			}
		}
	}
}

