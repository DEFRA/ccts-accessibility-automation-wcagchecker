package cognizant.compliance.checker;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.apache.commons.io.FileUtils;
 

public class CommonUtils {

	public static String getCurrentTimeStamp() {
		LocalDateTime date = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
		return date.format(formatter);
	}
	
	public static String getCurrentDate() {
		LocalDateTime date = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		return date.format(formatter);
	}
	
	public static LocalDate convertToDate(String dateString) {
		return LocalDate.parse(dateString);
	}

	public static String getImageNameWithCurrentTimeStamp() {
		LocalDateTime date = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("ddMMyyyHHmmssSSS");
		return date.format(formatter);
	}

	public static void createDirectory(String dirPath) {
		File dir = new File(dirPath);
		if (!dir.exists()) {
			dir.mkdirs();
		}
	}
	
	public static Path getFilePath(String fileName,String extension) throws IOException {
        Path extensionPath;
        String extFilename = "/"+fileName; 
         
        InputStream extensionInputStream = CommonUtils.class.getResourceAsStream(extFilename);
        extensionPath = Files.createTempFile("", "."+extension);
        File extensionFile = extensionPath.toFile();
        FileUtils.copyInputStreamToFile(extensionInputStream, extensionFile);
        return extensionPath;
    }
	
	public static String combine(String... paths)
    {
        File file = new File(paths[0]);

        for (int i = 1; i < paths.length ; i++) {
            file = new File(file, paths[i]);
        }

        return file.getPath();
    }
}
