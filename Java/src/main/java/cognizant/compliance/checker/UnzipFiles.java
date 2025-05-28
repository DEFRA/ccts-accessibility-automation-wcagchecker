package cognizant.compliance.checker;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class UnzipFiles {
	public static void unzip(String zipFilePath, String destDirPath) {
		byte[] buffer = new byte[1024];
		try (ZipInputStream zipInputStream = new ZipInputStream(new FileInputStream(zipFilePath))) {
			ZipEntry zipEntry = zipInputStream.getNextEntry();
			while (zipEntry != null) {
				String entryName = zipEntry.getName();

				if (entryName.equalsIgnoreCase("wave.min.js")) {

					File newFile = new File(destDirPath + File.separator + entryName);
					if (zipEntry.isDirectory()) {
						newFile.mkdirs();
					} else {
						new File(newFile.getParent()).mkdirs();
						try (FileOutputStream fileOutputStream = new FileOutputStream(newFile)) {
							int length;
							while ((length = zipInputStream.read(buffer)) > 0) {
								fileOutputStream.write(buffer, 0, length);
							}
						}
					}
				}
				zipEntry = zipInputStream.getNextEntry();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
