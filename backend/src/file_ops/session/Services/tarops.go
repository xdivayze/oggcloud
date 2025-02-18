package services

import (
	"archive/tar"
	"bufio"
	"compress/gzip"
	"fmt"
	"io"
	"log"
	"oggcloudserver/src/db"
	"oggcloudserver/src/file_ops/file"
	"os"
	"path"
	"strings"

	"github.com/google/uuid"
)

func extractFile(tarReader *tar.Reader, header *tar.Header, index int, sid uuid.UUID, previewMode bool, belongsTo *file.File) error {
	fw := strings.Split(header.Name, "/")
	fparts := strings.Split(fw[len(fw)-1], ".")

	outfilename := fmt.Sprintf("%s_%d.%s", fparts[0], index, fparts[1])
	outFilePath := fmt.Sprintf("%s/%s", currentWorkingPath, outfilename)
	outFile, err := os.Create(outFilePath)
	if err != nil {
		return fmt.Errorf("error occured while creating file at path %s:\n\t%w", outFilePath, err)
	}
	defer outFile.Close()
	bufr := bufio.NewReader(tarReader)
	bufw := bufio.NewWriter(outFile)
	if _, err = io.Copy(bufw, bufr); err != nil {
		return fmt.Errorf("error occured while writing from reader to file:\n\t%w", err)
	}
	if err = bufw.Flush(); err != nil {
		return fmt.Errorf("error occured while flushing buffered writer:\n\t%w", err)
	}
	id := uuid.New()
	fileObj := file.File{
		ID:         id,
		FileName:   outfilename,
		Size:       header.FileInfo().Size(),
		SessionID:  sid,
		HasPreview: false,
	}
	if previewMode {
		if belongsTo == nil {
			return fmt.Errorf("error: parent file object is nil")
		}
		belongsTo.PreviewID = &(fileObj.ID)
		belongsTo.Preview = &fileObj
		belongsTo.HasPreview = true
		db.DB.Save(belongsTo)

	}
	if res := db.DB.Create(&fileObj); res.Error != nil {
		return fmt.Errorf("error occured while saving to db:\n\t%w", err)
	}
	return nil
}

var currentWorkingPath string

// TODO add concurrency back <3
func extractTarGz(r io.Reader, sid uuid.UUID, previewMode bool, belongsTo *file.File) error {
	buffer := make([]byte, 1024*4)
	f, err := os.CreateTemp("", "compressedtar*.tar.gz")
	if err != nil {
		return fmt.Errorf("error creating temporary file at path %s:\n\t%w", f.Name(), err)
	}

	defer os.Remove(f.Name())

	if _, err = io.CopyBuffer(f, r, buffer); err != nil {
		return fmt.Errorf("error occured while copying file to new buffer:\n\t%w", err)
	}

	if err = f.Sync(); err != nil {
		return fmt.Errorf("error trying to sync file:\n\t%w", err)
	}

	f.Close()

	f, err = os.Open(f.Name())
	if err != nil {
		return fmt.Errorf("error occured while opening file:\n\t%w", err)
	}
	defer f.Close()

	if err := checkDirectoryValidity(f); err != nil { //ensure storage and preview directories exist and are valid
		return err
	}

	if _, err = f.Seek(0, io.SeekStart); err != nil {
		return fmt.Errorf("error while seeking to start:\n\t%w", err)
	}

	gzipReader, err := gzip.NewReader(f)
	index := 0
	if err != nil {
		return fmt.Errorf("error occured while creating new gzip reader:\n\t%w", err)
	}
	defer gzipReader.Close()
	tarReader := tar.NewReader(gzipReader)
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			log.SetPrefix("INFO: ")
			log.Println("archive end reached")
			break
		} else if err != nil {
			return fmt.Errorf("error occured while reading the next entry in tar reader:\n\t%v", err)
		}
		cp := path.Clean(header.Name)
		if cp == "." {
			continue
		}
		if header.Typeflag == tar.TypeDir && (cp == STORAGE_DIR_NAME || cp == PREVIEW_DIR_NAME) {
			index = 0
			currentWorkingPath = fmt.Sprintf("%s/%s", DirectorySession, cp)
			if err = os.MkdirAll(currentWorkingPath, 4096); err != nil {
				return fmt.Errorf("error occured creating path at %s :\n\t%w", currentWorkingPath, err)
			}
		}
		if header.Typeflag == tar.TypeReg {
			if err = extractFile(tarReader, header, index, sid, previewMode, belongsTo); err != nil {
				return fmt.Errorf("error occured while extracting file:\n\t%w", err)
			}
			index += 1
		}
	}
	return nil
}
