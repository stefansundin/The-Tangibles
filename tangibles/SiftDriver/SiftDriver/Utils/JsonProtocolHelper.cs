using System;
using System.Collections.Generic;
using JsonFx.Json;


namespace SiftDriver.Utils
{
  public class JsonProtocolHelper
  {

    public static String PrintableObject(Object obj){
      String completeDic = new JsonWriter().Write(obj);
      string strDic;
      if(completeDic.Length > 20){
        strDic = completeDic.Substring(0,9)+"[...]"+completeDic.Substring(completeDic.Length-5);
      }else{
        strDic = completeDic;
      }
      return strDic;
    }

    public static object AssertField(Dictionary<String,Object> dic, String key){
      if(dic.ContainsKey(key)){
        return dic[key];
      }else{
        throw new MissingFieldException(PrintableObject(dic), key);
      }
    }

    public static T AssertTypeInDic<T>(Dictionary<String, Object> dic, String key){
      Object field = AssertField(dic, key);
      if(field.GetType().Equals(typeof(T))){
        return (T) field;
      }else{
        throw new InvalidCastException("<<<"+PrintableObject(field)+">>> cannot be cast into : "+typeof(T));
      }
    }
  }
}

