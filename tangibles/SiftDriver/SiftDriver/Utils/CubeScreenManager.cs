using Cairo;
using Pango;

using Sifteo;

using System;
using System.Collections.Generic;

using SiftDriver.Utils;

namespace SiftDriver.Utils
{
  public static class ScreenManagerLookup
  {
    public static Dictionary<string, CubeScreenManager> managers;
    public static CubeScreenManager getScreenManager (Cube c)
		{
			if (managers == null) {
				managers = new Dictionary<string, CubeScreenManager> ();
				CubeScreenManager mgr = new CubeScreenManager (c);
				managers.Add (c.UniqueId, mgr);
				return mgr;
			} else if (managers.ContainsKey (c.UniqueId)) {
				return managers [c.UniqueId];
			} else {
				CubeScreenManager mgr = new CubeScreenManager (c);
				managers.Add (c.UniqueId, mgr);
				return mgr;
			}
    }
  }
  
  public static class ArrayHelper 
  {
  
    public static void FillWith<T>( this T[,] array, T value)
	  {
	    for (int y = 0; y < array.GetUpperBound(0); y ++) {
				for (int x = 0; x < array.GetUpperBound(1); x ++) {
					array [y, x] = value;
				}
			}
	  }
  }
  
  public class CubeScreenManager
  {
    private Cube _c;
    private bool _isBgPicture;
    private Sifteo.Color _bgColor;
    private Sifteo.Color[,] _last_data;
    private Sifteo.Color[,] _bgPicture;
    
    public CubeScreenManager (Cube c)
		{
			_c = c;
			_isBgPicture = false;
			_bgColor = Sifteo.Color.White;
			_last_data = new Sifteo.Color[Cube.SCREEN_HEIGHT, Cube.SCREEN_WIDTH];
//			for (int y = 0; y < _last_data.GetUpperBound(0); y ++) {
//				for (int x = 0; x < _last_data.GetUpperBound(1); x ++) {
//					_last_data [y, x] = Sifteo.Color.White;
//				}
//			}
			_bgPicture = new Sifteo.Color[Cube.SCREEN_HEIGHT, Cube.SCREEN_WIDTH];
//			for (int y = 0; y < _bgPicture.GetUpperBound(0); y ++) {
//				for (int x = 0; x < _bgPicture.GetUpperBound(1); x ++) {
//					_bgPicture [y, x] = Sifteo.Color.White;
//				}
//			}
			DisplayColor (Sifteo.Color.White);
    }
    
    public void WriteText (string txt, Sifteo.Color color)
		{
			Sifteo.Color[,] pixels;
			if (_isBgPicture) {
				pixels = (Sifteo.Color[,]) _bgPicture.Clone ();
			} else {
				pixels = new Sifteo.Color[Cube.SCREEN_HEIGHT, Cube.SCREEN_WIDTH];
				pixels.FillWith (_bgColor);
			}
			
			ImageSurface sr = new ImageSurface (Format.ARGB32, 128, 128);
			Cairo.Context context = new Cairo.Context (sr);
			Pango.Layout pango = Pango.CairoHelper.CreateLayout (context);

			pango.FontDescription = Pango.FontDescription.FromString ("Arial 16");
			pango.Alignment = Alignment.Center;
			pango.Wrap = WrapMode.WordChar;
			pango.Width = 128 * 1016;
			pango.SetText (txt);

			context.Color = new SiftColor (color).ToCairo ();
			int pWidth = 0, pHeight = 0;
			pango.GetPixelSize (out pWidth, out pHeight);
			Log.Debug ("pango Pixel size: " + pWidth + "x" + pHeight);

			context.MoveTo (0, 64 - (pHeight / 2));
			CairoHelper.ShowLayout (context, pango);
			sr.Flush ();
			byte[] data = sr.Data;
			for (int i = 0, x = 0, y = 0; i < data.Length; i+= 4, x++) {
				if (x >= 128) {
					x = 0;
					y ++;
				}
				byte b = data [i],
				g = data [i + 1],
				r = data [i + 2],
				a = data [i + 3];
				if (a != 0) {
					SiftColor sc = new SiftColor (r, g, b);
					//Log.Debug("sc = "+r+"|"+g+"|"+b+" for the point "+x+";"+y);
					pixels [y, x] = sc.ToSifteo ();
				} else {
					// we ignore it
				}
			}
			((IDisposable)context).Dispose ();
			((IDisposable)pango).Dispose ();
			((IDisposable)sr).Dispose ();
			paintPixels (pixels, false);
    }
    
    public void DisplayColor (Sifteo.Color c)
		{
			// just fill the damn scree with the color
			_isBgPicture = false;
			_bgColor = c;
			_c.FillScreen (c);
			_last_data.FillWith<Sifteo.Color> (c);
			_c.Paint ();
    }
    
    public void DisplayPicture (byte[] data)
		{
			//display the picture
			Sifteo.Color[,] pixels = new Sifteo.Color[Cube.SCREEN_HEIGHT, Cube.SCREEN_WIDTH];
      
			for (int idx = 0, x = 0, y = 0; idx < data.Length; idx += 4, x ++) {
				if (x >= 128) {
					x = 0;
					y ++;
				}
				byte //a = data [idx],
				b = data [idx + 1],
				g = data [idx + 2],
				r = data [idx + 3];
				//if (a != 0 || r != 0 || g != 0 || b != 0) {
					Sifteo.Color c = new Sifteo.Color (r, g, b);
					pixels [y, x] = c;
				//} else {
				//	//we ignore it
				//	pixels [y, x] = Sifteo.Color.White;
				//}
			}
      
			// we now have our pixel array: let's print it!
			bool withHistogram = (_isBgPicture) ? false : true;
			paintPixels (pixels, withHistogram);
			_isBgPicture = true;
			_bgPicture = pixels;
    }
    
    private Dictionary<byte, int> buildHistogram (Sifteo.Color[,] pixels)
		{
			Dictionary<byte, int> histo = new Dictionary<byte, int> ();
			
			for (int y = 0; y < pixels.GetUpperBound(0); y ++) {
				for (int x = 0; x < pixels.GetUpperBound(1); x ++) {
					if (histo.ContainsKey (pixels [y, x].Data)) {
						histo [pixels [y, x].Data]++;
					} else {
						histo.Add (pixels [y, x].Data, 1);
					}
				}
			}
			
			return histo;
    }
    private byte getMostFrequentColor (Dictionary<byte, int> histo)
		{
			int count = 0;
			byte color = 0;
			foreach (KeyValuePair<byte, int> pair in histo) {
				if (pair.Value > count) {
					color = pair.Key;
					count = pair.Value;
				}
//				if (pair.Key == Sifteo.Color.White.Data){
//					Log.Debug(" there are "+pair.Value+" pixels in White" );
//					}
			}
//			Log.Debug ("most frequent is: " + color + " with " + count + " pixels");
//			Log.Debug ("for information White is: " + Sifteo.Color.White.Data);
			return color;
    }
    
    private void paintPixels (Sifteo.Color[,] pixels, bool withHistogram)
		{
			byte dontPaintColor = 0;
			bool withActiveHistogram = false;
			if (withHistogram) {
				Dictionary<byte, int> histogram = buildHistogram (pixels);
				dontPaintColor = getMostFrequentColor (histogram);
				//having a nice histogram is cool but we should avoid to redraw a white square if it was already white...
				if (_isBgPicture) {
					//then let´s repaint (anyway this case is not supposed to happen at any case
					withActiveHistogram = true;
				} else {
					withActiveHistogram = (dontPaintColor != _bgColor.Data);
					//i.e. paint the whole cube with the most frequent color if it´s not the previously used color
				}
				
				if (withActiveHistogram) {
					_c.FillScreen (new Sifteo.Color (dontPaintColor));
				}
			}
		
			//print the colors and call paint on the cube!
			
			/* The idea is to "stack" pixels and to check with the previous data 
			 * to send less fill rect commands.
			 * Stacking is of higher priority than avoid to resend a similar pixel color
			 * i.e. if unchanged pixels are within a bigger block of a single color: 
			 *  they will be send again (in only one fillrect instruction)
			 */
			
			int start_x = -1;
			bool stacking = false;
			Sifteo.Color currentColor = Sifteo.Color.Black;
			for (int y = 0; y < pixels.GetUpperBound(0); y ++) {
				for (int x = 0; x < pixels.GetUpperBound(1); x++) {
					if (stacking) {
						if (!pixels [y, x].Equals (currentColor)) {
							//print the current stacking
							_c.FillRect (currentColor, start_x, y, x - start_x, 1);
							stacking = false;
							//and look if we start stacking again
							if (!pixels [y, x].Equals (_last_data [y, x])) {
								if (!withActiveHistogram || pixels [y, x].Data != dontPaintColor) {
									stacking = true;
									currentColor = pixels [y, x];
									start_x = x;
								} // else { //we ignore it it´s already gonna be painted in the good color
							}// else {
//								we just skip this pixel and don't do anything about it.
//							}
						} // else {
//						  let's go on staking!
//						}
					} else {//not stacking
						if (!pixels [y, x].Equals (_last_data [y, x])) {
							if (!withActiveHistogram || pixels [y, x].Data != dontPaintColor) {
								//start stacking!
								stacking = true;
								currentColor = pixels [y, x];
								start_x = x;
							} // else see the previous activehistogram filtering
						}// else {
//							we just skip this pixel and don't do anything about it.
//						}
					}//end of the stacking check
					
					//in any case for each pixel:
					//_last_data [y, x] = pixels [y, x]; //although theoretically we don't need to do that all the time, it's not costing much to do it and it will avoid stupid bugs ...
				}
				//at the end of each line make sure to stop stacking and to flush the stack
				if (stacking) {
					_c.FillRect (currentColor, start_x, y, pixels.GetUpperBound(1) - start_x, 1);
					stacking = false;
				}
				// and we are done for this line
			}
			//finally:
			_last_data = pixels;
			_c.Paint ();
    }
  }
}

