package cognizant.compliance.checker;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;

public class HttpDownloadUtility {

	public static void downloadFile(String fileURL, String saveDir, String fileName) throws IOException {

		CommonUtils.createDirectory(saveDir);

		URL url = new URL(fileURL);
		HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
		int responseCode = httpConn.getResponseCode();

		if (responseCode == HttpURLConnection.HTTP_OK) {

			InputStream inputStream = httpConn.getInputStream();
			ArrayBufferToZip(inputStream.readAllBytes(), saveDir + "\\" + fileName);
			inputStream.close();

			System.out.println("File downloaded");
		} else {
			System.out.println("No file to download. Server replied HTTP code: " + responseCode);
		}
		httpConn.disconnect();
	}

	public static void ArrayBufferToZip(byte[] data, String fileName) {

		FileOutputStream outputStream = null;

		try {

			ByteBuffer buf = ByteBuffer.wrap(data);
			buf.order(ByteOrder.LITTLE_ENDIAN);
			int publicKeyLength, signatureLength, header, zipStartOffset;
			if (buf.get(4) == 2) {
				header = 16;
				publicKeyLength = 0 + buf.get(8) + (buf.get(9) << 8) + (buf.get(10) << 16) + (buf.get(11) << 24);
				signatureLength = 0 + buf.get(12) + (buf.get(13) << 8) + (buf.get(14) << 16) + (buf.get(15) << 24);
				zipStartOffset = header + publicKeyLength + signatureLength;
			} else {
				publicKeyLength = 0 + buf.get(8) + (buf.get(9) << 8) + (buf.get(10) << 16) + (buf.get(11) << 24 >>> 0);
				zipStartOffset = 12 + publicKeyLength;
			}
			// 16 = Magic number (4), CRX format version (4), lengths (2x4)
			byte[] zipFragment = Arrays.copyOfRange(data, zipStartOffset, data.length);

			outputStream = new FileOutputStream(fileName);
			outputStream.write(zipFragment);

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (outputStream != null) {
					outputStream.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
