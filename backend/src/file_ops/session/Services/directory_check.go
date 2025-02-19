package services

import (
	"archive/tar"
	"compress/gzip"
	"fmt"
	"io"
	"log"
	"path"
	"strings"
)

const STORAGE_DIR_NAME = "Storage"
const PREVIEW_DIR_NAME = "Preview"
const CHECKSUM_FILENAME = "checksum.json"

type directory struct {
	filenames []string
	name      string
	path      string
}

func contains[K comparable](arr []K, val K) bool {
	for _, v := range arr {
		if v == val {
			return true
		}
	}
	return false
}

func checkDirectoryValidity(r io.ReadSeeker) error {
	dirs, err := determineDirectories(r)
	if err != nil {
		return fmt.Errorf("error occured while determining directories:\n\t%w", err)
	}
	fields := []string{STORAGE_DIR_NAME, PREVIEW_DIR_NAME}
	if err = doDirFieldCheck(dirs, fields); err != nil {
		return err
	}

	storage_dir := dirs[STORAGE_DIR_NAME]
	preview_dir := dirs[PREVIEW_DIR_NAME]

	if len(preview_dir.filenames) != len(storage_dir.filenames) {
		return fmt.Errorf("storage_dir and preview_dir have non-identical lengths")
	}
	if !contains(storage_dir.filenames, CHECKSUM_FILENAME) {
		return fmt.Errorf("storage directory doesn't contain checksum file")
	}
	if !contains(preview_dir.filenames, CHECKSUM_FILENAME) {
		return fmt.Errorf("preview directory doesn't contain checksum file")
	}

	return nil
}

func doDirFieldCheck(m map[string]*directory, fields []string) error {
	for _, field := range fields {
		if _, s := m[field]; !s {
			return fmt.Errorf("field %s doesn't exist", field)
		}
	}
	return nil
}

func determineDirectories(r io.ReadSeeker) (map[string]*directory, error) {
	gzipReader, err := gzip.NewReader(r)
	if err != nil {
		return nil, fmt.Errorf("error occured while creating new gzip reader:\n\t%w", err)
	}
	defer gzipReader.Close()
	tarReader := tar.NewReader(gzipReader)
	dirs := make(map[string]*directory)
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			log.SetPrefix("INFO: ")
			log.Println("archive end reached")
			break
		} else if err != nil {
			return nil, fmt.Errorf("error occured while reading the next entry in tar reader:\n\t%v", err)
		}
		dir := directory{}

		cleanPath := path.Clean(header.Name)
		if cleanPath == "." {
			continue
		}
		if header.Typeflag == tar.TypeDir {
			dir.name = cleanPath
			dir.path = header.Name 
			dirs[cleanPath] = &dir
		} else if header.Typeflag == tar.TypeReg {
			fdir := path.Dir(cleanPath)
			lx := strings.Split(cleanPath,"/")
			if fdir != "." {
				dirobj, exists := func() (*directory, bool) {
					
					dirname := lx[len(lx)-2]
					dirobj, s := dirs[dirname]
					if dirobj.name != fdir {
						s = false
					}
					return dirobj, s
				}()
				if !exists {
					return nil, fmt.Errorf("orphaned file with path:\n\t%s", cleanPath)
				}
				dirobj.filenames = append(dirobj.filenames, lx[len(lx)-1])
			}
		}
	}
	return dirs, nil

}
