using System;
using System.Collections.Generic;
using Cairo;
using Sifteo;

namespace SiftDriver.Utils
{
  public struct SiftColor
  {
    public static readonly SiftColor WHITE = new SiftColor(255, 255, 255);
  
    public int r, g, b;

    public Cairo.Color ToCairo(){
      return new Cairo.Color((r + 0.0) / 255.0,
                             (g + 0.0) / 255.0,
                             (b + 0.0) / 255.0);
    }
    public Sifteo.Color ToSifteo(){
      return new Sifteo.Color(r, g, b);
    }

    public SiftColor(Dictionary<string,object> colors): this(JsonProtocolHelper.AssertTypeInDic<int>(colors,"r"),
          JsonProtocolHelper.AssertTypeInDic<int>(colors,"g"),
          JsonProtocolHelper.AssertTypeInDic<int>(colors,"b")
          ){}

    public SiftColor(Cairo.Color color): this((int)color.R*255,
                                              (int)color.G*255,
                                              (int)color.B*255){}
    public SiftColor(byte c){
      r = (0xff0000 & c) >> 16;
      g = (0x00ff00 & c) >> 8;
      b = (0x0000ff);
    }

    public SiftColor(int cr, int cg, int cb){
      r = cr; g = cg; b = cb;
    }

    public SiftColor(Sifteo.Color c){
      //TODO let to be done
      r = 0; g = 0; b = 0;
    }
    
    public static SiftColor operator-(SiftColor colorA, SiftColor colorB)
    {
      return new SiftColor(colorA.r - colorB.r, colorA.g - colorB.g, colorA.b - colorB.b);
    }
    public static SiftColor operator+(SiftColor colorA, SiftColor colorB)
    {
      return new SiftColor(colorA.r + colorB.r, colorA.g + colorB.g, colorA.b + colorB.b);
    }
    public static SiftColor operator*(float factor, SiftColor color)
    {
      return new SiftColor((int) (factor*color.r),
        (int) (factor*color.g),
        (int) (factor*color.b));
    }
		public static SiftColor operator*(double factor, SiftColor color)
    {
      return new SiftColor((int) (factor*color.r),
        (int) (factor*color.g),
        (int) (factor*color.b));
    }
    
    public static bool operator== (SiftColor colorA, SiftColor colorB)
		{
			return colorA.r == colorB.r &&
				colorA.g == colorB.g && 
				colorA.b == colorB.b;
    }
    public static bool operator!= (SiftColor colorA, SiftColor colorB)
		{
			return ! (colorA == colorB);
		}
		
		public static bool operator> (SiftColor colorA, SiftColor colorB)
		{
			return colorA.r > colorB.r && colorA.g > colorB.g && colorA.b > colorB.b;
		}
		public static bool operator< (SiftColor colorA, SiftColor colorB)
		{
			return colorA.r < colorB.r && colorA.g < colorB.g && colorA.b < colorB.b;
		}
		public static bool operator>= (SiftColor colorA, SiftColor colorB)
		{
			return colorA.r >= colorB.r && colorA.g >= colorB.g && colorA.b >= colorB.b;
		}
		public static bool operator<= (SiftColor colorA, SiftColor colorB)
		{
			return colorA.r <= colorB.r && colorA.g <= colorB.g && colorA.b <= colorB.b;
		}
  }
}

