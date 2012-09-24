using System;

using Cairo;
using Pango;

using Sifteo;

namespace SiftDriver.Utils
{
  public class TextDisplayer
  {
    public static void DisplayMessage (Cube c, String msg, SiftColor color)
    {
      DisplayMessageV3(c, msg, color);
    }
    public static void DisplayMessageV1 (Cube c, String msg, SiftColor color)
    {
      TextWriter writer = new TextWriter();
      writer.setText( msg.ToUpper ());
      writer.setColor(color.ToSifteo());
      writer.writeText(c);
//      Log.Debug("message supposely printed...");
    }
    public static void DisplayMessageV2 (Cube c, string msg, SiftColor color)
        {
            ImageSurface sr = new ImageSurface (Format.ARGB32, 128, 128);
            Cairo.Context context = new Cairo.Context (sr);

//      context.Color = new SiftColor(72, 255, 170).ToCairo();
            context.Color = new Cairo.Color (0, 0, 0, 0);
            context.Paint ();

            context.Color = color.ToCairo ();
            context.SelectFontFace ("Arial", FontSlant.Normal, FontWeight.Normal);
            context.SetFontSize (16);
            TextExtents te = context.TextExtents (msg);
//      context.MoveTo(0.5 - te.Width  / 2 - te.XBearing,
//          0.5 - te.Height / 2 - te.YBearing);
            Log.Debug ("text Extents: " + te.Width + "*" + te.Height);
            context.MoveTo (64 - (te.Width / 2), 64 + (te.Height / 2));
            context.ShowText (msg);

            //ok now everything is draw we just have to go through every thing and take out value per value...
            sr.Flush ();
            byte[] data = sr.Data;
//      Log.Debug("about to go throught the data... length is: "+data.Length);
//      Log.Debug("for information 128*128 is: "+(128*128));
//      Log.Debug("for information 128*128*24 is: "+(128*128*24));

            for (int i = 0, x = 0, y = 0; i < data.Length; i+= 4, x++) {
                if (x >= 128) {
                    x = 0;
                    y ++;
                }
                byte b = data [i],
                g = data [i + 1],
                r = data [i + 2],
                a = data [i + 3];
                if (a != 0 || r != 0 || g != 0 || b != 0) {
                    SiftColor sc = new SiftColor (r, g, b);
                    //Log.Debug("sc = "+r+"|"+g+"|"+b+" for the point "+x+";"+y);
                    c.FillRect (sc.ToSifteo (), x, y, 1, 1);
                } else {
                    // we ignore it
                }
            }
            ((IDisposable)context).Dispose ();
            ((IDisposable) sr).Dispose();
    }
    public static void DisplayMessageV3 (Cube c, string msg, SiftColor color)
    {
      ImageSurface sr = new ImageSurface(Format.ARGB32, 128, 128);
      Cairo.Context context = new Cairo.Context(sr);

//      context.Color = new SiftColor(72, 255, 170).ToCairo();
      context.Color = new Cairo.Color(0, 0, 0, 0);
      context.Paint();
      Pango.Layout pango = Pango.CairoHelper.CreateLayout(context);

      pango.FontDescription = Pango.FontDescription.FromString("Arial 16");
      pango.Alignment = Alignment.Center;
      pango.Wrap = WrapMode.WordChar;
      pango.Width = 128 * 1016;
      pango.SetText(msg);

      context.Color = color.ToCairo();
      int pWidth = 0, pHeight = 0;
//      pango.GetSize(out pWidth, out pHeight);
//      Log.Debug("pango size: "+pWidth+"x"+pHeight);
      pango.GetPixelSize(out pWidth,  out pHeight);
      Log.Debug("pango Pixel size: "+pWidth+"x"+pHeight);

      context.MoveTo(0, 64 - (pHeight /2));
      CairoHelper.ShowLayout(context, pango);
      sr.Flush();
      byte[] data = sr.Data;
//      Log.Debug("about to go throught the data... length is: "+data.Length);
//      Log.Debug("for information 128*128 is: "+(128*128));
//      Log.Debug("for information 128*128*24 is: "+(128*128*24));

      for(int i = 0, x = 0, y = 0; i < data.Length; i+= 4, x++){
        if(x >= 128){
          x = 0; y ++;
        }
        byte b = data[i],
             g = data[i+1],
             r = data[i+2],
             a = data[i+3];
        if(a!=0 || r != 0 || g != 0 || b != 0){
          SiftColor sc = new SiftColor(r, g, b);
          //Log.Debug("sc = "+r+"|"+g+"|"+b+" for the point "+x+";"+y);
          c.FillRect(sc.ToSifteo(), x, y, 1, 1);
        }else{
          // we ignore it
        }
      }
      ((IDisposable) context).Dispose ();
      ((IDisposable) pango).Dispose ();
      ((IDisposable) sr).Dispose();

    }

  }


  public class TextWriter
  {
   private int mX = 0;
   private int mY = 20;
   private int mTextH = 20;
   private int mTextW = 10;
   //private bool mExtend = false; //extend allows the text string to be wrote across many cubes
   private bool mWrap = true;   //wrap allows the text to wrap across the screen if extend is
   //enabled wrap will only wrap after reaching the end of the cubes
   private string mString = "0123456789";
   private Sifteo.Color mColor;
  //writes/draws text to cube

   public void writeText (Cube cube)
   {
     int i;
     int rowCount = 0;
     int nextX = mX, nextY = mY;

     for (i = 0; i < mString.Length; i++) {

       nextX += mTextW + 2;
       if (mWrap == true && nextX > 128) {//when extending is added need to revisit wrapping detection
         rowCount++;
         nextY = mY + rowCount * mTextH;
         nextX = mX;
       }

       printChar (cube, mString [i], nextX, nextY);
     }
   }

   public void setStringOrig (int x, int y)
   {
     mX = x;
     mY = y;

   }

   public void setColor (Sifteo.Color c)
   {
     mColor = c;
   }

   public void setText (string lString)
   {
     mString = string.Copy (lString);
   }


  //draws all chars and numbers A-Z 0-9
//   public void printChar (Cube cube, char ch, int x, int y)
//   {
//     printChar (cube, ch, x, y);
//   }

   public void printChar (Cube cube, char c, int x, int y)
   {
     switch (c) {
     case 'A':   //Draw A
       cube.FillRect (mColor, x, y + 2 - mTextH, 2, mTextH - 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 2, 2);
       cube.FillRect (mColor, x + 2, y - mTextH / 2, mTextW, 2);
       cube.FillRect (mColor, x + mTextW, y + 2 - mTextH, 2, mTextH - 2);
       break;
     case 'B' :  //Draw B
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x, y - mTextH / 2, mTextW, 2);
       cube.FillRect (mColor, x + mTextW, y + 2 - mTextH, 2, mTextH / 2 - 2);
       cube.FillRect (mColor, x + mTextW, y + 2 - mTextH / 2, 2, mTextH / 2 - 4);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 2, 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 2, 2);
       break;
     case 'C' : //Draw C
       cube.FillRect (mColor, x, y + 2 - mTextH, 2, mTextH - 4);
       cube.FillRect (mColor, x + 2, y - 2, mTextW, 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW, 2);
       break;
     case 'D' : //Draw D
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + mTextW, y + 2 - mTextH, 2, mTextH - 4);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 2, 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 2, 2);
       break;
     case 'E' : //Draw E
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW, 2);
       cube.FillRect (mColor, x + 2, y - 2 - mTextH / 2, mTextW / 2, 2);
       cube.FillRect (mColor, x + 2, y - 2, mTextW, 2);
       break;
     case 'F' : //Draw F
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW, 2);
       cube.FillRect (mColor, x + 2, y - 2 - mTextH / 2, mTextW / 2, 2);
       break;
     case 'G' : //Draw G
       cube.FillRect (mColor, x, y + 2 - mTextH, 2, mTextH - 4);
       cube.FillRect (mColor, x + mTextW, y - 2 - mTextH / 3, 2, mTextH / 3);
       cube.FillRect (mColor, x + mTextW, y - 4 - 3 * mTextH / 4, 2, mTextH / 4);
       cube.FillRect (mColor, x + mTextW / 2, y - mTextH / 2, mTextW / 2 + 4, 2);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 2, 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 2, 2);
       break;
     case 'H' : //Draw H
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + 2, y - mTextH / 2, mTextW, 2);
       cube.FillRect (mColor, x + mTextW, y - mTextH, 2, mTextH);
       break;
     case 'I' :  //Draw I
       cube.FillRect (mColor, x + mTextW / 2, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 2, 2);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 2, 2);
       break;
     case 'J' : //Draw J
       cube.FillRect (mColor, x + mTextW, y - 2 - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + mTextW / 2, y - mTextH, mTextW / 2, 2);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 2, 2);
       cube.FillRect (mColor, x, y - 2 - mTextH / 4, 2, mTextH / 4);
       break;
     case 'K' : //Draw K
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + 2, y - 2 - mTextH / 2, 2, 2);
       cube.FillRect (mColor, x + 4, y - mTextH / 2, 2, mTextH / 4);
       cube.FillRect (mColor, x + 4, y - 3 * mTextH / 4, 2, mTextH / 4 - 2);
       cube.FillRect (mColor, x + 6, y - mTextH, 2, mTextH / 4);
       cube.FillRect (mColor, x + 6, y - mTextH / 4, 2, mTextH / 4);
       break;
     case 'L':  //Draw L
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 2, 2);

       break;

     case 'M' :  //Draw M
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW, 2);
       cube.FillRect (mColor, x + mTextW / 2, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + mTextW, y - mTextH, 2, mTextH);
       break;

     case 'N' :  //Draw N
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + 2, y + 2 - mTextH, 2, 2);
       cube.FillRect (mColor, x + 4, y + 4 - mTextH, (mTextW - 5) / 2, (mTextH - 5) / 2);
       cube.FillRect (mColor, x - 4 + mTextW, y - 4 - (mTextH - 5) / 2, (mTextW - 5) / 2, (mTextH - 5) / 2);
       cube.FillRect (mColor, x - 2 + mTextW, y - 4, 2, 2);
       cube.FillRect (mColor, x + mTextW, y - mTextH, 2, mTextH);
       break;

     case 'O' :  //Draw O
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + mTextW, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + 2, y - 2, mTextW, 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW, 2);
       break;

     case 'P'  : //Draw P
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + mTextW, y + 2 - mTextH, 2, mTextH / 2 - 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 2, 2);
       cube.FillRect (mColor, x + 2, y - mTextH / 2, mTextW - 2, 2);
  //cube.FillRect(mColor, x + mTextW, y - mTextH/2, 2, mTextH/2);
       break;
     case 'Q'  : //Draw Q
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + mTextW, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + 2, y - 2, mTextW, 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW, 2);
       cube.FillRect (mColor, x - 4 + mTextW, y - mTextH / 2, 2, mTextH / 4);
       cube.FillRect (mColor, x - 2 + mTextW, y - mTextH / 4, 2, mTextH / 4);
       break;
     case 'R'  : //Draw R
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x + mTextW, y + 2 - mTextH, 2, mTextH / 2 - 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 2, 2);
       cube.FillRect (mColor, x + 2, y - mTextH / 2, mTextW - 2, 2);
       cube.FillRect (mColor, x - 2 + mTextW, y - mTextH / 2, 2, mTextH / 4);
       cube.FillRect (mColor, x + mTextW, y - mTextH / 4, 2, mTextH / 4);
       break;
     case 'S'  : //Draw S
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 2, 2);
       cube.FillRect (mColor, x, y + 2 - mTextH, 2, mTextH / 2 - 4);
       cube.FillRect (mColor, x + 2, y - mTextH / 2 - 2, mTextW - 4, 2);
       cube.FillRect (mColor, x + mTextW - 2, y - mTextH / 2, 2, mTextH / 2 - 2);
       cube.FillRect (mColor, x, y - 2, mTextW - 2, 2);
       break;
     case 'T'  : //Draw T
       cube.FillRect (mColor, x + mTextW / 2 - 1, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x, y - mTextH, mTextW, 2);
       break;
     case 'U'  : //Draw U
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH - 2);
       cube.FillRect (mColor, x + mTextW, y - mTextH, 2, mTextH - 2);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 2, 2);
       break;
     case 'V'  : //Draw V
       cube.FillRect (mColor, x - 4 + mTextW / 2, y - mTextH, 2, mTextH - 4);
       cube.FillRect (mColor, x - 2 + mTextW / 2, y - 4, 2, 2);
       cube.FillRect (mColor, x + mTextW / 2, y - 2, 2, 2);
       cube.FillRect (mColor, x + 2 + mTextW / 2, y - 4, 2, 2);
       cube.FillRect (mColor, x + 4 + mTextW / 2, y - mTextH, 2, mTextH - 4);
       break;
     case 'W'  : //Draw W
       cube.FillRect (mColor, x, y - mTextH, 2, y);
       cube.FillRect (mColor, x + 2, y - 2, mTextW, 2);
       cube.FillRect (mColor, x + mTextW / 2, y - mTextH / 2, 2, mTextH / 2);
       cube.FillRect (mColor, x + mTextW, y - mTextH, 2, y);
       break;

     case 'X'  : //Draw X
       cube.FillRect (mColor, x - 4 + mTextW / 2, y - mTextH, 2, mTextH / 2 - 2);
       cube.FillRect (mColor, x - 2 + mTextW / 2, y - 2 - mTextH / 2, 2, 2);
       cube.FillRect (mColor, x + mTextW / 2, y - mTextH / 2, 2, 2);
       cube.FillRect (mColor, x + 2 + mTextW / 2, y - 2 - mTextH / 2, 2, 2);
       cube.FillRect (mColor, x + 4 + mTextW / 2, y - mTextH, 2, mTextH / 2 - 2);

       cube.FillRect (mColor, x - 4 + mTextW / 2, y + 4 - mTextH / 2, 2, mTextH / 2 - 4);
       cube.FillRect (mColor, x - 2 + mTextW / 2, y + 2 - mTextH / 2, 2, 2);

       cube.FillRect (mColor, x + 2 + mTextW / 2, y + 2 - mTextH / 2, 2, 2);
       cube.FillRect (mColor, x + 4 + mTextW / 2, y + 4 - mTextH / 2, 2, mTextH / 2 - 4);


       break;
     case 'Y'  : //Draw Y
       cube.FillRect (mColor, x - 4 + mTextW / 2, y - mTextH, 2, mTextH / 2 - 2);
       cube.FillRect (mColor, x - 2 + mTextW / 2, y - 2 - mTextH / 2, 2, 2);
       cube.FillRect (mColor, x + mTextW / 2, y - mTextH / 2, 2, mTextH / 2);
       cube.FillRect (mColor, x + 2 + mTextW / 2, y - 2 - mTextH / 2, 2, 2);
       cube.FillRect (mColor, x + 4 + mTextW / 2, y - mTextH, 2, mTextH / 2 - 2);
       break;
     case 'Z'  : //Draw Z
       cube.FillRect (mColor, x, y - mTextH, mTextW, 2);
       cube.FillRect (mColor, x - 2 + mTextW, y + 2 - mTextH, 2, 2);
       cube.FillRect (mColor, x - 4 + mTextW, y + 4 - mTextH, (mTextW - 5) / 2, (mTextH - 5) / 2 - 2);
  // cube.FillRect(mColor, x - 6 + mTextW, y + 4 - mTextH, 2, 2);
       cube.FillRect (mColor, x + 4, y - 4 - (mTextH - 5) / 2, (mTextW - 5) / 2, (mTextH - 5) / 2 - 4);
       cube.FillRect (mColor, x + 2, y - 2 - (mTextH - 5) / 2, (mTextW - 5) / 2, (mTextH - 5) / 2 - 2);
       cube.FillRect (mColor, x, y - 4, 2, 2);
       cube.FillRect (mColor, x, y - 2, mTextW, 2);
       break;
     case '0'  : //Draw 0
       cube.FillRect (mColor, x, y + 2 - mTextH, 2, mTextH - 4);
       cube.FillRect (mColor, x + mTextW, y + 2 - mTextH, 2, mTextH - 4);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 2, 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 2, 2);
       break;
     case '1'  : //Draw 1
       cube.FillRect (mColor, x + mTextW / 2, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x - 2 + mTextW / 2, y - mTextH, 2, 2);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 2, 2);
       break;
     case '2'  : //Draw 2
       cube.FillRect (mColor, x, y - mTextH, mTextW - 2, 2);
       cube.FillRect (mColor, x + mTextW - 2, y + 2 - mTextH, 2, mTextH / 2 - 4);
       cube.FillRect (mColor, x + 2, y - mTextH / 2 - 2, mTextW - 4, 2);
       cube.FillRect (mColor, x, y - mTextH / 2, 2, mTextH / 2 - 2);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 4, 2);
       break;
     case '3'  : //Draw 3
       cube.FillRect (mColor, x - 2 + mTextW, y + 2 - mTextH, 2, mTextH - 4);
       cube.FillRect (mColor, x, y - mTextH, mTextW - 2, 2);
       cube.FillRect (mColor, x - 2 + mTextW / 2, y - mTextH / 2, mTextW / 2, 2);
       cube.FillRect (mColor, x, y - 2, mTextW - 2, 2);
       break;
     case '4'  : //Draw 4
       cube.FillRect (mColor, x, y - mTextH, 2, mTextH / 2);
       cube.FillRect (mColor, x + 2, y - mTextH / 2, mTextW, 2);
       cube.FillRect (mColor, x - 2 + mTextW, y - mTextH, 2, mTextH);
       break;
     case '5'  : //Draw 5
       cube.FillRect (mColor, x, y - mTextH, mTextW, 2);
       cube.FillRect (mColor, x, y + 2 - mTextH, 2, mTextH / 2 - 4);
       cube.FillRect (mColor, x + 2, y - mTextH / 2 - 2, mTextW - 4, 2);
       cube.FillRect (mColor, x + mTextW - 2, y - mTextH / 2, 2, mTextH / 2 - 2);
       cube.FillRect (mColor, x, y - 2, mTextW - 2, 2);
       break;
     case '6'  : //Draw 6
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 2, 2);
       cube.FillRect (mColor, x, y + 2 - mTextH, 2, mTextH - 4);
       cube.FillRect (mColor, x + 2, y - mTextH / 2 - 2, mTextW - 4, 2);
       cube.FillRect (mColor, x + mTextW - 2, y - mTextH / 2, 2, mTextH / 2 - 2);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 4, 2);
       break;
     case '7'  : //Draw 7
       cube.FillRect (mColor, x - 2 + mTextW, y - mTextH, 2, mTextH);
       cube.FillRect (mColor, x, y - mTextH, mTextW - 2, 2);
       break;
     case '8'  : //Draw 8
       cube.FillRect (mColor, x, y + 2 - mTextH, 2, mTextH - 4);
       cube.FillRect (mColor, x - 2 + mTextW, y + 2 - mTextH, 2, mTextH - 4);
       cube.FillRect (mColor, x + 2, y - 1 - mTextH / 2, mTextW - 4, 2);
       cube.FillRect (mColor, x + 2, y - 2, mTextW - 4, 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 4, 2);
       break;
     case '9'  : //Draw 9
       cube.FillRect (mColor, x - 2 + mTextW, y + 2 - mTextH, 2, mTextH - 2);
       cube.FillRect (mColor, x, y + 2 - mTextH, 2, mTextH / 2 - 2);
       cube.FillRect (mColor, x + 2, y - mTextH, mTextW - 4, 2);
       cube.FillRect (mColor, x + 2, y - mTextH / 2, mTextW - 4, 2);
       break;
      default:
        Log.Debug("c is: "+c+" let's but a space instead");
        break;
     }
   }
  }
}

