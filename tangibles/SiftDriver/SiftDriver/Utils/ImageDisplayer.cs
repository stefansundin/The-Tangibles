using Cairo;

using System;
using System.Collections.Generic;

using SiftDriver;
using SiftDriver.Utils;

using Sifteo;

namespace SiftDriver.Utils
{
  public class ImageDisplayer
  {
    public static void DisplayPicture(Cube c, JsonPicture p){
      Log.Debug ("starting the picture display : "+DateTime.Now.ToLongTimeString());
      p.RenderOnCube(c);
      Log.Debug("Done with the picture display : "+DateTime.Now.ToLongTimeString());
    }
  }

  public class JsonPicture
  {
    /* JSON representation of a picture in our case:
     * {picutreBlocks:
     *    [ { color:{r:int, g:int, b:int},
     *        blocks:[
     *                 { x:int y:int w:int h:int }
     *                 ...
     *               ]
     *      },
     *      { color: ... }
     *    ] }
     */
    public JsonColorBlocks[] pictureBlocks {get; set;}

    //public JsonColorBlocks this[int idx] { get{return pictureBlocks[idx]; } }

    public void RenderOnCube(Cube c){
      foreach(JsonColorBlocks cBlocks in pictureBlocks){
        cBlocks.RenderOnCube(c);
      }
    }

  }

  public class JsonColorBlocks
  {
    // a color block represent only the {color : ... [ ]} part of a JsonPicture
    public JsonColor color {get; set;}
    public JsonSimpleBlock[] blocks {get; set;}

    public void RenderOnCube(Cube c){
      //Log.Info("preparing to print block of the color "+color.r+","+color.g+","+color.b);
      foreach(JsonSimpleBlock block in this.blocks){
        block.PrintColorOnCube(c, color.GetSifteoColor());
      }
    }
  }
  public class JsonColor
  {
    public int r {get; set;}
    public int g {get; set;}
    public int b {get; set;}

    public override bool Equals (object obj)
    {
      JsonColor that = obj as JsonColor;
      return this.Equals(that);
    }

    public bool Equals (JsonColor that){
      if(that == null){
        return false;
      }//else
      return (this.r == that.r) && (this.g == that.g) && (this.b == that.b);
    }

    public override int GetHashCode ()
    {
      return r*(0x10000) + g*0x100 + b;
    }

    public Sifteo.Color GetSifteoColor(){
      try{
        Sifteo.Color c =  new Sifteo.Color(r, g, b);
        return c;
      }catch(Exception e){
        throw new Exception("something went wrong when trying to deal with the color ("+r+", "+g+", "+b+")");
      }
    }
  }
  public class JsonSimpleBlock
  {
    // represent the {x:int, y:int, ...}
    public int x {get; set;}
    public int y {get; set;}
    public int w {get; set;}
    public int h {get; set;}

    public void PrintColorOnCube(Cube c, Sifteo.Color color){
      c.FillRect(color, x, y, w, h);
    }
  }
}
