package utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

public class SpheroConfig {

	public final String name = "sphero.properties";
	public Properties prop = new Properties();

	public void save(String id) {
		try {
			prop.setProperty("id", id);
			prop.store(new FileOutputStream(name), null);
		} catch (IOException ex) {
			File f = new File(name);
			f.delete();
		}
	}

	public String load() throws FileNotFoundException, IOException {
		prop.load(new FileInputStream(name));
		return prop.getProperty("id");
	}
}
