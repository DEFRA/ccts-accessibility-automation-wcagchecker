package cognizant.compliance.checker;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

public class ResourceReader {
	public static String readResourceFile(String fileName) {
		InputStream inputStream = ResourceReader.class.getClassLoader().getResourceAsStream(fileName);

		if (inputStream != null) {
			try (BufferedReader reader = new BufferedReader(
					new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
				return reader.lines().collect(Collectors.joining("\n"));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return "File not found!";
	}
}