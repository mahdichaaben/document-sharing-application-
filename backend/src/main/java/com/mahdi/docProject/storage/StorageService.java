package com.mahdi.docProject.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {

	void init();

	void store(MultipartFile file,String newfilename);

	Stream<String> loadAll();

	Path load(String filename);

	String loadUrl(String filename);


	void deleteAll();

	void delete(String filename);


}
