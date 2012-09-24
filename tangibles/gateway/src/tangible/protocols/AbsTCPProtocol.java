/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tangible.protocols;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

/**
 * provide the standard methods for initialisation and creationg of TCP socket
 * based protocols
 *
 * @author leo
 */
public abstract class AbsTCPProtocol {

    protected Socket _sock;
    private BufferedReader _in;
    private PrintWriter _out;

    AbsTCPProtocol(Socket s) throws IOException {
        _sock = s;
        _in = new BufferedReader(new InputStreamReader(_sock.getInputStream()));
        _out = new PrintWriter(_sock.getOutputStream());
    }

    protected BufferedReader getInput() {
        return _in;
    }

    protected PrintWriter getOutput() {
        return _out;
    }

    public boolean isConnected() {
        return _sock != null && _sock.isConnected();
    }
}
