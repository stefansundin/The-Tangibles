/*
 * Master-Thesis work: see https://sites.google.com/site/sifthesis/
 */
package tangible.utils;

import java.io.Reader;

/**
 *
 * @param <T>
 * @author leo
 */
public abstract class StreamReadingThread<T extends Reader> extends AbsLoopingThread {

    protected T _reader;

    public StreamReadingThread(T reader) {
        this._reader = reader;
    }

    public abstract void read();

    @Override
    protected void loopingProcess() {
        read();
    }
}
