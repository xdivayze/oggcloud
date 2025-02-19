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

func contains(arr []string, val string) bool {
	for _, v := range arr {
		if v == val {
			return true
		}
	}
	return false
}

func checkDirectoryValidity(r io.Reader) error {
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

func determineDirectories(r io.Reader) (map[string]*directory, error) {
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
		if header.Typeflag == tar.TypeDir {
			dir.name = header.Name
			dir.path = cleanPath
			dirs[header.Name] = &dir
		} else if header.Typeflag == tar.TypeReg {
			fdir := path.Dir(cleanPath)
			if fdir != "." {
				dirobj, exists := func() (*directory, bool) {
					lx := strings.Split("/", cleanPath)
					last := lx[len(lx)-1]
					dirobj, s := dirs[last]
					if dirobj.path != fdir {
						s = false
					}
					return dirobj, s
				}()
				if !exists {
					return nil, fmt.Errorf("orphaned file with path:\n\t%s", cleanPath)
				}
				dirobj.filenames = append(dirobj.filenames, header.Name)
			}
		}
	}
	return dirs, nil

}
