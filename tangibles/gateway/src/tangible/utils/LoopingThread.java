/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package tangible.utils;

/**
 *
 * @author leo
 */
public interface LoopingThread {

    void run();

    void stopASAP();

    void start();
}
