using System;
using System.Collections.Generic;

using Sifteo;

namespace SiftDriver.Utils
{
	public class FaderLookup{
		private static Dictionary<string, FaderHelper> _lookup = new Dictionary<string, FaderHelper>();
		public static FaderHelper getFaderHelper (Cube c)
		{
			if (!_lookup.ContainsKey (c.UniqueId)) {
				_lookup [c.UniqueId] = new FaderHelper (c);
			}
			return _lookup[c.UniqueId];
		}
	}
  public class FaderHelper
  {
    private SiftColor _color;
    private SiftColor _currentColor;
    private SiftColor _gap;
    private bool toWhite;
    private double _delta;
    
//    private Cube _c;
    private CubeScreenManager _mgr;
    
//    private Ticking masterTick;
    
    
    public SiftColor Color { 
				set {
					_color = value; 
					_currentColor = _color;
					toWhite = true;
					_gap = SiftColor.WHITE - _color;
	      } 
    }
    
    public FaderHelper (Cube c)
		{
//			Color = SiftColor.WHITE;
//			_c = c;
			_delta = 0.025; //i.e. fade in 40 steps
			_mgr = ScreenManagerLookup.getScreenManager (c);
    }
    
//    public void StartFading (Ticking tickingEvent)
//		{
//			masterTick = tickingEvent;
//			masterTick += Fade;
//    }
//    
//    public void StopFading ()
//		{
//			if(masterTick != null){
//				masterTick -= Fade;
//				masterTick = null;
//			}
//    }
    
    public void Fade ()
		{
			if (toWhite) {
				_currentColor = _currentColor + (_delta * _gap);
				if (_currentColor >= SiftColor.WHITE) {
					Log.Debug ("fading to White completed: let's go back!");
					toWhite = false;
				}
			} else {
				_currentColor = _currentColor - (_delta * _gap);
				if (_currentColor <= _color) {
					Log.Debug ("fading back completed: let's go up 'til white!");
					toWhite = true;
				}
			}
			_mgr.DisplayColor (_currentColor.ToSifteo());
    }
  }
}

