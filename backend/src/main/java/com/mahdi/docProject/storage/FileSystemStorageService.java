package com.mahdi.docProject.storage;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
@Service
public class FileSystemStorageService implements StorageService {

	private final String fileBaseUrl = "http://localhost:9999/files/"; // Base URL to access the files
	private final Path rootLocation; // Directory where files are stored on the server

	@Autowired
	public FileSystemStorageService(StorageProperties properties) {
		if (properties.getLocation().trim().length() == 0) {
			throw new StorageException("File upload location cannot be empty.");
		}

		// Set the rootLocation to the directory where you want to store files
		this.rootLocation = Paths.get(properties.getLocation());
	}

	@Override
	public void store(MultipartFile file, String newfilename) {
		try {
			// Check if file is empty
			if (file.isEmpty()) {
				System.out.println("DEBUG: The file is empty.");
				throw new StorageException("Failed to store empty file.");
			}

			// Create the destination file path
			Path destinationFile = this.rootLocation.resolve(Paths.get(newfilename))
					.normalize().toAbsolutePath();
			System.out.println("DEBUG: Destination file path: " + destinationFile);

			// Check if the file is being stored inside the designated root location
			if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
				System.out.println("DEBUG: Security check failed. Attempted to store outside root location.");
				throw new StorageException("Cannot store file outside current directory.");
			}

			// Proceed with file storage
			System.out.println("DEBUG: Storing file...");
			try (InputStream inputStream = file.getInputStream()) {
				Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
				System.out.println("DEBUG: File stored successfully at " + destinationFile);
			}

		} catch (IOException e) {
			System.out.println("DEBUG: IOException occurred - " + e.getMessage());
			throw new StorageException("Failed to store file.", e);
		}
	}


	@Override
	public Stream<String> loadAll() {
		try {
			// Return a stream of URLs that can be accessed via the fileBaseUrl
			return Files.walk(this.rootLocation, 1)
					.filter(path -> !path.equals(this.rootLocation))
					.map(path -> fileBaseUrl + path.getFileName().toString()); // Map to file URL
		} catch (IOException e) {
			throw new StorageException("Failed to read stored files", e);
		}
	}

	@Override
	public String loadUrl(String filename) {
		return fileBaseUrl+filename;
	}


	@Override
	public Path load(String filename) {
		return rootLocation.resolve(filename);
	}


	@Override
	public void deleteAll() {
		FileSystemUtils.deleteRecursively(rootLocation.toFile());
	}

	@Override
	public void delete(String filename) {
		try {
			Path file = load(filename);
			if (Files.exists(file)) {
				Files.delete(file); // Delete the file if it exists
			} else {
				throw new StorageFileNotFoundException("Could not delete file: " + filename + " (file not found)");
			}
		} catch (IOException e) {
			throw new StorageException("Failed to delete file: " + filename, e);
		}
	}

	@Override
	public void init() {
		try {
			// Create the directory if it doesn't exist
			if (!Files.exists(rootLocation)) {
				Files.createDirectories(rootLocation);
			}
		} catch (IOException e) {
			throw new StorageException("Could not initialize storage", e);
		}
	}
}
