/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tangible.utils;

/**
 *
 * @param <Argument> Specify notifying argument we expect on this callback
 * @param <Return>
 * @author leo
 */
public interface CallBack<Argument, Return> {

    public Return callback(Argument arg);
}
