using System;
using Sifteo;


namespace UIComponents
{
  public class UIText
  {
    private Color _txtColor;
    private int _txtHeight;
    private int _txtWidth;
    private string _text;

    public UIText(){

    }
//    private void DrawString (Cube cube, int x, int y, Color color, String s)
//    {
//      int cur_x = x, cur_y = y;
//
//      for (int i = 0; i < s.Length; ++i) {
//        // in practice, you may want to make exceptions for special characters, such as spaces and newlines,
//        // and only call DrawCharacter (defined below) when needed.
//        DrawCharacter (cube, cur_x, cur_y, color, s [i]);
//        cur_x += 10;
//      }
//    }
//
//    public void DrawCharacter (Cube cube, int x, int y, Color color, char c)
//    {
//      // the following variables are for demonstration purposes.  in practice, you might want to pass these as
//      // arguments, or wrap these string-drawing functions into a class and use setters to set the current
//      // rendering height and width.
//
//
//      // etc
//    }
//
//    private void printChar(Cube cube, char c, int x,int y){
//    switch( c) {
//      #region char A-Z
//      case 'A':   //Draw A
//        cube.FillRect(_txtColor,x, y + 2 - _txtHeight, 2, _txtHeight - 2);
//        cube.FillRect(_txtColor,x+2,y - _txtHeight ,_txtWidth - 2,2);
//        cube.FillRect(_txtColor,x+2,y - _txtHeight/2,_txtWidth,2);
//        cube.FillRect(_txtColor,x+_txtWidth,y + 2 - _txtHeight,2,_txtHeight - 2);
//      break;
//      case 'B' :  //Draw B
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x, y - _txtHeight/2, _txtWidth, 2);
//        cube.FillRect(_txtColor, x + _txtWidth, y + 2 -_txtHeight, 2, _txtHeight/2-2);
//        cube.FillRect(_txtColor, x + _txtWidth, y +2 -_txtHeight/2, 2, _txtHeight/2-4);
//        cube.FillRect(_txtColor, x +2, y - 2 , _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x +2, y - _txtHeight, _txtWidth - 2, 2);
//      break;
//      case 'C' : //Draw C
//        cube.FillRect(_txtColor, x, y + 2 - _txtHeight, 2, _txtHeight-4);
//        cube.FillRect(_txtColor, x +2, y - 2 , _txtWidth, 2);
//        cube.FillRect(_txtColor, x +2, y - _txtHeight, _txtWidth, 2);
//      break;
//      case 'D' : //Draw D
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x + _txtWidth, y + 2 -_txtHeight, 2, _txtHeight-4);
//        cube.FillRect(_txtColor, x +2, y - 2 , _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x +2, y - _txtHeight, _txtWidth - 2, 2);
//      break;
//      case 'E' : //Draw E 
//        cube.FillRect(_txtColor, x, y- _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x+2, y - _txtHeight, _txtWidth, 2);
//        cube.FillRect(_txtColor, x+2, y - 2- _txtHeight/2, _txtWidth/2, 2);
//        cube.FillRect(_txtColor, x+2, y - 2, _txtWidth, 2);
//      break;
//      case 'F' : //Draw F 
//        cube.FillRect(_txtColor, x, y- _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x+2, y - _txtHeight, _txtWidth, 2);
//        cube.FillRect(_txtColor, x+2, y - 2 - _txtHeight/2, _txtWidth/2, 2);
//      break;
//      case 'G' : //Draw G
//        cube.FillRect(_txtColor, x, y + 2- _txtHeight, 2, _txtHeight - 4);
//        cube.FillRect(_txtColor, x + _txtWidth, y - 2 -_txtHeight/3, 2, _txtHeight/3);
//        cube.FillRect(_txtColor, x + _txtWidth, y - 4- 3*_txtHeight/4, 2, _txtHeight/4);
//        cube.FillRect(_txtColor, x+ _txtWidth/2, y - _txtHeight/2, _txtWidth/2 + 4, 2);
//        cube.FillRect(_txtColor, x +2, y - 2 , _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x +2, y - _txtHeight, _txtWidth - 2, 2);
//      break;  
//      case 'H' : //Draw H
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight  );
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight/2, _txtWidth,2);
//        cube.FillRect(_txtColor, x+_txtWidth, y - _txtHeight, 2, _txtHeight );
//      break;
//      case 'I' :  //Draw I
//        cube.FillRect(_txtColor, x + _txtWidth/2, y - _txtHeight, 2, _txtHeight  );
//        cube.FillRect(_txtColor, x + 2,y - _txtHeight, _txtWidth-2,2);
//        cube.FillRect(_txtColor, x + 2,y - 2, _txtWidth-2,2);
//      break;
//      case 'J' : //Draw J
//        cube.FillRect(_txtColor, x + _txtWidth, y -2 - _txtHeight, 2, _txtHeight  );
//        cube.FillRect(_txtColor, x + _txtWidth/2, y - _txtHeight, _txtWidth/2,2);
//        cube.FillRect(_txtColor, x + 2, y - 2, _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x, y - 2  - _txtHeight/4, 2, _txtHeight/4 );
//      break;
//      case 'K' : //Draw K
//        cube.FillRect(_txtColor,x, y - _txtHeight, 2, _txtHeight  );
//        cube.FillRect(_txtColor,x + 2, y - 2 - _txtHeight/2,2, 2);
//        cube.FillRect(_txtColor, x + 4, y - _txtHeight/2, 2,_txtHeight/4);
//        cube.FillRect(_txtColor, x + 4, y - 3*_txtHeight/4, 2, _txtHeight/4 - 2);
//        cube.FillRect(_txtColor, x + 6, y - _txtHeight, 2, _txtHeight/4);
//        cube.FillRect(_txtColor, x + 6, y - _txtHeight/4, 2, _txtHeight/4);
//      break;
//      case 'L':  //Draw L
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x + 2, y - 2, _txtWidth - 2, 2);
//      
//      break;
//      
//      case 'M' :  //Draw M
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight, _txtWidth, 2);
//        cube.FillRect(_txtColor, x + _txtWidth/2, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x + _txtWidth, y- _txtHeight, 2, _txtHeight);
//      break;
//      
//      case 'N' :  //Draw N
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x + 2, y + 2 - _txtHeight, 2,2);
//        cube.FillRect(_txtColor, x + 4, y + 4 - _txtHeight, (_txtWidth-5)/2,(_txtHeight -5)/2);
//        cube.FillRect(_txtColor, x - 4 + _txtWidth, y -4 - (_txtHeight - 5)/2 , (_txtWidth-5)/2,(_txtHeight - 5)/2);
//        cube.FillRect(_txtColor, x - 2 + _txtWidth, y -4, 2,2);
//        cube.FillRect(_txtColor, x+ _txtWidth, y - _txtHeight, 2, _txtHeight);
//      break;
//      
//      case 'O' :  //Draw O
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x + _txtWidth, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x+2, y - 2, _txtWidth, 2);
//        cube.FillRect(_txtColor, x+2, y - _txtHeight, _txtWidth, 2);
//      break;
//      
//      case 'P'  : //Draw P
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x + _txtWidth, y + 2 - _txtHeight, 2, _txtHeight/2 - 2);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight,   _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight/2, _txtWidth - 2, 2);
//        //cube.FillRect(mColor, x + mTextW, y - mTextH/2, 2, mTextH/2);
//      break;
//      case 'Q'  : //Draw Q
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x + _txtWidth, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x+2, y - 2, _txtWidth, 2);
//        cube.FillRect(_txtColor, x+2, y - _txtHeight, _txtWidth, 2);
//        cube.FillRect(_txtColor, x - 4 + _txtWidth, y - _txtHeight/2, 2,_txtHeight/4);
//        cube.FillRect(_txtColor, x -2 +  _txtWidth, y - _txtHeight/4, 2, _txtHeight/4);
//      break;
//      case 'R'  : //Draw R
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x + _txtWidth, y + 2 - _txtHeight, 2, _txtHeight/2 - 2);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight,   _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight/2, _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x - 2 + _txtWidth, y - _txtHeight/2, 2,_txtHeight/4);
//        cube.FillRect(_txtColor, x     + _txtWidth, y - _txtHeight/4, 2, _txtHeight/4);
//      break;
//      case 'S'  : //Draw S
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight, _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x, y + 2 - _txtHeight , 2, _txtHeight/2 - 4);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight/2 - 2, _txtWidth - 4, 2);
//        cube.FillRect(_txtColor, x + _txtWidth - 2, y - _txtHeight/2, 2, _txtHeight/2 - 2);
//        cube.FillRect(_txtColor, x , y - 2, _txtWidth - 2, 2);
//      break;
//      case 'T'  : //Draw T
//        cube.FillRect(_txtColor, x + _txtWidth/2 - 1, y - _txtHeight, 2, _txtHeight  );
//        cube.FillRect(_txtColor, x ,y - _txtHeight, _txtWidth,2);
//      break;
//      case 'U'  : //Draw U
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight - 2);
//        cube.FillRect(_txtColor, x + _txtWidth, y- _txtHeight, 2, _txtHeight - 2);
//        cube.FillRect(_txtColor, x+2, y - 2, _txtWidth - 2, 2);
//      break;
//      case 'V'  : //Draw V
//        cube.FillRect(_txtColor, x - 4 + _txtWidth/2, y - _txtHeight, 2, _txtHeight - 4);
//        cube.FillRect(_txtColor, x - 2 + _txtWidth/2,y - 4, 2, 2);
//        cube.FillRect(_txtColor, x + _txtWidth/2, y - 2, 2, 2);
//        cube.FillRect(_txtColor, x + 2 + _txtWidth/2,y - 4, 2, 2);
//        cube.FillRect(_txtColor, x + 4 + _txtWidth/2, y - _txtHeight, 2, _txtHeight - 4);
//      break;
//      case 'W'  : //Draw W      
//        cube.FillRect(_txtColor, x, y- _txtHeight, 2, y);
//        cube.FillRect(_txtColor, x + 2, y - 2 , _txtWidth, 2);
//        cube.FillRect(_txtColor, x + _txtWidth/2, y- _txtHeight/2, 2, _txtHeight/2 );
//        cube.FillRect(_txtColor, x + _txtWidth, y - _txtHeight, 2, y);
//      break;
//      
//      case 'X'  : //Draw X
//        cube.FillRect(_txtColor, x - 4 + _txtWidth/2, y - _txtHeight, 2, _txtHeight/2 - 2);
//        cube.FillRect(_txtColor, x - 2 + _txtWidth/2, y - 2 - _txtHeight/2, 2, 2);
//        cube.FillRect(_txtColor, x + _txtWidth/2, y - _txtHeight/2, 2, 2);
//        cube.FillRect(_txtColor, x + 2 + _txtWidth/2, y - 2 - _txtHeight/2, 2, 2);
//        cube.FillRect(_txtColor, x + 4 + _txtWidth/2, y - _txtHeight, 2, _txtHeight/2 - 2);
//  
//        cube.FillRect(_txtColor, x - 4 + _txtWidth/2, y + 4- _txtHeight/2, 2, _txtHeight/2 - 4);
//        cube.FillRect(_txtColor, x - 2 + _txtWidth/2, y + 2 - _txtHeight/2, 2, 2);
//  
//        cube.FillRect(_txtColor, x + 2 + _txtWidth/2, y + 2 - _txtHeight/2, 2, 2);
//        cube.FillRect(_txtColor, x + 4 + _txtWidth/2, y + 4- _txtHeight/2, 2, _txtHeight/2 - 4);
//      
//      
//      break;
//      case 'Y'  : //Draw Y
//        cube.FillRect(_txtColor, x - 4 + _txtWidth/2, y - _txtHeight, 2, _txtHeight/2 - 2);
//        cube.FillRect(_txtColor, x - 2 + _txtWidth/2,y - 2 - _txtHeight/2, 2, 2);
//        cube.FillRect(_txtColor, x + _txtWidth/2, y - _txtHeight/2, 2, _txtHeight/2);
//        cube.FillRect(_txtColor, x + 2 + _txtWidth/2,y - 2 - _txtHeight/2, 2, 2);
//        cube.FillRect(_txtColor, x + 4 + _txtWidth/2, y - _txtHeight, 2, _txtHeight/2 - 2);
//      break;
//      case 'Z'  : //Draw Z
//        cube.FillRect(_txtColor, x, y - _txtHeight, _txtWidth, 2);
//        cube.FillRect(_txtColor, x - 2 + _txtWidth, y + 2 - _txtHeight, 2,2);
//        cube.FillRect(_txtColor, x - 4 + _txtWidth, y + 4 - _txtHeight, (_txtWidth-5)/2,(_txtHeight -5)/2 -2);
//        // cube.FillRect(mColor, x - 6 + mTextW, y + 4 - mTextH, 2, 2);
//        cube.FillRect(_txtColor, x + 4, y - 4 - (_txtHeight - 5)/2  , (_txtWidth-5)/2,(_txtHeight - 5)/2 - 4);
//        cube.FillRect(_txtColor, x + 2, y - 2 - (_txtHeight - 5)/2 ,  (_txtWidth-5)/2,(_txtHeight - 5)/2 - 2);
//        cube.FillRect(_txtColor, x, y -4, 2,2);
//        cube.FillRect(_txtColor, x, y -2, _txtWidth, 2);
//      break;
//        #endregion
//        #region 0-9
//      case '0'  : //Draw 0
//        cube.FillRect(_txtColor, x, y + 2- _txtHeight, 2, _txtHeight - 4);
//        cube.FillRect(_txtColor, x + _txtWidth, y + 2 - _txtHeight, 2, _txtHeight - 4);
//        cube.FillRect(_txtColor, x+2, y - 2, _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x+2, y - _txtHeight, _txtWidth - 2, 2);
//      break;
//      case '1'  : //Draw 1
//        cube.FillRect(_txtColor, x + _txtWidth/2, y - _txtHeight, 2, _txtHeight  );
//        cube.FillRect(_txtColor, x - 2 +_txtWidth/2 ,y - _txtHeight, 2,2);
//        cube.FillRect(_txtColor, x + 2,y - 2, _txtWidth-2,2);
//      break;
//      case '2'  : //Draw 2
//        cube.FillRect(_txtColor, x , y - _txtHeight, _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x + _txtWidth - 2, y + 2 - _txtHeight , 2, _txtHeight/2 - 4);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight/2 - 2, _txtWidth - 4, 2);
//        cube.FillRect(_txtColor, x + 2, y - 2, _txtWidth - 4, 2);
//      break;
//      case '3'  : //Draw 3
//        cube.FillRect(_txtColor, x - 2 + _txtWidth, y + 2 - _txtHeight, 2, _txtHeight - 4);
//        cube.FillRect(_txtColor, x, y - _txtHeight, _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x - 2+ _txtWidth/2, y - _txtHeight/2, _txtWidth/2, 2);
//        cube.FillRect(_txtColor, x, y - 2, _txtWidth - 2, 2);
//      break;
//      case '4'  : //Draw 4
//        cube.FillRect(_txtColor, x, y - _txtHeight, 2, _txtHeight/2  );
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight/2, _txtWidth,2);
//        cube.FillRect(_txtColor, x -2 + _txtWidth, y - _txtHeight, 2, _txtHeight );
//      break;
//      case '5'  : //Draw 5
//        cube.FillRect(_txtColor, x , y - _txtHeight/2, 2, _txtHeight/2 - 2);
//        cube.FillRect(_txtColor, x , y - _txtHeight, _txtWidth , 2);
//        cube.FillRect(_txtColor, x, y + 2 - _txtHeight , 2, _txtHeight/2 - 4);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight/2 - 2, _txtWidth - 4, 2);
//        cube.FillRect(_txtColor, x + _txtWidth - 2, y - _txtHeight/2, 2, _txtHeight/2 - 2);
//        cube.FillRect(_txtColor, x , y - 2, _txtWidth - 2, 2);
//      break;
//      case '6'  : //Draw 6
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight, _txtWidth - 2, 2);
//        cube.FillRect(_txtColor, x, y + 2 - _txtHeight , 2, _txtHeight - 4);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight/2 - 2, _txtWidth - 4, 2);
//        cube.FillRect(_txtColor, x + _txtWidth - 2, y - _txtHeight/2, 2, _txtHeight/2 - 2);
//        cube.FillRect(_txtColor, x + 2, y - 2, _txtWidth - 4, 2);
//      break;
//      case '7'  : //Draw 7
//        cube.FillRect(_txtColor, x - 2 + _txtWidth, y - _txtHeight, 2, _txtHeight);
//        cube.FillRect(_txtColor, x , y - _txtHeight, _txtWidth - 2, 2);
//      break;
//      case '8'  : //Draw 8
//        cube.FillRect(_txtColor, x, y + 2- _txtHeight, 2, _txtHeight - 4);
//        cube.FillRect(_txtColor, x - 2 + _txtWidth, y + 2 - _txtHeight, 2, _txtHeight - 4);
//        cube.FillRect(_txtColor, x + 2, y - 1 - _txtHeight/2, _txtWidth - 4, 2);
//        cube.FillRect(_txtColor, x + 2, y - 2, _txtWidth - 4, 2);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight, _txtWidth - 4, 2);
//      break;
//      case '9'  : //Draw 9
//        cube.FillRect(_txtColor, x - 2 + _txtWidth, y + 2 - _txtHeight, 2, _txtHeight - 2);
//        cube.FillRect(_txtColor, x , y + 2 - _txtHeight, 2, _txtHeight/2 - 2);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight,   _txtWidth - 4, 2);
//        cube.FillRect(_txtColor, x + 2, y - _txtHeight/2, _txtWidth - 4, 2);
//      break;
//        #endregion
//      }
//    }

  }
}

