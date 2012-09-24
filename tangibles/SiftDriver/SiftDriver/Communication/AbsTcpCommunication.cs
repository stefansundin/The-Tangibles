using System;
using System.Net.Sockets;
using System.IO;

namespace SiftDriver.Communication
{
	public class AbsTcpCommunication :AbsCommunication
	{
    private TcpClient _sock;
    private NetworkStream _socketStream;
    private TextReader _in;
    private TextWriter _out;
    public TextWriter Output{ get { return _out; } }
    public TextReader Input{ get {return _in;} }


		public AbsTcpCommunication (TcpClient sock)
		{
      _sock = sock;
			_socketStream = _sock.GetStream();
      _in = new StreamReader(_socketStream);
      _out = new StreamWriter(_socketStream);
		}

    public void sendBytes(byte[] bytes){
      _socketStream.Write(bytes, 0, bytes.Length);
      _socketStream.Flush();
    }
	}
}

