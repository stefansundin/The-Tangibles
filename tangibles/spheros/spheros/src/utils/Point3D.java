package utils;

public class Point3D{
	public double x,y,z;
	int exponent = 2;
	
	public Point3D(){}
	
	public Point3D(int exponent){
		this.exponent = exponent;
	}
	
	public String toString(){
		double factor = Math.pow(10, exponent);
		return("("+Math.round(x*factor)/factor+ ","+Math.round(y*factor)/factor+","+Math.round(z*factor)/factor+")");
	}
}